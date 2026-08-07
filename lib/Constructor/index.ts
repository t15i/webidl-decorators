import { type ArgumentList, type Type } from "@t15i/webspecs/webidl";

import {
  createConstructorFromContext,
  getInterfaceDraftFromContext,
  toArgumentList,
} from "@/utils";

import {
  type ConstructorDecoratorContext,
  type ConstructorDecoratorTarget,
} from "@/types";
import type { ConstructorDecorator } from "./types";

/**
 * Registers the WebIDL constructor operation of the decorated class on the
 * interface draft resolved from `context`.
 *
 * @remarks
 * Builds a constructor operation draft from `context`, the decorated class, and
 * `args`, and stores it under the fixed `"constructor"` key of the interface's
 * regular (non-static) members — a constructor operation has no identifier, so
 * it is keyed by that slot rather than by name.
 *
 * Nothing is returned: the decorated class is left in place, and `Interface`
 * later installs the guarded interface object that resolves overloads against
 * the registered argument list on `new`.
 *
 * @internal
 */
function defineConstructor<Params extends Type[]>(
  args: ArgumentList<Params>,
  target: ConstructorDecoratorTarget<Params>,
  context: ConstructorDecoratorContext<Params>,
): void {
  const iface = getInterfaceDraftFromContext(context);
  const constructorOperation = createConstructorFromContext({ target, args });

  // `iface.members.constructor` resolves in the type system to the built-in
  // `Object.prototype.constructor` slot rather than the member-table index
  // signature, so the write is routed through the index signature by way of a
  // widened key — storing the operation under the fixed `"constructor"` key.
  iface.members["constructor" as string] = constructorOperation;
}

const DefaultConstructor = defineConstructor.bind(undefined, []);

/**
 * Defines the decorated class's constructor as the WebIDL constructor operation
 * of the WebIDL interface, taking no arguments.
 *
 * @param target - The constructor function of the class.
 * @param context - The decorator context object.
 *
 * @remarks
 * The bare `@Constructor` form is shorthand for `@Constructor([])`: it registers
 * a constructor operation with an empty argument list, so `new` takes no
 * arguments. The class constructor must therefore be callable with no arguments.
 *
 * @example
 * ```ts
 * \@Interface
 * \@Constructor
 * class Thing {}
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 */
export function Constructor(
  target: ConstructorDecoratorTarget<[]>,
  context: ConstructorDecoratorContext<[]>,
): void;

/**
 * Creates a decorator that defines the decorated class's constructor as the
 * WebIDL constructor operation of the WebIDL interface, with `params` as the
 * tuple of the constructor's argument types.
 *
 * @param params - The tuple of the constructor's WebIDL argument types.
 *
 * @remarks
 * The decorator is applied to the class, alongside {@link Interface}. Unlike
 * {@link Operation}, a constructor operation carries no identifier and no return
 * type: it is registered under the fixed `"constructor"` key of the interface's
 * regular members, and its steps yield the constructed platform object.
 *
 * For the registered constructor to take effect, the enclosing class must also
 * be decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * \@Constructor([DOMString])
 * class Thing {
 *   constructor(name: string) {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 */
export function Constructor<Params extends Type[]>(
  params: [...Params],
): ConstructorDecorator<Params>;

export function Constructor<Params extends Type[] = Type[]>(
  ...args: unknown[]
) {
  if (args.length === 2 && typeof args[0] === "function") {
    return DefaultConstructor(
      args[0] as ConstructorDecoratorTarget<[]>,
      args[1] as ConstructorDecoratorContext<[]>,
    );
  }

  const defineConstructorT = defineConstructor<Params>;
  return defineConstructorT.bind(undefined, toArgumentList(args[0] as Params));
}
