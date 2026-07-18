export interface AccessorAttributeDecoratorContext<T = unknown> {
  metadata: object;
  kind: "accessor";
  name: string;
  static: boolean;
  private: false;
  access: {
    get(object: object): T;
    set(object: object, value: T): void;
  };
}

export type AccessorAttributeDecoratorTarget<T = unknown> = {
  get(): T;
  set(value: T): void;
};
