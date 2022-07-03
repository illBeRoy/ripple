import type Jimp from 'jimp';

export abstract class Slicer<TProps = any> {
  public props: TProps = this.defaultProps();

  protected abstract defaultProps(): TProps;

  setProps(props: TProps) {
    this.props = props;
    return this;
  }

  abstract isTopLeftOfSprite(
    x: number,
    y: number,
    jimp: Jimp
  ): Promise<boolean>;

  abstract isRightEdgeOfSprite(
    x: number,
    y: number,
    jimp: Jimp
  ): Promise<boolean>;

  abstract isBottomEdgeOfSprite(
    x: number,
    y: number,
    jimp: Jimp
  ): Promise<boolean>;
}
