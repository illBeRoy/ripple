import Color from 'color';
import Jimp from 'jimp';
import { PostProcessingEffect } from '../postProcess';

export interface BlindColorEffectProps {
  blindColors: string[];
}

export class BlindColorEffect extends PostProcessingEffect<BlindColorEffectProps> {
  protected defaultProps(): BlindColorEffectProps {
    return { blindColors: [] };
  }

  setProps(props: BlindColorEffectProps) {
    return super.setProps({
      blindColors: props.blindColors.map((blindColor) =>
        Color(blindColor).hexa()
      ),
    });
  }

  apply(jimp: Jimp): Jimp {
    return jimp.scan(0, 0, jimp.getWidth(), jimp.getHeight(), (x, y) => {
      const { r, g, b } = Jimp.intToRGBA(jimp.getPixelColor(x, y));
      const color = Color([r, g, b]).hexa();

      if (this.props.blindColors.includes(color)) {
        jimp.setPixelColor(0x00000000, x, y);
      }
    });
  }
}
