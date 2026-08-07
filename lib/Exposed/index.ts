import {
  Exposed as ExposedSymbol,
  InterfacePrototypeObject,
} from "@t15i/webspecs/webidl";

import type { InterfaceDecoratorTarget } from "@/types";

import type { ExposedDecorator } from "./types";

/**
 * Records `exposureSet` as the WebIDL interface's `[Exposed]` extended
 * attribute and installs the interface object on the global.
 *
 * @param exposureSet - The exposure set. Only `"Window"` is supported.
 * @param target - The interface object returned by `@Interface`.
 *
 * @remarks
 * Per WebIDL, exposing an interface installs its interface object as a property
 * of the realm's global object, keyed by the interface identifier — the
 * behavior a user agent gives to, for example, `window.HTMLCollection`. The
 * global object of a `Window` realm is the current global, so the interface
 * object is installed directly on `globalThis[identifier]`. A property that is
 * already present — a built-in such as `HTMLCollection`, or an interface
 * exposed earlier — is left untouched rather than overwritten.
 *
 * `@Exposed` must be applied outside `@Interface` (`@Exposed @Interface`): the
 * inner `@Interface` runs first and associates the interface with the
 * prototype, so this decorator can read it and install the global synchronously
 * — no deferral through an initializer is needed.
 *
 * @internal
 */
function defineExposed<Target extends InterfaceDecoratorTarget>(
  exposureSet: "Window",
  target: Target,
): typeof target {
  const iface = InterfacePrototypeObject.getInterfaceOf(
    target.prototype as InterfacePrototypeObject,
  );

  if (iface === null) {
    throw new TypeError(
      "@Exposed requires @Interface applied inside it (`@Exposed @Interface`)",
    );
  }

  iface.extendedAttributes[ExposedSymbol] = exposureSet;

  const global = globalThis as unknown as Record<PropertyKey, unknown>;
  if (!(iface.identifier in global)) {
    global[iface.identifier] = target;
  }

  return target;
}

/**
 * Creates a decorator that exposes a WebIDL interface on the `Window` global,
 * recording it as the interface's `[Exposed]` extended attribute.
 *
 * @param exposureSet - The exposure set. Only `"Window"` is supported.
 *
 * @remarks
 * Every WebIDL interface must declare where it is exposed; an interface that is
 * never marked as exposed is rejected when {@link Interface} finalizes it. Once
 * the class is finalized, its interface object is installed on the global
 * object under the interface identifier, without overwriting a property that is
 * already present.
 *
 * For the exposure to take effect, the enclosing class must also be decorated
 * with {@link Interface}, and `@Exposed` must be applied outside it so its
 * identifier is finalized first.
 *
 * @example
 * ```ts
 * \@Exposed("Window")
 * \@Interface
 * class HTMLCollection {
 *   // ...
 * }
 * ```
 *
 * @see https://webidl.spec.whatwg.org/#Exposed
 */
export function Exposed(exposureSet: "Window") {
  return defineExposed.bind(undefined, exposureSet) as ExposedDecorator;
}
