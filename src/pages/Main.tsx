import { Separator, Stack } from '@fluentui/react';
import { SidePanel } from '../components/SidePanel';
import { SpritesheetViewer } from '../components/SpritesheetViewer';
import { usePaste } from '../hooks/usePaste';
import { useStudioStore } from '../stores/studioStore';

export function Main() {
  const { spritesheet, startEditingNewSpritesheet } = useStudioStore();

  usePaste({ onImagePaste: (dataUri) => startEditingNewSpritesheet(dataUri) });

  return (
    <Stack
      style={{
        width: '100%',
        height: '100vh',
      }}
      horizontal
    >
      <SpritesheetViewer />
      <Separator vertical draggable />
      <Stack
        style={{
          width: '340px',
          overflowX: 'hidden',
          overflowY: 'scroll',
          scrollBehavior: 'smooth',
        }}
        grow={0}
      >
        {spritesheet && <SidePanel />}
      </Stack>
    </Stack>
  );
}
