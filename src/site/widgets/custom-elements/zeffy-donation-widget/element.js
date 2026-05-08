/**
 * Zeffy Donation Widget — Custom Element
 *
 * Vanilla JS, no external dependencies, no imports.
 * Registers: <zeffy-donation-widget>
 *
 * Observed attributes (all data-prefixed, mapped from Wix props):
 *   data-display-mode       "inline" | "button"
 *   data-form-url           Full zeffy.com donation-form URL (user-facing format)
 *   data-embed-width        number
 *   data-embed-width-unit   "%" | "px"
 *   data-embed-height       number
 *   data-button-text        string
 *   data-button-bg-color    CSS color string
 *   data-button-text-color  CSS color string
 *
 * URL transformation:
 *   In:  https://www.zeffy.com/[locale]/donation-form/[slug][?query]
 *   Out: https://www.zeffy.com/embed/donation-form/[slug]
 */

(function () {
  'use strict';

  /* ─── Constants ─────────────────────────────────────────── */

  var DEMO_URL = 'https://www.zeffy.com/en-US/donation-form/zeffy-demo-donation-form';
  var ZEFFY_SIGNUP = 'https://www.zeffy.com/register';

  /* ─── URL Helpers ────────────────────────────────────────── */

  function isValidZeffyUrl(url) {
    return typeof url === 'string' &&
      url.indexOf('zeffy.com') !== -1 &&
      url.indexOf('/donation-form/') !== -1;
  }

  function toEmbedUrl(url) {
    if (!url) return null;
    var match = url.match(/\/donation-form\/([^/?#]+)/);
    if (!match || !match[1]) return null;
    return 'https://www.zeffy.com/embed/donation-form/' + match[1];
  }

  /* ─── Inline Styles ──────────────────────────────────────── */

  var HOST_STYLE = [
    ':host {',
    '  display: block;',
    '  box-sizing: border-box;',
    '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;',
    '}',
    '* { box-sizing: border-box; }',

    '.zeffy-iframe {',
    '  display: block;',
    '  border: none;',
    '  border-radius: 8px;',
    '}',

    '.zeffy-btn {',
    '  border: none;',
    '  padding: 12px 32px;',
    '  font-size: 16px;',
    '  border-radius: 4px;',
    '  cursor: pointer;',
    '  line-height: 1.5;',
    '  transition: opacity 0.2s;',
    '}',
    '.zeffy-btn:hover { opacity: 0.85; }',

    '.zeffy-modal-overlay {',
    '  position: fixed;',
    '  inset: 0;',
    '  z-index: 99999;',
    '  background: rgba(0,0,0,0.75);',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '}',

    '.zeffy-modal-box {',
    '  position: relative;',
    '  background: #fff;',
    '  border-radius: 8px;',
    '  width: 90%;',
    '  max-width: 800px;',
    '  height: 90vh;',
    '  overflow: hidden;',
    '  box-shadow: 0 5px 30px rgba(0,0,0,0.5);',
    '}',

    '.zeffy-modal-close {',
    '  position: absolute;',
    '  top: 12px;',
    '  right: 16px;',
    '  z-index: 100000;',
    '  background: #fff;',
    '  border: none;',
    '  border-radius: 50%;',
    '  width: 40px;',
    '  height: 40px;',
    '  font-size: 24px;',
    '  line-height: 1;',
    '  cursor: pointer;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  box-shadow: 0 2px 10px rgba(0,0,0,0.25);',
    '}',
    '.zeffy-modal-close:hover { background: #f5f5f5; }',

    '.zeffy-modal-iframe {',
    '  display: block;',
    '  width: 100%;',
    '  height: 100%;',
    '  border: none;',
    '}',

    '.zeffy-state-box {',
    '  padding: 24px;',
    '  border-radius: 8px;',
    '  text-align: center;',
    '  line-height: 1.6;',
    '}',
    '.zeffy-state-box.error {',
    '  background: #fff3f3;',
    '  border: 1px solid #f5c6cb;',
    '  color: #721c24;',
    '}',
    '.zeffy-state-box.onboarding {',
    '  background: #f0f8ff;',
    '  border: 1px solid #b8d4f0;',
    '  color: #1a3a5c;',
    '}',
    '.zeffy-state-box a {',
    '  color: #007bff;',
    '  font-weight: 600;',
    '  text-decoration: none;',
    '}',
    '.zeffy-state-box a:hover { text-decoration: underline; }',
  ].join('\n');

  /* ─── Custom Element Class ───────────────────────────────── */

  class ZeffyDonationWidget extends HTMLElement {

    constructor() {
      super();
      this._shadow = this.attachShadow({ mode: 'open' });
      this._modalOpen = false;
      this._escHandler = null;
    }

    static get observedAttributes() {
      return [
        'data-display-mode',
        'data-form-url',
        'data-embed-width',
        'data-embed-width-unit',
        'data-embed-height',
        'data-button-text',
        'data-button-bg-color',
        'data-button-text-color',
      ];
    }

    connectedCallback() {
      this._render();
    }

    attributeChangedCallback() {
      this._render();
    }

    _prop(name, fallback) {
      var v = this.getAttribute(name);
      return (v !== null && v !== '') ? v : fallback;
    }

    _propNum(name, fallback) {
      var v = parseFloat(this.getAttribute(name));
      return isNaN(v) ? fallback : v;
    }

    _render() {
      var mode      = this._prop('data-display-mode', 'inline');
      var formUrl   = this._prop('data-form-url', '');
      var width     = this._propNum('data-embed-width', 100);
      var widthUnit = this._prop('data-embed-width-unit', '%');
      var height    = this._propNum('data-embed-height', 700);
      var btnText   = this._prop('data-button-text', 'Donate Now');
      var btnBg     = this._prop('data-button-bg-color', '#007bff');
      var btnColor  = this._prop('data-button-text-color', '#ffffff');

      var embedUrl = null;
      var state = 'ok';

      if (!formUrl || formUrl === '') {
        state = 'onboarding';
      } else if (formUrl === DEMO_URL || isValidZeffyUrl(formUrl)) {
        embedUrl = toEmbedUrl(formUrl);
        if (!embedUrl) {
          state = 'error';
        } else {
          state = (formUrl === DEMO_URL) ? 'demo' : 'ok';
        }
      } else {
        state = 'error';
      }

      var shadow = this._shadow;

      while (shadow.firstChild) {
        shadow.removeChild(shadow.firstChild);
      }

      var styleEl = document.createElement('style');
      styleEl.textContent = HOST_STYLE;
      shadow.appendChild(styleEl);

      if (state === 'onboarding') {
        shadow.appendChild(this._buildOnboarding(mode, btnText, btnBg, btnColor));
        return;
      }

      if (state === 'error') {
        shadow.appendChild(this._buildError(formUrl));
        return;
      }

      if (mode === 'button') {
        shadow.appendChild(this._buildButton(embedUrl, btnText, btnBg, btnColor));
      } else {
        shadow.appendChild(this._buildInline(embedUrl, width, widthUnit, height));
      }
    }

    _buildInline(embedUrl, width, widthUnit, height) {
      var iframe = document.createElement('iframe');
      iframe.className = 'zeffy-iframe';
      iframe.src = embedUrl;
      iframe.setAttribute('allowpaymentrequest', '');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('scrolling', 'yes');
      iframe.setAttribute('frameborder', '0');
      iframe.style.width = width + widthUnit;
      iframe.style.height = height + 'px';
      return iframe;
    }

    _buildButton(embedUrl, btnText, btnBg, btnColor) {
      var self = this;
      var wrapper = document.createElement('div');

      var btn = document.createElement('button');
      btn.className = 'zeffy-btn';
      btn.textContent = btnText;
      btn.style.backgroundColor = btnBg;
      btn.style.color = btnColor;

      btn.addEventListener('click', function () {
        self._openModal(embedUrl);
      });

      wrapper.appendChild(btn);
      return wrapper;
    }

    _openModal(embedUrl) {
      var self = this;
      var shadow = this._shadow;

      var overlay = document.createElement('div');
      overlay.className = 'zeffy-modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Donation form');

      var box = document.createElement('div');
      box.className = 'zeffy-modal-box';

      var closeBtn = document.createElement('button');
      closeBtn.className = 'zeffy-modal-close';
      closeBtn.textContent = '×';
      closeBtn.setAttribute('aria-label', 'Close donation form');

      var iframe = document.createElement('iframe');
      iframe.className = 'zeffy-modal-iframe';
      iframe.src = embedUrl;
      iframe.setAttribute('allowpaymentrequest', '');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('scrolling', 'yes');
      iframe.setAttribute('frameborder', '0');

      box.appendChild(closeBtn);
      box.appendChild(iframe);
      overlay.appendChild(box);
      shadow.appendChild(overlay);
      this._modalOpen = true;

      document.body.style.overflow = 'hidden';

      function close() {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        document.body.style.overflow = '';
        self._modalOpen = false;
        document.removeEventListener('keydown', self._escHandler);
        self._escHandler = null;
      }

      closeBtn.addEventListener('click', close);

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });

      this._escHandler = function (e) {
        if (e.key === 'Escape') close();
      };
      document.addEventListener('keydown', this._escHandler);
    }

    _buildOnboarding(mode, btnText, btnBg, btnColor) {
      var box = document.createElement('div');
      box.className = 'zeffy-state-box onboarding';

      var preview = document.createElement('div');
      preview.style.cssText = 'margin-bottom:16px;';

      if (mode === 'button') {
        var previewBtn = document.createElement('button');
        previewBtn.className = 'zeffy-btn';
        previewBtn.textContent = btnText || 'Donate Now';
        previewBtn.style.backgroundColor = btnBg || '#007bff';
        previewBtn.style.color = btnColor || '#ffffff';
        previewBtn.style.pointerEvents = 'none';
        preview.appendChild(previewBtn);
      }

      box.appendChild(preview);

      var title = document.createElement('p');
      title.style.cssText = 'font-size:16px;font-weight:600;margin:0 0 8px;';
      title.textContent = 'New to Zeffy?';

      var sub = document.createElement('p');
      sub.style.cssText = 'font-size:14px;margin:0 0 12px;';
      sub.textContent = 'Create a free account and donation form, then paste your form URL in the settings panel on the right.';

      var link = document.createElement('a');
      link.href = ZEFFY_SIGNUP;
      link.textContent = 'Sign up for free at Zeffy.com';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      box.appendChild(title);
      box.appendChild(sub);
      box.appendChild(link);
      return box;
    }

    _buildError(attemptedUrl) {
      var box = document.createElement('div');
      box.className = 'zeffy-state-box error';

      var title = document.createElement('p');
      title.style.cssText = 'font-size:15px;font-weight:600;margin:0 0 8px;';
      title.textContent = 'Invalid Zeffy URL';

      var sub = document.createElement('p');
      sub.style.cssText = 'font-size:13px;margin:0 0 10px;';
      sub.textContent = 'The URL must be a Zeffy donation form link, e.g.:';

      var example = document.createElement('code');
      example.style.cssText = 'display:block;font-size:12px;word-break:break-all;background:#ffeaea;padding:6px 10px;border-radius:4px;margin-bottom:10px;';
      example.textContent = 'https://www.zeffy.com/en-US/donation-form/your-form-slug';

      var note = document.createElement('p');
      note.style.cssText = 'font-size:12px;margin:0;color:#a00;';
      note.textContent = 'You entered: ' + (attemptedUrl || '(empty)');

      box.appendChild(title);
      box.appendChild(sub);
      box.appendChild(example);
      box.appendChild(note);
      return box;
    }
  }

  /* ─── Register ───────────────────────────────────────────── */
  if (!customElements.get('zeffy-donation-widget')) {
    customElements.define('zeffy-donation-widget', ZeffyDonationWidget);
  }

}());
