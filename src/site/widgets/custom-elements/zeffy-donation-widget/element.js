/**
 * Zeffy Donation Widget — Custom Element
 *
 * User pastes a Zeffy donation form URL in the settings panel.
 * The widget renders a styled button; clicking it opens the form
 * in a modal overlay.
 *
 * Observed attributes (kebab-case, set via widget.setProp):
 *   form-url                  Full zeffy.com donation-form URL
 *   button-text               Label text
 *   button-bg-color           CSS color
 *   button-text-color         CSS color
 *   button-theme              Preset id (or '' for custom)
 *   button-border-radius      px (string-encoded)
 *   button-shadow             "none" | "sm" | "md" | "lg"
 *   button-border-width       px (string-encoded)
 *   button-border-color       CSS color
 *   button-gradient-enabled   "true" | "false"
 *   button-gradient-color2    CSS color (gradient end)
 *   button-font-size          px (string-encoded)
 *   button-width-px           px, 0 = auto (string-encoded)
 *   button-padding-x          px (string-encoded)
 *   button-padding-y          px (string-encoded)
 */

var DEMO_URL     = 'https://www.zeffy.com/en-US/donation-form/zeffy-demo-donation-form';
var ZEFFY_SIGNUP = 'https://www.zeffy.com/register';

var SHADOW_VALUES = {
  'none': '',
  'sm':   '0 2px 4px rgba(0,0,0,0.15)',
  'md':   '0 4px 12px rgba(0,0,0,0.25)',
  'lg':   '0 8px 24px rgba(0,0,0,0.35)',
};

function isValidZeffyUrl(url) {
  return typeof url === 'string' &&
    url.indexOf('zeffy.com') !== -1 &&
    url.indexOf('/donation-form/') !== -1;
}

