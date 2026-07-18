export interface SetterAttributeDecoratorContext<T = unknown> {
  metadata: object;
  kind: "setter";
  name: string;
  static: boolean;
  private: false;
  access: {
    set(object: object, value: T): void;
  };
}

export type SetterAttributeDecoratorTarget<T = unknown> = (value: T) => void;
