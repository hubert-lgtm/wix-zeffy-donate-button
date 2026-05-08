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

/**
 * Zeffy Donation Widget — Settings Panel
 *
 * Wix CLI panel using the @wix/editor `widget` API. All props are stored as strings
 * (widget.setProp signature requires string values) and bound to kebab-case
 * attributes on the <zeffy-donation-widget> custom element.
 */

const PROP_KEYS = {
  displayMode: 'display-mode',
  formUrl: 'form-url',
  embedWidth: 'embed-width',
  embedWidthUnit: 'embed-width-unit',
  embedHeight: 'embed-height',
  buttonText: 'button-text',
  buttonBgColor: 'button-bg-color',
  buttonTextColor: 'button-text-color',
} as const;

const DEFAULTS = {
  displayMode: 'inline',
  formUrl: '',
  embedWidth: '100',
  embedWidthUnit: '%',
  embedHeight: '700',
  buttonText: 'Donate Now',
  buttonBgColor: '#007bff',
  buttonTextColor: '#ffffff',
};

const Panel: FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [displayMode, setDisplayMode] = useState(DEFAULTS.displayMode);
  const [formUrl, setFormUrl] = useState(DEFAULTS.formUrl);
  const [embedWidth, setEmbedWidth] = useState(DEFAULTS.embedWidth);
  const [embedWidthUnit, setEmbedWidthUnit] = useState(DEFAULTS.embedWidthUnit);
  const [embedHeight, setEmbedHeight] = useState(DEFAULTS.embedHeight);
  const [buttonText, setButtonText] = useState(DEFAULTS.buttonText);
  const [buttonBgColor, setButtonBgColor] = useState(DEFAULTS.buttonBgColor);
  const [buttonTextColor, setButtonTextColor] = useState(DEFAULTS.buttonTextColor);

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
    ]).then(([dm, url, w, wu, h, bt, bbg, btc]) => {
      if (dm) setDisplayMode(dm);
      if (url !== undefined && url !== null) setFormUrl(url);
      if (w) setEmbedWidth(w);
      if (wu) setEmbedWidthUnit(wu);
      if (h) setEmbedHeight(h);
      if (bt) setButtonText(bt);
      if (bbg) setButtonBgColor(bbg);
      if (btc) setButtonTextColor(btc);
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

  const update = (key: string, value: string) => {
    void widget.setProp(key, value);
  };

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <SidePanel.Field>
        <FormField label="Display mode">
          <Dropdown
            selectedId={displayMode}
            options={[
              { id: 'inline', value: 'Inline — embed on the page' },
              { id: 'button', value: 'Button — open in a popup' },
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

      <SidePanel.Field>
        <FormField
          label="Zeffy form URL"
          infoContent="Paste the full Zeffy donation form URL. The widget converts it to the embed format automatically."
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

      {isInline && (
        <>
          <SidePanel.Field>
            <FormField label="Width">
              <NumberInput
                value={Number(embedWidth)}
                min={1}
                max={5000}
                onChange={(value) => {
                  const n = value === null || value === undefined ? Number(DEFAULTS.embedWidth) : Number(value);
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
                  { id: '%', value: '% (percentage of container)' },
                  { id: 'px', value: 'px (fixed pixels)' },
                ]}
                onSelect={(opt) => {
                  if (!opt) return;
                  const v = String(opt.id);
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
                  const n = value === null || value === undefined ? Number(DEFAULTS.embedHeight) : Number(value);
                  const v = String(n);
                  setEmbedHeight(v);
                  update(PROP_KEYS.embedHeight, v);
                }}
              />
            </FormField>
          </SidePanel.Field>
        </>
      )}

      {isButton && (
        <>
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
          <SidePanel.Field>
            <FormField label="Button background color">
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
          <SidePanel.Field>
            <FormField label="Button text color">
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
        </>
      )}
    </WixDesignSystemProvider>
  );
};

export default Panel;
