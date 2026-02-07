import { ObjectId } from "mongodb";

export abstract class Entity<Props = any> {
  private readonly _id: string;
  public readonly props: Props;

  constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id || new ObjectId().toString();
  }

  get id() {
    return this._id;
  }

  toJSON(): Required<Props & { id: string }> {
    return {
      id: this._id,
      ...this.props,
    } as Required<Props & { id: string }>;
  }
}
