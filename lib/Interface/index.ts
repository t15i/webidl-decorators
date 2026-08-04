import {
  validateInterface,
  PlatformObject as WebIDLPlatformObject,
  type Interface,
} from "@t15i/webspecs/webidl";

import { unnamedOperationRegistry } from "@/UnnamedOperationRegistry";

import { getInterfaceDraftFromContext } from "@/utils";
import { assertInterface, assertNoDefinedInterface } from "@/utils/assertions";
import {
  InterfaceDefinitionError,
  InterfaceInitializationError,
} from "@/utils/errors";

import {
  type InterfaceDecoratorContext,
  type InterfaceDecoratorTarget,
} from "@/types";

import { PlatformObject } from "./PlatformObject";
import { CustomElement } from "./CustomElement";

import type { InterfaceDecorator } from "./types";

/**
 * Decorates a class as a WebIDL interface, registering `identifier` as its
 * WebIDL identifier.
 *
 * @internal
 */
function defineInterface<T extends InterfaceDecoratorTarget>(
  identifier: string | undefined,
  target: T,
  context: InterfaceDecoratorContext,
): typeof target {
  try {
    if (identifier === undefined && context.name === undefined) {
      throw TypeError(
        "Expected at least one identifier or context.name to be 'string'",
      );
    }

    const iface = getInterfaceDraftFromContext(context);
    iface.identifier = (identifier ?? context.name)!;

    context.addInitializer(function () {
      try {
        assertNoDefinedInterface(this);
        assertInterface(iface);

        validateInterface(iface);

        WebIDLPlatformObject.setPrimaryInterfaceOf(this.prototype, iface);

        unnamedOperationRegistry.drop(context.metadata);
      } catch (e) {
        throw new InterfaceInitializationError(iface, { cause: e });
      }
    });

    if (target.prototype instanceof HTMLElement) {
      CustomElement(target, context);
    }
    return PlatformObject(target);
  } catch (e) {
    throw new InterfaceDefinitionError({ cause: e });
  }
}

const InterfaceDefault = defineInterface.bind(undefined, undefined);

/**
 * Decorates a class as a WebIDL interface, using the class name as the WebIDL
 * identifier.
 *
 * @param target - The constructor function of the class.
 * @param context - The decorator context object.
 *
 * @remarks
 * For behavior decorators from this library to take effect, the enclosing
 * class must be decorated with `@Interface`.
 *
 * The decorator wraps the class so that constructed instances behave as WebIDL
 * platform objects: indexed and named property access, property setters, and
 * deleter semantics are applied automatically based on the behavior decorators
 * applied to the class members.
 *
 * A legacy platform object (a class with indexed or named property behaviors)
 * is wrapped in a proxy, so its `#private` fields are not reachable through
 * method calls on instances; use the provided `this[{@link Internals}]` object
 * to store instance-private state instead. A regular platform object is not
 * proxied and can use `#private` fields as usual.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@Getter
 *   \@Operation([UnsignedLong], Nullable(Type(Element)))
 *   item(index: number): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-interfaces
 */
export function Interface<T extends InterfaceDecoratorTarget>(
  target: T,
  context: InterfaceDecoratorContext,
): T;

/**
 * Creates a decorator that decorates a class as a WebIDL interface, using
 * `identifier` as the WebIDL identifier instead of the class name.
 *
 * @param identifier - The WebIDL identifier to use for the interface.
 *
 * @remarks
 * For behavior decorators from this library to take effect, the enclosing
 * class must be decorated with `@Interface`.
 *
 * The decorator wraps the class so that constructed instances behave as WebIDL
 * platform objects: indexed and named property access, property setters, and
 * deleter semantics are applied automatically based on the behavior decorators
 * applied to the class members.
 *
 * A legacy platform object (a class with indexed or named property behaviors)
 * is wrapped in a proxy, so its `#private` fields are not reachable through
 * method calls on instances; use the provided `this[{@link Internals}]` object
 * to store instance-private state instead. A regular platform object is not
 * proxied and can use `#private` fields as usual.
 *
 * @example
 * ```ts
 * \@Interface("HTMLCollection")
 * class HTMLCollectionImpl {
 *   \@Getter
 *   \@Operation([UnsignedLong], Nullable(Type(Element)))
 *   item(index: number): Element | null {
 *     // ...
 *     return value;
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-interfaces
 */
export function Interface(identifier: string): InterfaceDecorator;

export function Interface(...args: unknown[]) {
  if (args.length === 2 && typeof args[0] === "function") {
    return InterfaceDefault(
      args[0] as InterfaceDecoratorTarget,
      args[1] as InterfaceDecoratorContext,
    );
  }

  return defineInterface.bind(undefined, args[0] as string);
}

export { Internals } from "./PlatformObject";
