import { attributeChangeStepsRegistry } from "@/AttributeChangeStepsRegistry";
import { getPropertyDescriptor } from "@/utils";

import type { CustomElementConstructor, CustomElementContext } from "./types";

/**
 * Adds `names` to `target`'s `observedAttributes`, preserving any the class or
 * one of its base classes already declares.
 *
 * @param target - The custom element constructor to extend.
 * @param names - The reflected content attribute names to observe.
 *
 * @remarks
 * `observedAttributes` is idiomatically an inherited `static get`, which cannot
 * be assigned to. So rather than writing the property, its own-or-inherited
 * descriptor is resolved, mutated in place, and redefined on `target`: an
 * accessor's getter is wrapped to append `names` (falling back to an empty list
 * when the original getter yields nothing), and a data property's value has
 * `names` appended. Reusing the resolved descriptor keeps its original
 * `enumerable`/`configurable`/`writable` flags, so the redefinition stays as
 * unobtrusive as possible. When the property is not declared anywhere, a fresh
 * writable data descriptor stands in.
 */
function observeReflectedAttributes(
  target: CustomElementConstructor,
  names: string[],
): void {
  const descriptor: PropertyDescriptor = getPropertyDescriptor(
    target,
    "observedAttributes",
  ) ?? { configurable: true, enumerable: false, writable: true };

  if (descriptor.get !== undefined) {
    const getObservedAttributes = descriptor.get;
    descriptor.get = function (this: CustomElementConstructor): string[] {
      return [...(getObservedAttributes.call(this) ?? []), ...names];
    };
  } else {
    const observedAttributes: Iterable<string> = descriptor.value ?? [];
    descriptor.value = [...observedAttributes, ...names];
  }

  Object.defineProperty(target, "observedAttributes", descriptor);
}

/**
 * Wires the reflected attribute change steps collected while the class was
 * decorated into the custom element's `observedAttributes` and
 * `attributeChangedCallback`.
 *
 * Drains the steps registered on the class metadata, appends their content
 * attribute names to `observedAttributes`, and wraps `attributeChangedCallback`
 * so that, after normalizing the arguments to strings or `null`, the step
 * registered for the changed attribute runs before the class's original
 * callback.
 *
 * The `observedAttributes` merge is deferred to a class initializer because a
 * `static observedAttributes` field initializes after class decorators run and
 * would otherwise overwrite a merge done here; class initializers run after
 * those fields, and still before the user can call `customElements.define`.
 *
 * @param target - The custom element constructor being defined.
 * @param context - The interface decorator context, whose `metadata` keys the
 *  drained change steps and whose `addInitializer` defers the merge.
 *
 * @remarks
 * Applied by {@link Interface} to classes that extend `HTMLElement`; it is what
 * makes content-attribute mutations propagate to reflected IDL attributes.
 *
 * @internal
 */
export function CustomElement(
  target: CustomElementConstructor,
  context: CustomElementContext,
): void {
  const steps = attributeChangeStepsRegistry.drain(context.metadata);

  if (steps.size === 0) {
    return;
  }

  context.addInitializer(function () {
    observeReflectedAttributes(target, [...steps.keys()]);
  });

  const originalAttributeChangedCallback =
    target.prototype.attributeChangedCallback;
  target.prototype.attributeChangedCallback = function (
    name,
    oldValue,
    value,
    namespace,
  ) {
    name = String(name);
    oldValue = oldValue !== null ? String(oldValue) : null;
    value = value !== null ? String(value) : null;
    namespace = namespace !== null ? String(namespace) : null;

    steps.get(name)?.call(this, name, oldValue, value, namespace);

    originalAttributeChangedCallback?.call(
      this,
      name,
      oldValue,
      value,
      namespace,
    );
  };
}