function toEmbedSlug(url) {
  var match = url.match(/\/donation-form\/([^/?#]+)/);
  return match ? match[1] : null;
}

var HOST_STYLE = [
  ':host {',
  '  display: block;',
  '  width: 100% !important;',
  '  max-width: 100% !important;',
  '  box-sizing: border-box;',
  '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;',
  '}',
  '* { box-sizing: border-box; }',

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
  '.zeffy-state-box a { color: #007bff; font-weight: 600; text-decoration: none; }',
  '.zeffy-state-box a:hover { text-decoration: underline; }',
].join('\n');

class ZeffyDonationWidget extends HTMLElement {

  constructor() {
    super();
    this._shadow     = this.attachShadow({ mode: 'open' });
    this._modalOpen  = false;
    this._escHandler = null;

    // Bootstrap placeholder prevents the Wix editor "failed to load" icon
    // during the gap between constructor and connectedCallback.
    try {
      var styleEl = document.createElement('style');
      styleEl.textContent = HOST_STYLE;
      this._shadow.appendChild(styleEl);
      this._shadow.appendChild(this._buildBootstrapPlaceholder());
    } catch (e) {}
  }

  _buildBootstrapPlaceholder() {
    var box = document.createElement('div');
    box.className = 'zeffy-state-box onboarding';
    box.style.cssText = 'min-height:120px;display:flex;align-items:center;justify-content:center;';
    var label = document.createElement('div');
    label.style.cssText = 'font-size:14px;font-weight:600;';
    label.textContent = 'Zeffy donation form';
    box.appendChild(label);
    return box;
  }

  static get observedAttributes() {
    return [
      'form-url',
      'button-text',
      'button-bg-color',
      'button-text-color',
      'button-theme',
      'button-border-radius',
      'button-shadow',
      'button-border-width',
      'button-border-color',
      'button-gradient-enabled',
      'button-gradient-color2',
      'button-font-size',
      'button-width-px',
      'button-padding-x',
      'button-padding-y',
    ];
  }

  connectedCallback()        { this._render(); }
  attributeChangedCallback() { this._render(); }

  _prop(name, fallback) {
    var v = this.getAttribute(name);
    return (v !== null && v !== '') ? v : fallback;
  }

  _render() {
    var formUrl        = this._prop('form-url',               '');
    var btnText        = this._prop('button-text',            'Donate Now');
    var btnBg          = this._prop('button-bg-color',        '#219653');
    var btnColor       = this._prop('button-text-color',      '#ffffff');
    var btnRadius      = this._prop('button-border-radius',   '6');
    var btnShadow      = this._prop('button-shadow',          'none');
    var btnBorderWidth = this._prop('button-border-width',    '0');
    var btnBorderColor = this._prop('button-border-color',    '#219653');
    var btnGradEnabled = this._prop('button-gradient-enabled','false');
    var btnGrad2       = this._prop('button-gradient-color2', '#005BBB');
    var btnFontSize    = this._prop('button-font-size',       '16');
    var btnWidthPx     = this._prop('button-width-px',        '0');
    var btnPaddingX    = this._prop('button-padding-x',       '32');
    var btnPaddingY    = this._prop('button-padding-y',       '12');

    var styleProps = {
      btnText: btnText, btnBg: btnBg, btnColor: btnColor,
      btnRadius: btnRadius, btnShadow: btnShadow,
      btnBorderWidth: btnBorderWidth, btnBorderColor: btnBorderColor,
      btnGradEnabled: btnGradEnabled, btnGrad2: btnGrad2,
      btnFontSize: btnFontSize, btnWidthPx: btnWidthPx,
      btnPaddingX: btnPaddingX, btnPaddingY: btnPaddingY,
    };

    this.style.minHeight = '40px';

    var embedUrl = null;
    var state    = 'ok';

    if (!formUrl) {
      state = 'onboarding';
    } else if (formUrl === DEMO_URL || isValidZeffyUrl(formUrl)) {
      var slug = toEmbedSlug(formUrl);
      embedUrl = slug ? 'https://www.zeffy.com/embed/donation-form/' + slug : null;
      state    = embedUrl ? ((formUrl === DEMO_URL) ? 'demo' : 'ok') : 'error';
    } else {
      state = 'error';
    }

    var shadow = this._shadow;
    while (shadow.firstChild) shadow.removeChild(shadow.firstChild);
    var styleEl = document.createElement('style');
    styleEl.textContent = HOST_STYLE;
    shadow.appendChild(styleEl);

    if (state === 'onboarding') { shadow.appendChild(this._buildOnboarding(styleProps)); return; }
    if (state === 'error')      { shadow.appendChild(this._buildError(formUrl));          return; }
    shadow.appendChild(this._buildButton(embedUrl, styleProps));
  }

  _computeButtonStyle(styleProps) {
    var bg          = styleProps.btnBg || '#219653';
    var text        = styleProps.btnColor || '#ffffff';
    var radius      = parseInt(styleProps.btnRadius || '6', 10);
    var shadowVal   = SHADOW_VALUES[styleProps.btnShadow] || '';
    var borderWidth = parseInt(styleProps.btnBorderWidth || '0', 10);
    var borderColor = styleProps.btnBorderColor || bg;
    var gradEnabled = styleProps.btnGradEnabled === 'true';
    var grad2       = styleProps.btnGrad2 || '#005BBB';
    var fontSize    = parseInt(styleProps.btnFontSize || '16', 10);
    var widthPx     = parseInt(styleProps.btnWidthPx || '0', 10);
    var paddingX    = parseInt(styleProps.btnPaddingX || '32', 10);
    var paddingY    = parseInt(styleProps.btnPaddingY || '12', 10);

    var parts = [];
    if (gradEnabled) {
      parts.push('background: linear-gradient(135deg, ' + bg + ', ' + grad2 + ')');
    } else {
      parts.push('background-color: ' + bg);
    }
    parts.push('color: ' + text);
    parts.push('border-radius: ' + radius + 'px');
    parts.push(borderWidth > 0
      ? 'border: ' + borderWidth + 'px solid ' + borderColor
      : 'border: none');
    if (shadowVal) parts.push('box-shadow: ' + shadowVal);
    parts.push('font-size: ' + fontSize + 'px');
    parts.push('font-weight: 600');
    parts.push('font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif');
    parts.push(widthPx > 0 ? 'width: ' + widthPx + 'px' : 'width: auto');
    parts.push('padding: ' + paddingY + 'px ' + paddingX + 'px');
    parts.push('cursor: pointer');
    parts.push('line-height: 1.5');
    parts.push('transition: opacity 0.2s');
    return parts.join('; ');
  }

  _buildButton(embedUrl, styleProps) {
    var self    = this;
    var wrapper = document.createElement('div');
    var btn     = document.createElement('button');
    btn.style.cssText = this._computeButtonStyle(styleProps);
    btn.textContent   = styleProps.btnText || 'Donate Now';
    btn.addEventListener('mouseover', function () { btn.style.opacity = '0.85'; });
    btn.addEventListener('mouseout',  function () { btn.style.opacity = '1'; });
    btn.addEventListener('click',     function () { self._openModal(embedUrl); });
    wrapper.appendChild(btn);
    return wrapper;
  }

  _openModal(embedUrl) {
    var self   = this;
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
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.body.style.overflow = '';
      self._modalOpen = false;
      document.removeEventListener('keydown', self._escHandler);
      self._escHandler = null;
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    this._escHandler = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', this._escHandler);
  }

  _buildOnboarding(styleProps) {
    var box = document.createElement('div');
    box.className = 'zeffy-state-box onboarding';

    var preview    = document.createElement('div');
    preview.style.cssText = 'margin-bottom:16px;';
    var previewBtn = document.createElement('button');
    previewBtn.style.cssText    = this._computeButtonStyle(styleProps);
    previewBtn.style.pointerEvents = 'none';
    previewBtn.textContent      = styleProps.btnText || 'Donate Now';
    preview.appendChild(previewBtn);
    box.appendChild(preview);

    var title = document.createElement('p');
    title.style.cssText = 'font-size:16px;font-weight:600;margin:0 0 8px;';
    title.textContent   = 'New to Zeffy?';

    var sub = document.createElement('p');
    sub.style.cssText = 'font-size:14px;margin:0 0 12px;';
    sub.textContent   = 'Create a free account and donation form, then paste your form URL in the settings panel.';

    var link = document.createElement('a');
    link.href        = ZEFFY_SIGNUP;
    link.textContent = 'Sign up for free at Zeffy.com';
    link.target      = '_blank';
    link.rel         = 'noopener noreferrer';

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
    title.textContent   = 'Invalid Zeffy URL';

    var sub = document.createElement('p');
    sub.style.cssText = 'font-size:13px;margin:0 0 10px;';
    sub.textContent   = 'The URL must be a Zeffy donation form link, e.g.:';

    var example = document.createElement('code');
    example.style.cssText = 'display:block;font-size:12px;word-break:break-all;background:#ffeaea;padding:6px 10px;border-radius:4px;margin-bottom:10px;';
    example.textContent   = 'https://www.zeffy.com/en-US/donation-form/your-form-slug';

    var note = document.createElement('p');
    note.style.cssText = 'font-size:12px;margin:0;color:#a00;';
    note.textContent   = 'You entered: ' + (attemptedUrl || '(empty)');

    box.appendChild(title);
    box.appendChild(sub);
    box.appendChild(example);
    box.appendChild(note);
    return box;
  }
}

export default ZeffyDonationWidget;
