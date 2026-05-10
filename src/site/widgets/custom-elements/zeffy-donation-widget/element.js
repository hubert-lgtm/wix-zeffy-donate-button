/**
 * Zeffy Donation Widget — Custom Element
 *
 * Exported as a default class so the Wix CLI script-asset wrapper can
 * inject accessTokenListener and call customElements.define itself.
 * Do NOT call customElements.define here.
 *
 * Observed attributes (kebab-case, set by panel via widget.setProp):
 *   display-mode       "inline" | "button"
 *   form-url           Full zeffy.com donation-form URL (user-facing format)
 *   embed-width        number (string-encoded)
 *   embed-width-unit   "%" | "px"
 *   embed-height       number (string-encoded)
 *   button-text        string
 *   button-bg-color    CSS color string
 *   button-text-color  CSS color string
 *
 * URL transformation:
 *   In:  https://www.zeffy.com/[locale]/donation-form/[slug][?query]
 *   Out: https://www.zeffy.com/embed/donation-form/[slug]
 */

var DEMO_URL = 'https://www.zeffy.com/en-US/donation-form/zeffy-demo-donation-form';
var ZEFFY_SIGNUP = 'https://www.zeffy.com/register';

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

var HOST_STYLE = [
  // Force the widget host to fill its parent container width. Wix's editor
  // gives custom elements a fixed default width (600px) that ignores the
  // surrounding section's actual width — so the donation form ends up
  // squeezed into a narrow column on wider page layouts. The !important is
  // required to override Wix's inline `width: Npx` style on the host element.
  ':host {',
  '  display: block;',
  '  width: 100% !important;',
  '  max-width: 100% !important;',
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

class ZeffyDonationWidget extends HTMLElement {

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._modalOpen = false;
    this._escHandler = null;

    // Render visible content synchronously in the constructor so Wix's editor
    // preview shows our widget — not Wix's "element failed to load" placeholder
    // overlay (the giant exclamation icon). Without this, the editor renders
    // a fallback graphic in the gap between element creation and the first
    // connectedCallback → _render() call.
    try {
      var styleEl = document.createElement('style');
      styleEl.textContent = HOST_STYLE;
      this._shadow.appendChild(styleEl);
      this._shadow.appendChild(this._buildBootstrapPlaceholder());
    } catch (e) {
      // Defensive — never throw from constructor
    }
  }

  _buildBootstrapPlaceholder() {
    // Minimal styled placeholder shown until the first _render() runs. Looks
    // like a clean "loading" state — never the broken exclamation icon.
    var box = document.createElement('div');
    box.className = 'zeffy-state-box onboarding';
    box.style.minHeight = '120px';
    box.style.display = 'flex';
    box.style.alignItems = 'center';
    box.style.justifyContent = 'center';
    var label = document.createElement('div');
    label.style.fontSize = '14px';
    label.style.fontWeight = '600';
    label.textContent = 'Zeffy donation form';
    box.appendChild(label);
    return box;
  }

  static get observedAttributes() {
    return [
      'display-mode',
      'form-url',
      'embed-width',
      'embed-width-unit',
      'embed-height',
      'button-text',
      'button-bg-color',
      'button-text-color',
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
    var mode      = this._prop('display-mode', 'inline');
    var formUrl   = this._prop('form-url', '');
    var width     = this._propNum('embed-width', 100);
    var widthUnit = this._prop('embed-width-unit', '%');
    var height    = this._propNum('embed-height', 700);
    var btnText   = this._prop('button-text', 'Donate Now');
    var btnBg     = this._prop('button-bg-color', '#007bff');
    var btnColor  = this._prop('button-text-color', '#ffffff');

    // Bug A fix: min-height is mode-conditional so button mode works at 40–60px
    this.style.minHeight = (mode === 'button') ? '40px' : '200px';

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
    // Bug B Part 2 fix: clamp % width to 100 as a safety net against invalid values
    var safeWidth = (widthUnit === '%' && width > 100) ? 100 : width;
    var iframe = document.createElement('iframe');
    iframe.className = 'zeffy-iframe';
    iframe.src = embedUrl;
    iframe.setAttribute('allowpaymentrequest', '');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('scrolling', 'yes');
    iframe.setAttribute('frameborder', '0');
    iframe.style.width = safeWidth + widthUnit;
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

export default ZeffyDonationWidget;
