import type Jimp from 'jimp';

export abstract class PostProcessingEffect<
  TProps extends Record<string, any> = any
> {
  public props: TProps = this.defaultProps();

  protected abstract defaultProps(): TProps;

  setProps(props: TProps) {
    this.props = props;
    return this;
  }

  abstract apply(jimp: Jimp): Jimp;
}
