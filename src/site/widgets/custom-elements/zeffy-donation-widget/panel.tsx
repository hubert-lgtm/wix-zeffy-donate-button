import React, { type FC, useState, useEffect, useRef } from 'react';
import { widget } from '@wix/editor';
import {
  SidePanel,
  WixDesignSystemProvider,
  Input,
  NumberInput,
  Dropdown,
  ColorInput,
  FormField,
  Text,
  TextButton,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';

interface ButtonTheme {
  id: string;
  name: string;
  bg: string;
  text: string;
  radius: number;
  shadow: string;
  borderWidth: number;
  borderColor: string;
  gradientEnabled: boolean;
  gradient2: string;
}

const THEMES: ButtonTheme[] = [
  {
    id: 'zeffy-green', name: 'Zeffy Green',
    bg: '#219653', text: '#ffffff', radius: 6, shadow: 'none',
    borderWidth: 0, borderColor: '#219653', gradientEnabled: false, gradient2: '#005BBB',
  },
  {
    id: 'royal-blue', name: 'Royal Blue',
    bg: '#2558D9', text: '#ffffff', radius: 6, shadow: 'sm',
    borderWidth: 0, borderColor: '#2558D9', gradientEnabled: false, gradient2: '#005BBB',
  },
  {
    id: 'coral', name: 'Coral',
    bg: '#E85D4A', text: '#ffffff', radius: 8, shadow: 'none',
    borderWidth: 0, borderColor: '#E85D4A', gradientEnabled: false, gradient2: '#005BBB',
  },
  {
    id: 'dark', name: 'Dark',
    bg: '#1A1A2E', text: '#ffffff', radius: 4, shadow: 'md',
    borderWidth: 0, borderColor: '#1A1A2E', gradientEnabled: false, gradient2: '#005BBB',
  },
  {
    id: 'outline', name: 'Outline',
    bg: 'transparent', text: '#2558D9', radius: 6, shadow: 'none',
    borderWidth: 2, borderColor: '#2558D9', gradientEnabled: false, gradient2: '#005BBB',
  },
  {
    id: 'pill', name: 'Pill',
    bg: '#219653', text: '#ffffff', radius: 50, shadow: 'none',
    borderWidth: 0, borderColor: '#219653', gradientEnabled: false, gradient2: '#005BBB',
  },
  {
    id: 'vibrant', name: 'Vibrant',
    bg: '#F97316', text: '#ffffff', radius: 6, shadow: 'sm',
    borderWidth: 0, borderColor: '#F97316', gradientEnabled: true, gradient2: '#EC4899',
  },
  {
    id: 'elegant', name: 'Elegant',
    bg: '#6B7280', text: '#ffffff', radius: 2, shadow: 'none',
    borderWidth: 0, borderColor: '#6B7280', gradientEnabled: false, gradient2: '#005BBB',
  },
];

const PROP_KEYS = {
  formUrl:               'form-url',
  buttonText:            'button-text',
  buttonBgColor:         'button-bg-color',
  buttonTextColor:       'button-text-color',
  buttonTheme:           'button-theme',
  buttonBorderRadius:    'button-border-radius',
  buttonShadow:          'button-shadow',
  buttonBorderWidth:     'button-border-width',
  buttonBorderColor:     'button-border-color',
  buttonGradientEnabled: 'button-gradient-enabled',
  buttonGradientColor2:  'button-gradient-color2',
  buttonFontSize:        'button-font-size',
  buttonWidthPx:         'button-width-px',
  buttonHeightPx:        'button-height-px',
  buttonPaddingX:        'button-padding-x',
  buttonPaddingY:        'button-padding-y',
} as const;

const DEFAULTS = {
  formUrl:               '',
  buttonText:            'Donate Now',
  buttonBgColor:         '#219653',
  buttonTextColor:       '#ffffff',
  buttonTheme:           '',
  buttonBorderRadius:    '6',
  buttonShadow:          'none',
  buttonBorderWidth:     '0',
  buttonBorderColor:     '#219653',
  buttonGradientEnabled: 'false',
  buttonGradientColor2:  '#005BBB',
  buttonFontSize:        '16',
  buttonWidthPx:         '0',
  buttonHeightPx:        '0',
  buttonPaddingX:        '32',
  buttonPaddingY:        '12',
};

const Panel: FC = () => {
  const [loaded,                setLoaded]                = useState(false);
  const [formUrl,               setFormUrl]               = useState(DEFAULTS.formUrl);
  const [buttonText,            setButtonText]            = useState(DEFAULTS.buttonText);
  const [buttonBgColor,         setButtonBgColor]         = useState(DEFAULTS.buttonBgColor);
  const [buttonTextColor,       setButtonTextColor]       = useState(DEFAULTS.buttonTextColor);
  const [buttonTheme,           setButtonTheme]           = useState(DEFAULTS.buttonTheme);
  const [buttonBorderRadius,    setButtonBorderRadius]    = useState(DEFAULTS.buttonBorderRadius);
  const [buttonShadow,          setButtonShadow]          = useState(DEFAULTS.buttonShadow);
  const [buttonBorderWidth,     setButtonBorderWidth]     = useState(DEFAULTS.buttonBorderWidth);
  const [buttonBorderColor,     setButtonBorderColor]     = useState(DEFAULTS.buttonBorderColor);
  const [buttonGradientEnabled, setButtonGradientEnabled] = useState(DEFAULTS.buttonGradientEnabled);
  const [buttonGradientColor2,  setButtonGradientColor2]  = useState(DEFAULTS.buttonGradientColor2);
  const [buttonFontSize,        setButtonFontSize]        = useState(DEFAULTS.buttonFontSize);
  const [buttonWidthPx,         setButtonWidthPx]         = useState(DEFAULTS.buttonWidthPx);
  const [buttonHeightPx,        setButtonHeightPx]        = useState(DEFAULTS.buttonHeightPx);
  const [buttonPaddingX,        setButtonPaddingX]        = useState(DEFAULTS.buttonPaddingX);
  const [buttonPaddingY,        setButtonPaddingY]        = useState(DEFAULTS.buttonPaddingY);

  // Debounce timer for applyTheme — rapid clicks cancel previous pending setProp bursts.
  const applyThemeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    Promise.all([
      widget.getProp(PROP_KEYS.formUrl),
      widget.getProp(PROP_KEYS.buttonText),
      widget.getProp(PROP_KEYS.buttonBgColor),
      widget.getProp(PROP_KEYS.buttonTextColor),
      widget.getProp(PROP_KEYS.buttonTheme),
      widget.getProp(PROP_KEYS.buttonBorderRadius),
      widget.getProp(PROP_KEYS.buttonShadow),
      widget.getProp(PROP_KEYS.buttonBorderWidth),
      widget.getProp(PROP_KEYS.buttonBorderColor),
      widget.getProp(PROP_KEYS.buttonGradientEnabled),
      widget.getProp(PROP_KEYS.buttonGradientColor2),
      widget.getProp(PROP_KEYS.buttonFontSize),
      widget.getProp(PROP_KEYS.buttonWidthPx),
      widget.getProp(PROP_KEYS.buttonHeightPx),
      widget.getProp(PROP_KEYS.buttonPaddingX),
      widget.getProp(PROP_KEYS.buttonPaddingY),
    ]).then(([
      url, bt, bbg, btc, bth, br, bs, bbw, bbc, bge, bg2, bfs, bwpx, bhpx, bpx, bpy,
    ]) => {
      if (url !== undefined && url !== null)   setFormUrl(url);
      if (bt)                                  setButtonText(bt);
      if (bbg)                                 setButtonBgColor(bbg);
      if (btc)                                 setButtonTextColor(btc);
      if (bth !== undefined && bth !== null)   setButtonTheme(bth);
      if (br)                                  setButtonBorderRadius(br);
      if (bs)                                  setButtonShadow(bs);
      if (bbw !== undefined && bbw !== null)   setButtonBorderWidth(bbw);
      if (bbc)                                 setButtonBorderColor(bbc);
      if (bge !== undefined && bge !== null)   setButtonGradientEnabled(bge);
      if (bg2)                                 setButtonGradientColor2(bg2);
      if (bfs)                                 setButtonFontSize(bfs);
      if (bwpx !== undefined && bwpx !== null) setButtonWidthPx(bwpx);
      if (bhpx !== undefined && bhpx !== null) setButtonHeightPx(bhpx);
      if (bpx)                                 setButtonPaddingX(bpx);
      if (bpy)                                 setButtonPaddingY(bpy);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <SidePanel />
      </WixDesignSystemProvider>
    );
  }

  const gradEnabled = buttonGradientEnabled === 'true';
  const hasBorder   = parseInt(buttonBorderWidth, 10) > 0;

  const update = (key: string, value: string) => {
    void widget.setProp(key, value);
  };

  // Clears the active theme selection from both React state and the element.
  // Called when the user manually edits any theme-controlled prop.
  const clearTheme = () => {
    setButtonTheme('');
    update(PROP_KEYS.buttonTheme, '');
  };

  // Updates local state immediately for panel feedback, then debounces all 9
  // setProp calls by 50ms. Rapid clicks cancel prior pending bursts so only
  // the last clicked theme's props are actually written to the element.
  const applyTheme = (theme: ButtonTheme) => {
    const radius      = String(theme.radius);
    const borderWidth = String(theme.borderWidth);
    const gradStr     = String(theme.gradientEnabled);

    setButtonTheme(theme.id);
    setButtonBgColor(theme.bg);
    setButtonTextColor(theme.text);
    setButtonBorderRadius(radius);
    setButtonShadow(theme.shadow);
    setButtonBorderWidth(borderWidth);
    setButtonBorderColor(theme.borderColor);
    setButtonGradientEnabled(gradStr);
    setButtonGradientColor2(theme.gradient2);

    clearTimeout(applyThemeTimerRef.current);
    applyThemeTimerRef.current = setTimeout(() => {
      void Promise.all([
        widget.setProp(PROP_KEYS.buttonBgColor,         theme.bg),
        widget.setProp(PROP_KEYS.buttonTextColor,       theme.text),
        widget.setProp(PROP_KEYS.buttonBorderRadius,    radius),
        widget.setProp(PROP_KEYS.buttonShadow,          theme.shadow),
        widget.setProp(PROP_KEYS.buttonBorderWidth,     borderWidth),
        widget.setProp(PROP_KEYS.buttonBorderColor,     theme.borderColor),
        widget.setProp(PROP_KEYS.buttonGradientEnabled, gradStr),
        widget.setProp(PROP_KEYS.buttonGradientColor2,  theme.gradient2),
        widget.setProp(PROP_KEYS.buttonTheme,           theme.id),
      ]);
    }, 50);
  };

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>

      {/* ── Form URL ── */}
      <SidePanel.Field>
        <FormField
          label="Zeffy form URL"
          infoContent="Paste your Zeffy donation form URL. The widget converts it to the embed format automatically."
        >
          <Input
            value={formUrl}
            placeholder="https://www.zeffy.com/en-US/donation-form/your-form"
            onChange={(e) => {
              const v = e.target.value;
              setFormUrl(v);
              update(PROP_KEYS.formUrl, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      <SidePanel.Field>
        <Text size="small" secondary>
          Don't have a Zeffy account?{' '}
          <TextButton
            as="a"
            href="https://www.zeffy.com/register"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            Sign up for free
          </TextButton>
        </Text>
      </SidePanel.Field>

      {/* ── Button label ── */}
      <SidePanel.Field>
        <FormField label="Button label">
          <Input
            value={buttonText}
            placeholder="Donate Now"
            onChange={(e) => {
              const v = e.target.value;
              setButtonText(v);
              update(PROP_KEYS.buttonText, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* ── Theme picker ── */}
      <SidePanel.Field>
        <FormField label="Theme">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {THEMES.map((theme) => {
              const isSelected = buttonTheme === theme.id;
              const previewBg  = theme.gradientEnabled
                ? `linear-gradient(135deg, ${theme.bg}, ${theme.gradient2})`
                : theme.bg;
              return (
                <div
                  key={theme.id}
                  onClick={() => applyTheme(theme)}
                  style={{
                    border: `2px solid ${isSelected ? '#116DFF' : '#E0E0E0'}`,
                    borderRadius: '8px',
                    padding: '10px 6px',
                    cursor: 'pointer',
                    textAlign: 'center' as const,
                    background: isSelected ? '#F0F6FF' : '#fff',
                    userSelect: 'none' as const,
                  }}
                >
                  <div
                    style={{
                      display: 'block',
                      background: previewBg,
                      color: theme.text,
                      border: theme.borderWidth
                        ? `${theme.borderWidth}px solid ${theme.borderColor}`
                        : 'none',
                      borderRadius: `${theme.radius}px`,
                      padding: '5px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      pointerEvents: 'none' as const,
                      marginBottom: '5px',
                      whiteSpace: 'nowrap' as const,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: '1.4',
                    }}
                  >
                    Donate
                  </div>
                  <div style={{ fontSize: '10px', color: '#555', lineHeight: '1.2' }}>
                    {theme.name}
                  </div>
                </div>
              );
            })}
          </div>
        </FormField>
      </SidePanel.Field>

      {/* ── Style section ── */}
      <SidePanel.Field>
        <Text size="small" secondary>Style</Text>
      </SidePanel.Field>

      {/* Background color
          onChange: only fires setProp for bg-color + element theme attr — does NOT
          call setButtonTheme() to avoid triggering a re-render that resets the picker
          mid-drag (ColorInput picks up the new value prop and closes/resets).
          onConfirm: also clears the theme tile in React state. */}
      <SidePanel.Field>
        <FormField label={gradEnabled ? 'Gradient start color' : 'Background color'}>
          <ColorInput
            value={buttonBgColor}
            onChange={(value: string | object) => {
              const v = String(value ?? DEFAULTS.buttonBgColor);
              setButtonBgColor(v);
              update(PROP_KEYS.buttonBgColor, v);
              update(PROP_KEYS.buttonTheme, '');
            }}
            onConfirm={(value: string | object) => {
              const v = String(value ?? DEFAULTS.buttonBgColor);
              setButtonBgColor(v);
              setButtonTheme('');
              update(PROP_KEYS.buttonBgColor, v);
              update(PROP_KEYS.buttonTheme, '');
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Gradient toggle */}
      <SidePanel.Field>
        <FormField label="Gradient">
          <Dropdown
            selectedId={buttonGradientEnabled}
            options={[
              { id: 'false', value: 'Off — solid color' },
              { id: 'true',  value: 'On — two-color gradient' },
            ]}
            onSelect={(opt) => {
              if (!opt) return;
              const v = String(opt.id);
              setButtonGradientEnabled(v);
              clearTheme();
              update(PROP_KEYS.buttonGradientEnabled, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Gradient end color (conditional) */}
      {gradEnabled && (
        <SidePanel.Field>
          <FormField label="Gradient end color">
            <ColorInput
              value={buttonGradientColor2}
              onChange={(value: string | object) => {
                const v = String(value ?? DEFAULTS.buttonGradientColor2);
                setButtonGradientColor2(v);
                update(PROP_KEYS.buttonGradientColor2, v);
                update(PROP_KEYS.buttonTheme, '');
              }}
              onConfirm={(value: string | object) => {
                const v = String(value ?? DEFAULTS.buttonGradientColor2);
                setButtonGradientColor2(v);
                setButtonTheme('');
                update(PROP_KEYS.buttonGradientColor2, v);
                update(PROP_KEYS.buttonTheme, '');
              }}
            />
          </FormField>
        </SidePanel.Field>
      )}

      {/* Text color */}
      <SidePanel.Field>
        <FormField label="Text color">
          <ColorInput
            value={buttonTextColor}
            onChange={(value: string | object) => {
              const v = String(value ?? DEFAULTS.buttonTextColor);
              setButtonTextColor(v);
              update(PROP_KEYS.buttonTextColor, v);
              update(PROP_KEYS.buttonTheme, '');
            }}
            onConfirm={(value: string | object) => {
              const v = String(value ?? DEFAULTS.buttonTextColor);
              setButtonTextColor(v);
              setButtonTheme('');
              update(PROP_KEYS.buttonTextColor, v);
              update(PROP_KEYS.buttonTheme, '');
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Corner roundness */}
      <SidePanel.Field>
        <FormField label="Corner roundness (px)">
          <NumberInput
            value={Number(buttonBorderRadius)}
            min={0}
            max={50}
            onChange={(value) => {
              const n = value === null || value === undefined ? 0 : Number(value);
              const v = String(n);
              setButtonBorderRadius(v);
              clearTheme();
              update(PROP_KEYS.buttonBorderRadius, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Shadow */}
      <SidePanel.Field>
        <FormField label="Button shadow">
          <Dropdown
            selectedId={buttonShadow}
            options={[
              { id: 'none', value: 'None' },
              { id: 'sm',   value: 'Small' },
              { id: 'md',   value: 'Medium' },
              { id: 'lg',   value: 'Large' },
            ]}
            onSelect={(opt) => {
              if (!opt) return;
              const v = String(opt.id);
              setButtonShadow(v);
              clearTheme();
              update(PROP_KEYS.buttonShadow, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Border width */}
      <SidePanel.Field>
        <FormField
          label="Border width (px)"
          infoContent="0 = no border. Increase to add a visible border around the button."
        >
          <NumberInput
            value={Number(buttonBorderWidth)}
            min={0}
            max={8}
            onChange={(value) => {
              const n = value === null || value === undefined ? 0 : Number(value);
              const v = String(n);
              setButtonBorderWidth(v);
              clearTheme();
              update(PROP_KEYS.buttonBorderWidth, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Border color (only when border is enabled) */}
      {hasBorder && (
        <SidePanel.Field>
          <FormField label="Border color">
            <ColorInput
              value={buttonBorderColor}
              onChange={(value: string | object) => {
                const v = String(value ?? DEFAULTS.buttonBorderColor);
                setButtonBorderColor(v);
                update(PROP_KEYS.buttonBorderColor, v);
                update(PROP_KEYS.buttonTheme, '');
              }}
              onConfirm={(value: string | object) => {
                const v = String(value ?? DEFAULTS.buttonBorderColor);
                setButtonBorderColor(v);
                setButtonTheme('');
                update(PROP_KEYS.buttonBorderColor, v);
                update(PROP_KEYS.buttonTheme, '');
              }}
            />
          </FormField>
        </SidePanel.Field>
      )}

      {/* Font size */}
      <SidePanel.Field>
        <FormField label="Font size (px)">
          <NumberInput
            value={Number(buttonFontSize)}
            min={10}
            max={36}
            onChange={(value) => {
              const n = value === null || value === undefined ? 0 : Number(value);
              const v = String(n);
              setButtonFontSize(v);
              update(PROP_KEYS.buttonFontSize, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Button width */}
      <SidePanel.Field>
        <FormField
          label="Button width (px)"
          infoContent="0 = auto width (expands to fit the label)."
        >
          <NumberInput
            value={Number(buttonWidthPx)}
            min={0}
            max={800}
            onChange={(value) => {
              const n = value === null || value === undefined ? 0 : Number(value);
              const v = String(n);
              setButtonWidthPx(v);
              update(PROP_KEYS.buttonWidthPx, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Button height */}
      <SidePanel.Field>
        <FormField
          label="Button height (px)"
          infoContent="0 = auto height (controlled by padding). Uses min-height so padding still works."
        >
          <NumberInput
            value={Number(buttonHeightPx)}
            min={0}
            max={120}
            onChange={(value) => {
              const n = value === null || value === undefined ? 0 : Number(value);
              const v = String(n);
              setButtonHeightPx(v);
              update(PROP_KEYS.buttonHeightPx, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Horizontal padding */}
      <SidePanel.Field>
        <FormField label="Horizontal padding (px)">
          <NumberInput
            value={Number(buttonPaddingX)}
            min={0}
            max={80}
            onChange={(value) => {
              const n = value === null || value === undefined ? 0 : Number(value);
              const v = String(n);
              setButtonPaddingX(v);
              update(PROP_KEYS.buttonPaddingX, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* Vertical padding */}
      <SidePanel.Field>
        <FormField label="Vertical padding (px)">
          <NumberInput
            value={Number(buttonPaddingY)}
            min={0}
            max={40}
            onChange={(value) => {
              const n = value === null || value === undefined ? 0 : Number(value);
              const v = String(n);
              setButtonPaddingY(v);
              update(PROP_KEYS.buttonPaddingY, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

    </WixDesignSystemProvider>
  );
};

export default Panel;
