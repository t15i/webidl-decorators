import type { ArgumentList, PlatformObject, Type } from "@t15i/webspecs/webidl";
import type { AnyFunction } from "./types";

export function getIdentifierByName(name: string | symbol): string | undefined {
  if (typeof name === "symbol") {
    return undefined;
  }

  if (name.startsWith("#")) {
    return undefined;
  }

  return name;
}

export function getAttributeGetter<T>(fn: () => T, T: Type<T>) {
  return function (this: PlatformObject): T {
    return T(fn.call(this));
  };
}

export function getAttributeSetter<T>(fn: (value: T) => void, T: Type<T>) {
  return function (this: PlatformObject, value: T): void {
    fn.call(this, T(value));
  };
}

export function getMethodSteps<Fn extends AnyFunction>(
  fn: Fn,
  op: {
    arguments: ArgumentList<Parameters<Fn>>;
    returnType: Type<ReturnType<Fn>>;
  },
): Fn {
  return function (
    this: ThisParameterType<Fn>,
    ...args: Parameters<Fn>
  ): ReturnType<Fn> {
    return op.returnType(
      fn.apply(
        this,
        op.arguments.map((arg, i) => arg.type(args[i])),
      ),
    );
  } as Fn;
}
