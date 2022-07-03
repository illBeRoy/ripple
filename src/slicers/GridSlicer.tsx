import { Slicer } from '../slicer';

export interface GridSlicerProps {
  width: number;
  height: number;
}

export class GridSlicer extends Slicer<GridSlicerProps> {
  protected defaultProps(): GridSlicerProps {
    return {
      width: 16,
      height: 16,
    };
  }

  async isTopLeftOfSprite(x: number, y: number) {
    return x % this.props.width === 0 && y % this.props.height === 0;
  }

  async isRightEdgeOfSprite(x: number) {
    return (x + 1) % this.props.width === 0;
  }

  async isBottomEdgeOfSprite(_x: number, y: number) {
    return (y + 1) % this.props.height === 0;
  }
}
