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

const PROP_KEYS = {
  formUrl:               'form-url',
  buttonText:            'button-text',
  buttonBgColor:         'button-bg-color',
  buttonTextColor:       'button-text-color',
  buttonAction:          'button-action',
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
  buttonAction:          'modal',
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
  const [buttonAction,          setButtonAction]          = useState(DEFAULTS.buttonAction);
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

  useEffect(() => {
    Promise.all([
      widget.getProp(PROP_KEYS.formUrl),
      widget.getProp(PROP_KEYS.buttonText),
      widget.getProp(PROP_KEYS.buttonBgColor),
      widget.getProp(PROP_KEYS.buttonTextColor),
      widget.getProp(PROP_KEYS.buttonAction),
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
      url, bt, bbg, btc, ba, br, bs, bbw, bbc, bge, bg2, bfs, bwpx, bhpx, bpx, bpy,
    ]) => {
      if (url !== undefined && url !== null)   setFormUrl(url);
      if (bt)                                  setButtonText(bt);
      if (bbg)                                 setButtonBgColor(bbg);
      if (btc)                                 setButtonTextColor(btc);
      if (ba === 'modal' || ba === 'new-tab')  setButtonAction(ba);
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

      {/* ── On click action ── */}
      <SidePanel.Field>
        <FormField
          label="On click"
          infoContent="Choose whether clicking the button opens the donation form in a popup or in a new browser tab."
        >
          <Dropdown
            selectedId={buttonAction}
            options={[
              { id: 'modal',   value: 'Open in a popup' },
              { id: 'new-tab', value: 'Open in a new tab' },
            ]}
            onSelect={(opt) => {
              if (!opt) return;
              const v = String(opt.id);
              setButtonAction(v);
              update(PROP_KEYS.buttonAction, v);
            }}
          />
        </FormField>
      </SidePanel.Field>

      {/* ── Style section ── */}
      <SidePanel.Field>
        <Text size="small" secondary>Style</Text>
      </SidePanel.Field>

      {/* Background color */}
      <SidePanel.Field>
        <FormField label={gradEnabled ? 'Gradient start color' : 'Background color'}>
          <ColorInput
            value={buttonBgColor}
            onChange={(value: string | object) => {
              const v = String(value ?? DEFAULTS.buttonBgColor);
              setButtonBgColor(v);
              update(PROP_KEYS.buttonBgColor, v);
            }}
            onConfirm={(value: string | object) => {
              const v = String(value ?? DEFAULTS.buttonBgColor);
              setButtonBgColor(v);
              update(PROP_KEYS.buttonBgColor, v);
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
