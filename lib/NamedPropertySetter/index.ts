import {
  type Type,
  NamedPropertySetter as NamedPropertySetterSymbol,
  DOMString,
  Undefined,
  NewNamedPropertySetter as NewNamedPropertySetterSymbol,
  ExistingNamedPropertySetter as ExistingNamedPropertySetterSymbol,
  type ArgumentList,
} from "@t15i/webspecs/webidl";

import { interfaceRegistry } from "../InterfaceRegistry";
import { SetterPrototype } from "../proto";
import { getIdentifierByName, getMethodSteps } from "../utils";

import type { SpecialOperationDecoratorContext } from "../types";
import {
  toSpecialOperationDecoratorContext,
  toOperationDecoratorTarget,
} from "../typeguards";

import type {
  NamedPropertySetterDecorator,
  NamedPropertySetterDecoratorTarget,
} from "./types";

/**
 * Defines the decorated method as the `[NamedPropertySetter]` internal method
 * of the WebIDL interface, with `T` as the WebIDL type of the value argument
 * and `Return` as the WebIDL type of the return value.
 *
 * When the decorated member is anonymous (a symbol or a `#`-prefixed identifier),
 * the same method is additionally registered as the behaviors to set the value
 * of a new named property and to set the value of an existing named property,
 * unless those slots are already filled.
 *
 * @internal
 */
function defineNamedPropertySetter<T, Return>(
  T: Type<T>,
  Return: Type<Return>,
  target: NamedPropertySetterDecoratorTarget<T, Return>,
  context: SpecialOperationDecoratorContext,
) {
  target = toOperationDecoratorTarget(target);
  context = toSpecialOperationDecoratorContext(context);

  const i = interfaceRegistry.get(context.metadata);
  const identifier = getIdentifierByName(context.name);
  const args: ArgumentList<[string, T]> = [{ type: DOMString }, { type: T }];
  const methodSteps = getMethodSteps(target, {
    arguments: args,
    returnType: Return,
  });

  i[NamedPropertySetterSymbol] = Object.create(SetterPrototype, {
    identifier: { value: identifier },
    returnType: { value: Return },
    arguments: { value: args },
    methodSteps: { value: methodSteps },
  });

  if (identifier === undefined) {
    i[NewNamedPropertySetterSymbol] ??= methodSteps;
    i[ExistingNamedPropertySetterSymbol] ??= methodSteps;
  }

  return methodSteps;
}

/**
 * Creates a decorator that defines a method as the `[NamedPropertySetter]`
 * internal method of the WebIDL interface, with `T` as the WebIDL type of the
 * value argument and `Return` as the WebIDL type of the return value.
 *
 * @param T - The WebIDL type of the values accepted by the setter.
 * @param Return - The WebIDL type of the value returned by the setter. Defaults
 *  to `Undefined`.
 *
 * @remarks
 * Invoked when a named property is assigned on an instance. The decorated
 * method receives the name and the value, and is expected to return a value
 * of the declared return type.
 *
 * When the decorated member is anonymous (a symbol or a `#`-prefixed
 * identifier), the same method is also registered as
 * {@link NewNamedPropertySetter} and {@link ExistingNamedPropertySetter},
 * unless those have already been defined.
 *
 * For the registered behavior to take effect, the enclosing class must also be
 * decorated with {@link Interface}.
 *
 * @example
 * ```ts
 * \@Interface
 * class HTMLCollection {
 *   \@NamedPropertySetter(Element)
 *   setNamedItem(name: string, value: Element) {
 *     // ...
 *   }
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#idl-named-properties
 */
export function NamedPropertySetter<T>(
  T: Type<T>,
): NamedPropertySetterDecorator<T, void>;

export function NamedPropertySetter<T, Return>(
  T: Type<T>,
  Return: Type<Return>,
): NamedPropertySetterDecorator<T, Return>;

export function NamedPropertySetter<T, Return>(
  T: Type<T>,
  Return: Type<Return> = Undefined as Type<Return>,
): NamedPropertySetterDecorator<T, Return> {
  return (
    defineNamedPropertySetter as typeof defineNamedPropertySetter<T, Return>
  ).bind(undefined, T, Return) as NamedPropertySetterDecorator<T, Return>;
}
