import {
  Icon,
  IconButton,
  Label,
  Separator,
  Stack,
  SwatchColorPicker,
  Text,
  Toggle,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import { Fragment } from 'react';
import { PostProcessingEffect } from '../postProcess';
import { BlindColorEffect } from '../postProcessEffects/BlindColorEffect';
import { useStudioStore } from '../stores/studioStore';
import { ColorPickingSwatch } from './ColorPicker';

const SupportedEffects = {
  'Blind Colors': {
    description:
      'Ignore colors and turn them into transparent pixels. Useful for removing solid backgrounds',
    Effect: BlindColorEffect,
  },
};

type SupportedEffectTypes = keyof typeof SupportedEffects;

export const EffectsEditor = () => {
  const { effects, setEffect, removeEffect } = useStudioStore();

  const getEffectEditorComponent = (effectType: SupportedEffectTypes) => {
    switch (effectType) {
      case 'Blind Colors': {
        return BlindColorsEffectEditor;
      }

      default:
        return null;
    }
  };

  const renderEffectEditor = (effectType: SupportedEffectTypes) => {
    const descriptor = SupportedEffects[effectType];
    const existingEffect = effects[effectType];
    const EditorComponent = getEffectEditorComponent(effectType);

    if (!EditorComponent) {
      return;
    }

    const toggleEffect = () => {
      if (existingEffect) {
        removeEffect(effectType);
      } else {
        setEffect(effectType, new descriptor.Effect());
      }
    };
    return (
      <>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          style={{ width: '100%' }}
        >
          <Text variant="large">{effectType}</Text>
          <Toggle checked={!!existingEffect} onChange={toggleEffect} />
        </Stack>
        {existingEffect && (
          <EditorComponent
            currentSlicerProps={existingEffect.props}
            setProps={(props) =>
              setEffect(effectType, existingEffect.setProps(props))
            }
          />
        )}
        <Separator />
      </>
    );
  };

  return (
    <>
      {Object.keys(SupportedEffects).map((effect) => (
        <Fragment key={effect}>
          {renderEffectEditor(effect as SupportedEffectTypes)}
        </Fragment>
      ))}
    </>
  );
};

export interface EffectEditorProps<TEffect extends PostProcessingEffect<any>> {
  currentSlicerProps: TEffect['props'];
  setProps: (...params: Parameters<TEffect['setProps']>) => void;
}

export const BlindColorsEffectEditor = ({
  currentSlicerProps,
  setProps,
}: EffectEditorProps<BlindColorEffect>) => {
  const addColor = (color: string) => {
    setProps({
      blindColors: [...new Set(currentSlicerProps.blindColors).add(color)],
    });
  };

  const removeColor = (color: string) => {
    setProps({
      blindColors: currentSlicerProps.blindColors.filter((c) => c !== color),
    });
  };

  return (
    <Stack>
      <Label>
        Ignored Colors{' '}
        <TooltipHost content="The colors to ignore and turn into transparent pixels">
          <Icon iconName="Info" style={{ cursor: 'pointer' }} />
        </TooltipHost>
      </Label>
      <SwatchColorPicker
        columnCount={100}
        colorCells={currentSlicerProps.blindColors.map((color) => ({
          id: color,
          color,
        }))}
        onChange={(_, color) => color && removeColor(color)}
      />
      <ColorPickingSwatch onColorPicked={addColor}>
        <IconButton iconProps={{ iconName: 'Add' }} />
      </ColorPickingSwatch>
    </Stack>
  );
};
