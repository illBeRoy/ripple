import Jimp from 'jimp';
import { useEffect, useRef } from 'react';

export interface UsePasteOpts {
  onImagePaste(imageDataUri: string): void;
}

export const usePaste = ({ onImagePaste }: UsePasteOpts) => {
  const imagePasteHandler = useRef(onImagePaste);

  useEffect(() => {
    imagePasteHandler.current = onImagePaste;
  }, [onImagePaste]);

  useEffect(() => {
    function handleImagePaste(e: ClipboardEvent) {
      const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const imageFile = [...(e.clipboardData?.files ?? [])].find((f) =>
        supportedImageTypes.includes(f.type)
      );

      if (imageFile) {
        const fileReader = new FileReader();
        fileReader.addEventListener(
          'load',
          () =>
            typeof fileReader.result === 'string' &&
            Jimp.read(fileReader.result).then((j) =>
              j.getBase64(imageFile.type as any, (err, v) =>
                imagePasteHandler.current(v)
              )
            )
        );
        fileReader.readAsDataURL(imageFile);
      }
    }

    document.addEventListener('paste', handleImagePaste);
    return function removePasteHandlerOnUnmount() {
      document.removeEventListener('paste', handleImagePaste);
    };
  }, []);
};
