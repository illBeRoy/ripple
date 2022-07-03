import {
  DefaultButton,
  Icon,
  Separator,
  Stack,
  Text,
  TooltipHost,
} from '@fluentui/react';
import { useStudioStore } from '../stores/studioStore';
import { EffectsEditor } from './EffectsEditor';
import { SlicerEditor } from './SlicerEditor';

export const SidePanel = () => {
  const { slices, exportSlicesToZip } = useStudioStore();
  const canExportSprites = slices.length > 0;

  return (
    <Stack tokens={{ padding: '.5em', childrenGap: '1em' }}>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: '1em' }}>
        <Text variant="xLarge">Slicing Strategy</Text>
        <TooltipHost content="The slicing strategy defines how sprites are going to be identified and sliced out of the given spritesheet">
          <Icon iconName="Info" style={{ cursor: 'pointer' }} />
        </TooltipHost>
      </Stack>
      <SlicerEditor />
      <Separator />
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: '1em' }}>
        <Text variant="xLarge">Post-process</Text>
        <TooltipHost content="Effects to apply to the generated frames">
          <Icon iconName="Info" style={{ cursor: 'pointer' }} />
        </TooltipHost>
      </Stack>
      <EffectsEditor />
      <DefaultButton disabled={!canExportSprites} onClick={exportSlicesToZip}>
        Export Sprites
      </DefaultButton>
    </Stack>
  );
};
