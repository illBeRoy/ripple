import Jimp from 'jimp';
import JSZip from 'jszip';
import { useState } from 'react';
import { createHOH } from 'higher-order-hooks';
import { saveAs } from 'file-saver';
import { Slicer } from '../slicer';
import { PostProcessingEffect } from '../postProcess';

export interface Slice {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export const [useStudioStore, StudioStoreProvider] = createHOH(() => {
  const [spritesheet, setSpritesheet] = useState<string | null>();
  const [slicer, setSlicer] = useState<Slicer | null>();
  const [slices, setSlices] = useState<Slice[]>([]);
  const [effects, setEffects] = useState<Record<string, PostProcessingEffect>>(
    {}
  );

  function startEditingNewSpritesheet(spritesheetData: string) {
    setSpritesheet(spritesheetData);
    setSlicer(null);
    setSlices([]);
    setEffects({});
  }

  async function slice() {
    if (!spritesheet || !slicer) {
      return;
    }

    const jimp = await Jimp.read(spritesheet);
    const slices: Slice[] = [];

    function isPointInExistingSlice(x: number, y: number) {
      return slices.some(
        (slice) =>
          slice.x1 <= x && x <= slice.x2 && slice.y1 <= y && y <= slice.y2
      );
    }

    for (let y = 0; y < jimp.getHeight(); y += 1) {
      for (let x = 0; x < jimp.getWidth(); x += 1) {
        if (isPointInExistingSlice(x, y)) {
          continue;
        }

        if (await slicer.isTopLeftOfSprite(x, y, jimp)) {
          const [x1, y1] = [x, y];
          let [x2, y2] = [x1, y1];

          while (
            !(await slicer.isRightEdgeOfSprite(x2, y1, jimp)) &&
            x2 < jimp.getWidth() - 1
          ) {
            x2 += 1;
          }

          while (
            !(await slicer.isBottomEdgeOfSprite(x1, y2, jimp)) &&
            y2 < jimp.getHeight() - 1
          ) {
            y2 += 1;
          }

          slices.push({ x1, x2, y1, y2 });
        }
      }
    }

    setSlices(slices);
  }

  function setEffect(effectName: string, effect: PostProcessingEffect) {
    setEffects({ ...effects, [effectName]: effect });
  }

  function removeEffect(effectName: string) {
    setEffects(
      Object.fromEntries(
        Object.entries(effects).filter((p) => p[0] !== effectName)
      )
    );
  }

  async function exportSlicesToZip() {
    if (!spritesheet) {
      throw new Error('No spritesheet was set!');
    }

    if (!slices) {
      throw new Error('No Slices were cut!');
    }

    const jimp = await Jimp.read(spritesheet);
    const postProcessors = Object.values(effects);

    const outputImages = await Promise.all(
      slices.map((slice) =>
        postProcessors
          .reduce(
            (img, effect) => effect.apply(img),
            jimp
              .clone()
              .crop(
                slice.x1,
                slice.y1,
                slice.x2 - slice.x1 + 1,
                slice.y2 - slice.y1 + 1
              )
          )
          .getBufferAsync(Jimp.MIME_PNG)
      )
    );

    const zip = new JSZip();
    outputImages.forEach((image, frameIndex) => {
      zip.file(`frame_${frameIndex}.png`, image, {
        binary: true,
      });
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'spritesheet.zip');
  }

  return {
    spritesheet,
    slices,
    slicer,
    effects,
    startEditingNewSpritesheet,
    setSlicer,
    slice,
    setEffect,
    removeEffect,
    exportSlicesToZip,
  };
});
