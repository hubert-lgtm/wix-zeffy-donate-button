/**
 * Zeffy Donation Widget — Settings Panel
 *
 * Uses the Wix panel SDK ($panel) to render a settings UI in the Wix editor.
 * All prop changes are committed back to the widget via $panel.set().
 *
 * Fields:
 *   displayMode      — radio group: "inline" | "button"
 *   formUrl          — text input + helper + signup link
 *   embedWidth       — number input (inline only)
 *   embedWidthUnit   — select: "%" | "px" (inline only)
 *   embedHeight      — number input (inline only)
 *   buttonText       — text input (button only)
 *   buttonBgColor    — color input (button only)
 *   buttonTextColor  — color input (button only)
 */

$panel.onPropsChanged(function (props) {
  /* Called once on panel open and whenever props change externally */
  render(props);
});

function render(props) {
  var mode = props.displayMode || 'inline';
  var isInline = mode === 'inline';
  var isButton = mode === 'button';

  $panel.set([

    /* ─────────────────────────────────────────────────────
       SECTION: Display Mode
    ───────────────────────────────────────────────────── */
    {
      type: 'section',
      label: 'Display Mode',
    },
    {
      type: 'radioGroup',
      id: 'displayMode',
      label: 'How should the form appear?',
      value: mode,
      options: [
        { value: 'inline', label: 'Inline — embed the form directly on the page' },
        { value: 'button', label: 'Button — open the form in a popup modal' },
      ],
      onChange: function (newMode) {
        $panel.updateProps({ displayMode: newMode });
      },
    },

    /* ─────────────────────────────────────────────────────
       SECTION: Donation Form
    ───────────────────────────────────────────────────── */
    {
      type: 'section',
      label: 'Donation Form',
    },
    {
      type: 'textInput',
      id: 'formUrl',
      label: 'Zeffy Form URL',
      value: props.formUrl || '',
      placeholder: 'https://www.zeffy.com/en-US/donation-form/your-form',
      helperText: 'Paste the full Zeffy donation form URL. The widget converts it to the embed format automatically.',
      onChange: function (value) {
        $panel.updateProps({ formUrl: value });
      },
    },
    {
      type: 'text',
      id: 'signupPrompt',
      value: "Don't have a Zeffy account yet?",
    },
    {
      type: 'link',
      id: 'signupLink',
      label: 'Sign up for free at Zeffy.com',
      url: 'https://www.zeffy.com/register',
      target: '_blank',
    },

    /* ─────────────────────────────────────────────────────
       SECTION: Inline Size  (visible only in inline mode)
    ───────────────────────────────────────────────────── */
    {
      type: 'section',
      label: 'Embed Size',
      hidden: !isInline,
    },
    {
      type: 'numberInput',
      id: 'embedWidth',
      label: 'Width',
      value: props.embedWidth !== undefined ? props.embedWidth : 100,
      min: 1,
      max: 5000,
      hidden: !isInline,
      onChange: function (value) {
        $panel.updateProps({ embedWidth: value });
      },
    },
    {
      type: 'dropdown',
      id: 'embedWidthUnit',
      label: 'Width unit',
      value: props.embedWidthUnit || '%',
      options: [
        { value: '%', label: '% (percentage of container)' },
        { value: 'px', label: 'px (fixed pixels)' },
      ],
      hidden: !isInline,
      onChange: function (value) {
        $panel.updateProps({ embedWidthUnit: value });
      },
    },
    {
      type: 'numberInput',
      id: 'embedHeight',
      label: 'Height (px)',
      value: props.embedHeight !== undefined ? props.embedHeight : 700,
      min: 200,
      max: 5000,
      hidden: !isInline,
      onChange: function (value) {
        $panel.updateProps({ embedHeight: value });
      },
    },

    /* ─────────────────────────────────────────────────────
       SECTION: Button Style  (visible only in button mode)
    ───────────────────────────────────────────────────── */
    {
      type: 'section',
      label: 'Button Style',
      hidden: !isButton,
    },
    {
      type: 'textInput',
      id: 'buttonText',
      label: 'Button Label',
      value: props.buttonText || 'Donate Now',
      placeholder: 'Donate Now',
      hidden: !isButton,
      onChange: function (value) {
        $panel.updateProps({ buttonText: value });
      },
    },
    {
      type: 'colorInput',
      id: 'buttonBgColor',
      label: 'Button Background Color',
      value: props.buttonBgColor || '#007bff',
      hidden: !isButton,
      onChange: function (value) {
        $panel.updateProps({ buttonBgColor: value });
      },
    },
    {
      type: 'colorInput',
      id: 'buttonTextColor',
      label: 'Button Text Color',
      value: props.buttonTextColor || '#ffffff',
      hidden: !isButton,
      onChange: function (value) {
        $panel.updateProps({ buttonTextColor: value });
      },
    },

  ]);
}
