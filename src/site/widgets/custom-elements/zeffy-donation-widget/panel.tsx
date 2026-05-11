import React, { type FC, useState, useEffect } from 'react';
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
  displayMode:           'display-mode',
  formUrl:               'form-url',
  embedWidth:            'embed-width',
  embedWidthUnit:        'embed-width-unit',
  embedHeight:           'embed-height',
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
  buttonPaddingX:        'button-padding-x',
  buttonPaddingY:        'button-padding-y',
} as const;

const DEFAULTS = {
  displayMode:           'button',
  formUrl:               '',
  embedWidth:            '100',
  embedWidthUnit:        '%',
  embedHeight:           '700',
  buttonText:            'Donate Now',
  buttonBgColor:         '#219653',
  buttonTextColor:       '#ffffff',
  buttonTheme:           '',
  buttonBorderRadius:    '6',
  buttonShadow:          'none',
  buttonBorderWidth:     '0',
  buttonBorderColor:     '#2558D9',
  buttonGradientEnabled: 'false',
  buttonGradientColor2:  '#005BBB',
  buttonFontSize:        '16',
  buttonWidthPx:         '0',
  buttonPaddingX:        '32',
  buttonPaddingY:        '12',
};

const Panel: FC = () => {
  const [loaded,                setLoaded]                = useState(false);
  const [displayMode,           setDisplayMode]           = useState(DEFAULTS.displayMode);
  const [formUrl,               setFormUrl]               = useState(DEFAULTS.formUrl);
  const [embedWidth,            setEmbedWidth]            = useState(DEFAULTS.embedWidth);
  const [embedWidthUnit,        setEmbedWidthUnit]        = useState(DEFAULTS.embedWidthUnit);
  const [embedHeight,           setEmbedHeight]           = useState(DEFAULTS.embedHeight);
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
  const [buttonPaddingX,        setButtonPaddingX]        = useState(DEFAULTS.buttonPaddingX);
  const [buttonPaddingY,        setButtonPaddingY]        = useState(DEFAULTS.buttonPaddingY);

  useEffect(() => {
    Promise.all([
      widget.getProp(PROP_KEYS.displayMode),
      widget.getProp(PROP_KEYS.formUrl),
      widget.getProp(PROP_KEYS.embedWidth),
      widget.getProp(PROP_KEYS.embedWidthUnit),
      widget.getProp(PROP_KEYS.embedHeight),
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
      widget.getProp(PROP_KEYS.buttonPaddingX),
      widget.getProp(PROP_KEYS.buttonPaddingY),
    ]).then(([
      dm, url, w, wu, h, bt, bbg, btc,
      bth, br, bs, bbw, bbc, bge, bg2, bfs, bwpx, bpx, bpy,
    ]) => {
      if (dm)  setDisplayMode(dm);
      if (url !== undefined && url !== null) setFormUrl(url);
      if (w)   setEmbedWidth(w);
      if (wu)  setEmbedWidthUnit(wu);
      if (h)   setEmbedHeight(h);
      if (bt)  setButtonText(bt);
      if (bbg) setButtonBgColor(bbg);
      if (btc) setButtonTextColor(btc);
      if (bth !== undefined && bth !== null) setButtonTheme(bth);
      if (br)  setButtonBorderRadius(br);
      if (bs)  setButtonShadow(bs);
      if (bbw !== undefined && bbw !== null) setButtonBorderWidth(bbw);
      if (bbc) setButtonBorderColor(bbc);
      if (bge !== undefined && bge !== null) setButtonGradientEnabled(bge);
      if (bg2) setButtonGradientColor2(bg2);
      if (bfs) setButtonFontSize(bfs);
      if (bwpx !== undefined && bwpx !== null) setButtonWidthPx(bwpx);
      if (bpx) setButtonPaddingX(bpx);
      if (bpy) setButtonPaddingY(bpy);
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

  const isInline = displayMode === 'inline';
  const isButton = displayMode === 'button';
  const gradEnabled = buttonGradientEnabled === 'true';
  const hasBorder = parseInt(buttonBorderWidth, 10) > 0;

  const update = (key: string, value: string) => {
    void widget.setProp(key, value);
  };

  const applyTheme = async (theme: ButtonTheme) => {
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

    await widget.setProp(PROP_KEYS.buttonTheme,           theme.id);
    await widget.setProp(PROP_KEYS.buttonBgColor,         theme.bg);
    await widget.setProp(PROP_KEYS.buttonTextColor,       theme.text);
    await widget.setProp(PROP_KEYS.buttonBorderRadius,    radius);
    await widget.setProp(PROP_KEYS.buttonShadow,          theme.shadow);
    await widget.setProp(PROP_KEYS.buttonBorderWidth,     borderWidth);
    await widget.setProp(PROP_KEYS.buttonBorderColor,     theme.borderColor);
    await widget.setProp(PROP_KEYS.buttonGradientEnabled, gradStr);
    await widget.setProp(PROP_KEYS.buttonGradientColor2,  theme.gradient2);
  };

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>

      {/* ── Display mode ── */}
      <SidePanel.Field>
        <FormField label="Display mode">
          <Dropdown
            selectedId={displayMode}
            options={[
              { id: 'button', value: 'Button — open in a popup' },
              { id: 'inline', value: 'Inline — embed on the page' },
            ]}
            onSelect={(opt) => {
              if (!opt) return;
              const v = String(opt.id);
              setDisplayMode(v);
              update(PROP_KEYS.displayMode, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

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

      {/* ══════════════════════════════════════
          INLINE MODE CONTROLS
      ══════════════════════════════════════ */}
      {isInline && (
        <>
          <SidePanel.Field>
            <FormField label="Width">
              <NumberInput
                value={Number(embedWidth)}
                min={1}
                max={embedWidthUnit === '%' ? 100 : 9999}
                onChange={(value) => {
                  const raw = value === null || value === undefined
                    ? Number(DEFAULTS.embedWidth) : Number(value);
                  const n = embedWidthUnit === '%' ? Math.min(raw, 100) : raw;
                  const v = String(n);
                  setEmbedWidth(v);
                  update(PROP_KEYS.embedWidth, v);
                }}
              />
            </FormField>
          </SidePanel.Field>

          <SidePanel.Field>
            <FormField label="Width unit">
              <Dropdown
                selectedId={embedWidthUnit}
                options={[
                  { id: '%',  value: '% (percentage of container)' },
                  { id: 'px', value: 'px (fixed pixels)' },
                ]}
                onSelect={(opt) => {
                  if (!opt) return;
                  const v = String(opt.id);
                  if (v === '%' && Number(embedWidth) > 100) {
                    setEmbedWidth('100');
                    update(PROP_KEYS.embedWidth, '100');
                  }
                  setEmbedWidthUnit(v);
                  update(PROP_KEYS.embedWidthUnit, v);
                }}
              />
            </FormField>
          </SidePanel.Field>

          <SidePanel.Field>
            <FormField label="Height (px)">
              <NumberInput
                value={Number(embedHeight)}
                min={200}
                max={5000}
                onChange={(value) => {
                  const n = value === null || value === undefined
                    ? Number(DEFAULTS.embedHeight) : Number(value);
                  const v = String(n);
                  setEmbedHeight(v);
                  update(PROP_KEYS.embedHeight, v);
                }}
              />
            </FormField>
          </SidePanel.Field>
        </>
      )}

      {/* ══════════════════════════════════════
          BUTTON MODE CONTROLS
      ══════════════════════════════════════ */}
      {isButton && (
        <>
          {/* Button label */}
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
                  const previewBg = theme.gradientEnabled
                    ? `linear-gradient(135deg, ${theme.bg}, ${theme.gradient2})`
                    : theme.bg;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => { void applyTheme(theme); }}
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

          {/* Background / gradient start color */}
          <SidePanel.Field>
            <FormField
              label={gradEnabled ? 'Gradient start color' : 'Background color'}
            >
              <ColorInput
                value={buttonBgColor}
                onChange={(value: string | object) => {
                  const v = String(value ?? DEFAULTS.buttonBgColor);
                  setButtonBgColor(v);
                  setButtonTheme('');
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
                  }}
                  onConfirm={(value: string | object) => {
                    const v = String(value ?? DEFAULTS.buttonGradientColor2);
                    setButtonGradientColor2(v);
                    update(PROP_KEYS.buttonGradientColor2, v);
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
                }}
                onConfirm={(value: string | object) => {
                  const v = String(value ?? DEFAULTS.buttonTextColor);
                  setButtonTextColor(v);
                  update(PROP_KEYS.buttonTextColor, v);
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
                  update(PROP_KEYS.buttonShadow, v);
                }}
              />
            </FormField>
          </SidePanel.Field>

          {/* Border width */}
          <SidePanel.Field>
            <FormField label="Border width (px)">
              <NumberInput
                value={Number(buttonBorderWidth)}
                min={0}
                max={8}
                onChange={(value) => {
                  const n = value === null || value === undefined ? 0 : Number(value);
                  const v = String(n);
                  setButtonBorderWidth(v);
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
                  }}
                  onConfirm={(value: string | object) => {
                    const v = String(value ?? DEFAULTS.buttonBorderColor);
                    setButtonBorderColor(v);
                    update(PROP_KEYS.buttonBorderColor, v);
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
              infoContent="Set to 0 for automatic width based on label length."
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
        </>
      )}

    </WixDesignSystemProvider>
  );
};

export default Panel;
