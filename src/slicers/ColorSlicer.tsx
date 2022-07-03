import Jimp from 'jimp';
import Color from 'color';
import { Slicer } from '../slicer';

export interface ColorSlicerProps {
  backgroundColors: string[];
}

export class ColorSlicer extends Slicer<ColorSlicerProps> {
  protected defaultProps(): ColorSlicerProps {
    return {
      backgroundColors: [],
    };
  }

  setProps(props: ColorSlicerProps) {
    return super.setProps({
      backgroundColors: props.backgroundColors.map((bgColor) =>
        Color(bgColor).hexa()
      ),
    });
  }

  async isTopLeftOfSprite(x: number, y: number, jimp: Jimp) {
    const pixelColor = await jimp.getPixelColor(x, y);
    return !this.isBackgroundColor(pixelColor);
  }

  async isRightEdgeOfSprite(x: number, y: number, jimp: Jimp) {
    const colorOnePixelRight = await jimp.getPixelColor(x + 1, y);
    return this.isBackgroundColor(colorOnePixelRight);
  }

  async isBottomEdgeOfSprite(x: number, y: number, jimp: Jimp) {
    const colorOnePixelDown = await jimp.getPixelColor(x, y + 1);
    return this.isBackgroundColor(colorOnePixelDown);
  }

  private isBackgroundColor(color: number) {
    const { r, g, b } = Jimp.intToRGBA(color);
    return this.props.backgroundColors.some(
      (c) => c === Color([r, g, b]).hexa()
    );
  }
}
