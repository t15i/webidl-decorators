// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyConstructor = new (...args: any[]) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

/**
 * The minimal decorator context shape shared by class and member decorators:
 * the decoration `metadata` object the shared draft registries key off.
 */
export interface DecoratorContext {
  metadata: object;
}

export type ReturnTypes<Ts extends AnyFunction[]> = {
  [K in keyof Ts]: ReturnType<Ts[K]>;
};
