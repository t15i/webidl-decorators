import { attributeChangeStepsRegistry } from "@/AttributeChangeStepsRegistry";
import { customElementReactions } from "@/CustomElementReactions";
import { getPropertyDescriptor } from "@/utils";

import type { CustomElementConstructor, CustomElementContext } from "./types";

/**
 * Adds `names` to `target`'s `observedAttributes`, preserving any the class or
 * one of its base classes already declares.
 *
 * @param target - The custom element constructor to extend.
 * @param names - The reflected content attribute names to observe.
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
 * The two are not the same kind of thing and are not run the same way. The
 * registered steps are the spec's attribute change steps: they belong to the
 * mutation and run where the DOM delivered it. The class's own callback is a
 * custom element reaction, which the platform holds back until the
 * `[CEReactions]` operation that caused the mutation is done - so it is
 * offered to {@link customElementReactions} first, and run here only when
 * there is no such operation to wait for.
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
 * @internal
 */
export function CustomElement(
  target: CustomElementConstructor,
  context: CustomElementContext,
): void {
  const steps = attributeChangeStepsRegistry.drain(context.metadata);

  const originalAttributeChangedCallback =
    target.prototype.attributeChangedCallback;

  if (steps.size === 0 && originalAttributeChangedCallback === undefined) {
    return;
  }

  if (steps.size > 0) {
    context.addInitializer(function () {
      observeReflectedAttributes(target, [...steps.keys()]);
    });
  }

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

    if (originalAttributeChangedCallback === undefined) {
      return;
    }

    const reaction = originalAttributeChangedCallback.bind(
      this,
      name,
      oldValue,
      value,
      namespace,
    );

    if (!customElementReactions.enqueue(reaction)) reaction();
  };
}
