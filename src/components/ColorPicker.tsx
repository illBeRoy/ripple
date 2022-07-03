import Jimp from 'jimp';
import {
  Callout,
  ColorPicker,
  DefaultButton,
  IconButton,
  IImageProps,
  Image,
  Stack,
} from '@fluentui/react';
import { createHOH } from 'higher-order-hooks';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import Color from 'color';
import { useId } from '../hooks/useId';

export type OnColorPicked = (color: string) => void;

export const [useColorPickerInternal, ColorPickerProvider] = createHOH(() => {
  const [isColorPicking, setIsColorPicking] = useState(false);
  const colorPickingHandlers = useRef<Set<OnColorPicked>>(new Set());

  const startColorPicking = () => setIsColorPicking(true);

  const stopColorPicking = () => setIsColorPicking(false);

  const addColorPickingHandler = (fn: OnColorPicked) => {
    colorPickingHandlers.current.add(fn);
  };

  const removeColorPickingHandler = (fn: OnColorPicked) => {
    colorPickingHandlers.current.delete(fn);
  };

  const emitColorPicked = (color: string) => {
    if (isColorPicking) {
      colorPickingHandlers.current.forEach((fn) => fn(color));
      stopColorPicking();
    }
  };

  return {
    addColorPickingHandler,
    removeColorPickingHandler,
    emitColorPicked,
    startColorPicking,
    stopColorPicking,
    isColorPicking,
  };
});

export const useColorPicker = (
  opts: {
    onColorPicked?(color: string): void;
  } = {}
) => {
  const prevFn = useRef(opts.onColorPicked);
  const {
    addColorPickingHandler,
    removeColorPickingHandler,
    startColorPicking,
    stopColorPicking,
    isColorPicking,
  } = useColorPickerInternal();

  useEffect(() => {
    prevFn.current && removeColorPickingHandler(prevFn.current);
    opts.onColorPicked && addColorPickingHandler(opts.onColorPicked);

    prevFn.current = opts.onColorPicked;
  }, [opts.onColorPicked]);

  return {
    isColorPicking,
    startColorPicking,
    stopColorPicking,
  };
};

export const ColorPickableImage = (props: IImageProps) => {
  const { emitColorPicked, isColorPicking } = useColorPickerInternal();
  const [srcImageJimp, setSrcImageJimp] = useState<Jimp | null>(null);

  useEffect(() => {
    if (props.src) {
      Jimp.read(props.src).then(setSrcImageJimp);
    }
  }, [props.src]);

  const onClick: MouseEventHandler<HTMLImageElement> = (e) => {
    if (srcImageJimp) {
      const pixelColor = srcImageJimp.getPixelColor(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
      const { r, g, b } = Jimp.intToRGBA(pixelColor);
      const color = Color([r, g, b]).hex();
      emitColorPicked(color);
      e.stopPropagation();
    }
  };

  return (
    <Image
      {...props}
      style={{
        ...props.style,
        cursor: isColorPicking ? 'crosshair' : 'auto',
      }}
      onClick={onClick}
    />
  );
};

export const ColorPickingSwatch = ({
  children,
  onColorPicked,
}: {
  children: React.ReactElement;
  onColorPicked: OnColorPicked;
}) => {
  const id = useId();
  const [pickedColor, setPickedColor] = useState('white');
  const [isOpen, setIsOpen] = useState(false);
  const [isLockedOpen, setLockedOpen] = useState(false);
  const { startColorPicking, stopColorPicking, isColorPicking } =
    useColorPicker({
      onColorPicked: (c) => setPickedColor(c),
    });

  useEffect(() => setLockedOpen(isColorPicking), [isColorPicking]);

  return (
    <>
      {React.cloneElement(children, { id, onClick: () => setIsOpen(true) })}
      {isOpen && (
        <Callout
          target={`#${id}`}
          isBeakVisible={false}
          onDismiss={() => !isLockedOpen && setIsOpen(false)}
        >
          <ColorPicker
            color={pickedColor}
            onChange={(_, color) => setPickedColor(`#${color.hex}`)}
          />
          <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="end"
            style={{ paddingRight: '16px', paddingBottom: '16px' }}
            tokens={{ childrenGap: '1em' }}
          >
            <IconButton
              iconProps={{ iconName: 'Eyedropper' }}
              onClick={startColorPicking}
            />
            <DefaultButton
              onClick={() => {
                onColorPicked(pickedColor);
                stopColorPicking();
                setIsOpen(false);
              }}
            >
              Add
            </DefaultButton>
          </Stack>
        </Callout>
      )}
    </>
  );
};
