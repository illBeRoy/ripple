import { useMemo } from 'react';
import {
  DefaultButton,
  Dropdown,
  Icon,
  IconButton,
  IDropdownOption,
  Label,
  Stack,
  SwatchColorPicker,
  Text,
  TextField,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import { ColorSlicer } from '../slicers/ColorSlicer';
import { GridSlicer } from '../slicers/GridSlicer';
import { useStudioStore } from '../stores/studioStore';
import gridSlicerPreview from '../assets/gridSlicerPreview.png';
import colorSlicerPreview from '../assets/colorSlicerPreview.png';
import { Slicer } from '../slicer';
import { ColorPickingSwatch } from './ColorPicker';

const SupportedSlicers = {
  'Slice by Grid': {
    description:
      'Slice spritesheet into evenly sized frames. This is a classic grid slicing',
    preview: gridSlicerPreview,
    Slicer: GridSlicer,
  },
  'Lookup by Color': {
    description:
      'In case your frames are scattered inside your spreadsheet, you can identify them by color',
    preview: colorSlicerPreview,
    Slicer: ColorSlicer,
  },
};

type SupportedSlicerDescriptors =
  typeof SupportedSlicers[keyof typeof SupportedSlicers];

export const SlicerEditor = () => {
  const { slicer, setSlicer, slice } = useStudioStore();
  const theme = useTheme();

  const selectedKey = useMemo(() => {
    if (slicer) {
      return Object.keys(SupportedSlicers).find(
        (key) =>
          //@ts-expect-error it's string but actually keyof SupportedSlicers
          slicer instanceof SupportedSlicers[key].Slicer
      );
    } else {
      return null;
    }
  }, [slicer]);

  const CurrentSlicerEditor = useMemo(() => {
    if (slicer instanceof GridSlicer) {
      return GridSlicerEditor;
    }

    if (slicer instanceof ColorSlicer) {
      return ColorSlicerEditor;
    }

    return null;
  }, [slicer]);

  const onSlicerSelected = (
    e: unknown,
    opt: IDropdownOption<SupportedSlicerDescriptors>
  ) => {
    const SlicerClass = opt.data?.Slicer;
    if (SlicerClass) {
      setSlicer(new SlicerClass());
    }
  };

  const updateSlicerProps = (newProps: unknown) => {
    if (slicer) {
      const SlicerClass = slicer.constructor;
      //@ts-expect-error for some reason ts does not infer Slicer.constructor as Slicer
      const newSlicer = new SlicerClass().setProps(newProps);
      setSlicer(newSlicer);
    }
  };

  return (
    <>
      <Dropdown
        selectedKey={selectedKey}
        options={Object.entries(SupportedSlicers).map(([key, data]) => ({
          key,
          text: key,
          data,
        }))}
        placeholder="Select Strategy..."
        styles={{
          dropdownOptionText: { overflow: 'visible', whiteSpace: 'normal' },
          dropdownItem: { height: 'auto' },
        }}
        //@ts-expect-error - supplying the specific type for the "opt" param in onSlicerSelected breaks the prop typing
        onChange={onSlicerSelected}
        //@ts-expect-error - supplying the specific type for the "opt" param breaks the prop typing
        onRenderOption={(opt: IDropdownOption<SupportedSlicerDescriptors>) => (
          <Stack style={{ paddingTop: '.5em', paddingBottom: '.5em' }}>
            <Text variant="large">{opt?.text}</Text>
            <Text variant="small" color={theme.semanticColors.bodySubtext}>
              {opt?.data?.description}
            </Text>
          </Stack>
        )}
      />
      {slicer && CurrentSlicerEditor && (
        <CurrentSlicerEditor
          currentSlicerProps={slicer.props}
          setProps={updateSlicerProps}
        />
      )}
      {slicer && <DefaultButton onClick={slice}>Apply</DefaultButton>}
    </>
  );
};

export interface SlicerEditorProps<TSlicer extends Slicer<any>> {
  currentSlicerProps: TSlicer['props'];
  setProps: (...params: Parameters<TSlicer['setProps']>) => void;
}

export const GridSlicerEditor = ({
  currentSlicerProps,
  setProps,
}: SlicerEditorProps<GridSlicer>) => {
  const setDimensionProp = (
    propName: keyof typeof currentSlicerProps,
    value: string
  ) => {
    const valueAsInt = parseInt(value);
    if (0 < valueAsInt && valueAsInt <= Infinity) {
      console.log(valueAsInt);
      setProps({ ...currentSlicerProps, [propName]: valueAsInt });
    }
  };

  return (
    <Stack>
      <TextField
        inputMode="decimal"
        label="Frame Width"
        value={`${currentSlicerProps.width}`}
        onChange={(e) => setDimensionProp('width', e.currentTarget.value)}
      />
      <TextField
        inputMode="decimal"
        label="Frame Height"
        value={`${currentSlicerProps.height}`}
        onChange={(e) => setDimensionProp('height', e.currentTarget.value)}
      />
    </Stack>
  );
};

export const ColorSlicerEditor = ({
  currentSlicerProps,
  setProps,
}: SlicerEditorProps<ColorSlicer>) => {
  const addColor = (color: string) => {
    setProps({
      backgroundColors: [
        ...new Set(currentSlicerProps.backgroundColors).add(color),
      ],
    });
  };

  const removeColor = (color: string) => {
    setProps({
      backgroundColors: currentSlicerProps.backgroundColors.filter(
        (c) => c !== color
      ),
    });
  };

  return (
    <Stack>
      <Label>
        Ignored Colors{' '}
        <TooltipHost content="Ignored colors are considered background of the entire spritesheet, and are not identified as part of any frame">
          <Icon iconName="Info" style={{ cursor: 'pointer' }} />
        </TooltipHost>
      </Label>
      <SwatchColorPicker
        columnCount={100}
        colorCells={currentSlicerProps.backgroundColors.map((color) => ({
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
