import { IconButton, Stack, Text, useTheme } from '@fluentui/react';
import { useState } from 'react';
import { useStudioStore } from '../stores/studioStore';
import { ColorPickableImage, useColorPicker } from './ColorPicker';

export const SpritesheetViewer = () => {
  const { spritesheet, slices } = useStudioStore();
  const { isColorPicking } = useColorPicker();
  const [zoom, setZoom] = useState(1);
  const theme = useTheme();

  const zoomIn = () => setZoom(Math.min(zoom + 0.5, 10));

  const zoomOut = () => setZoom(Math.max(zoom - 0.5, 1));

  const renderEmptyState = () => (
    <Text style={{ margin: 'auto' }}>No Spritesheet Selected</Text>
  );

  const renderSpritesheet = () => (
    <Stack
      verticalFill
      horizontalAlign="center"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'scroll',
        scrollBehavior: 'smooth',
        transition: 'background-color .4s ease',
        backgroundColor: isColorPicking ? 'rgb(20, 20, 20)' : 'white',
      }}
    >
      <Stack
        style={{
          margin: 'auto',
          position: 'relative',
          transform: `scale(${zoom})`,
        }}
      >
        <ColorPickableImage
          src={spritesheet!}
          style={{ imageRendering: 'pixelated' }}
        />
        {slices.map((slice, i) => (
          <div
            key={i}
            style={{
              border: 'solid red 1px',
              position: 'absolute',
              left: slice.x1,
              top: slice.y1,
              width: slice.x2 - slice.x1 + 1,
              height: slice.y2 - slice.y1 + 1,
              boxSizing: 'border-box',
              pointerEvents: 'none',
            }}
          />
        ))}
      </Stack>
    </Stack>
  );

  return (
    <Stack
      verticalFill
      horizontalAlign="center"
      grow={1}
      style={{
        position: 'relative',
      }}
    >
      {!spritesheet && renderEmptyState()}
      {spritesheet && renderSpritesheet()}
      <Stack
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          background: theme.semanticColors.menuBackground,
        }}
        horizontal
        horizontalAlign="end"
      >
        <IconButton
          iconProps={{ iconName: 'CalculatorSubtract' }}
          disabled={!spritesheet}
          onClick={zoomOut}
        />
        <IconButton
          iconProps={{ iconName: 'CalculatorAddition' }}
          disabled={!spritesheet}
          onClick={zoomIn}
        />
      </Stack>
    </Stack>
  );
};
