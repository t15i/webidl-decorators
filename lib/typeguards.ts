import type {
  AnyFunction,
  AttributeDecoratorContext,
  AttributeDecoratorTarget,
  DecoratorContext,
  InterfaceDecoratorTarget,
  MemberDecoratorContext,
  OperationDecoratorContext,
  OperationDecoratorTarget,
  SpecialOperationDecoratorContext,
} from "./types";

export function toInterfaceDecoratorTarget<T extends InterfaceDecoratorTarget>(
  target: unknown,
) {
  if (typeof target !== "function") {
    throw TypeError(`Expected target to be 'function', got '${typeof target}'`);
  }

  return target as T;
}

export function toAttributeDecoratorTarget<T extends AttributeDecoratorTarget>(
  target: unknown,
) {
  if (
    typeof target !== "function" &&
    (typeof target !== "object" || target === null)
  ) {
    throw TypeError(
      `Expected target to be 'function' or non-null 'object', got '${target === null ? "null" : typeof target}'`,
    );
  }

  if (typeof target === "object" && target !== null) {
    if (!("get" in target)) {
      throw TypeError(`target.get is required, but does not exist`);
    }

    if (typeof target.get !== "function") {
      throw TypeError(
        `Expected target.get to be 'function', got '${typeof target.get}'`,
      );
    }

    if (!("set" in target)) {
      throw TypeError(`target.set is required, but does not exist`);
    }

    if (typeof target.set !== "function") {
      throw TypeError(
        `Expected target.set to be 'function', got '${typeof target.set}'`,
      );
    }
  }

  return target as T;
}

export function toOperationDecoratorTarget<T extends OperationDecoratorTarget>(
  target: unknown,
) {
  if (typeof target !== "function") {
    throw TypeError(`Expected target to be 'function', got '${typeof target}'`);
  }

  return target as T;
}

export function toBehaviorDecoratorTarget<T extends AnyFunction>(
  target: unknown,
) {
  if (typeof target !== "function") {
    throw TypeError(`Expected target to be 'function', got '${typeof target}'`);
  }

  return target as T;
}

export function toDecoratorContext(context: unknown) {
  if (typeof context !== "object" || context === null) {
    throw TypeError(
      `Expected context to be non-null 'object', got '${context === null ? "null" : typeof context}'`,
    );
  }

  if (!("metadata" in context)) {
    throw TypeError(`context.metadata is required, but does not exist`);
  }

  if (typeof context.metadata !== "object" || context.metadata === null) {
    throw TypeError(
      `Expected context.metadata to be non-null 'object', got '${context.metadata === null ? "null" : typeof context.metadata}'`,
    );
  }

  return context as DecoratorContext;
}

export function toMemberDecoratorContext(context: unknown) {
  const decoratorContext = toDecoratorContext(context);

  if (!("name" in decoratorContext)) {
    throw TypeError(`context.name is required, but does not exist`);
  }

  if (
    typeof decoratorContext.name !== "string" &&
    typeof decoratorContext.name !== "symbol"
  ) {
    throw TypeError(
      `Expected context.name to be 'string' or 'symbol', got '${typeof decoratorContext.name}'`,
    );
  }

  if (!("static" in decoratorContext)) {
    throw TypeError(`context.static is required, but does not exist`);
  }

  if (typeof decoratorContext.static !== "boolean") {
    throw TypeError(
      `Expected context.static to be 'boolean', got '${typeof decoratorContext.static}'`,
    );
  }

  if (!("kind" in decoratorContext)) {
    throw TypeError(`context.kind is required, but does not exist`);
  }

  if (
    decoratorContext.kind !== "method" &&
    decoratorContext.kind !== "getter" &&
    decoratorContext.kind !== "setter" &&
    decoratorContext.kind !== "accessor"
  ) {
    throw TypeError(
      `Expected context.kind to be 'method', 'getter', 'setter' or 'accessor', got '${typeof decoratorContext.kind === "string" ? decoratorContext.kind : typeof decoratorContext.kind}'`,
    );
  }

  return decoratorContext as MemberDecoratorContext;
}

export function toOperationDecoratorContext(context: unknown) {
  const decoratorContext = toMemberDecoratorContext(context);

  if (decoratorContext.kind !== "method") {
    throw TypeError(
      `Expected context.kind to be 'method', got '${decoratorContext.kind}'`,
    );
  }

  return decoratorContext as OperationDecoratorContext;
}

export function toSpecialOperationDecoratorContext(context: unknown) {
  const decoratorContext = toOperationDecoratorContext(context);

  if (decoratorContext.static !== false) {
    throw TypeError(
      `Expected context.static to be 'false', got '${decoratorContext.static}'`,
    );
  }

  return decoratorContext as SpecialOperationDecoratorContext;
}

export function toAttributeDecoratorContext(context: unknown) {
  const decoratorContext = toMemberDecoratorContext(context);

  if (
    decoratorContext.kind !== "getter" &&
    decoratorContext.kind !== "setter" &&
    decoratorContext.kind !== "accessor"
  ) {
    throw TypeError(
      `Expected context.kind to be 'getter', 'setter' or 'accessor', got '${decoratorContext.kind}'`,
    );
  }

  return decoratorContext as AttributeDecoratorContext;
}

export function isDecoratorArgs<T extends [AnyFunction, DecoratorContext]>(
  args: unknown[],
): args is T {
  return (
    args.length === 2 &&
    typeof args[0] === "function" &&
    typeof args[1] === "object" &&
    args[1] !== null
  );
}
