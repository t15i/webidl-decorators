export interface GetterAttributeDecoratorContext<T = unknown> {
  metadata: object;
  kind: "getter";
  name: string;
  static: boolean;
  private: false;
  access: {
    get(object: object): T;
  };
}

export type GetterAttributeDecoratorTarget<T = unknown> = () => T;
