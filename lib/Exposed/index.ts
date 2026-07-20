import {
  Exposed as ExposedSymbol,
  PlatformObject,
} from "@t15i/webspecs/webidl";

import { getInterfaceDraftFromContext } from "@/utils";

import type {
  InterfaceDecoratorContext,
  InterfaceDecoratorTarget,
} from "@/types";

import type { ExposedDecorator } from "./types";

/**
 * Records `exposureSet` as the WebIDL interface's `[Exposed]` extended
 * attribute and exposes the interface object on the global once the class is
 * finalized.
 *
 * @param exposureSet - The exposure set. Only `"Window"` is supported.
 * @param target - The constructor function of the class.
 * @param context - The decorator context object.
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
 * The identifier is read from the finalized interface, so `@Exposed` must be
 * applied outside `@Interface` (`@Exposed @Interface`) for its initializer to
 * run after the primary interface is associated.
 *
 * @internal
 */
function defineExposed<Target extends InterfaceDecoratorTarget>(
  exposureSet: "Window",
  target: Target,
  context: InterfaceDecoratorContext,
): typeof target {
  getInterfaceDraftFromContext(context).extendedAttributes[ExposedSymbol] =
    exposureSet;

  context.addInitializer(function () {
    const iface = PlatformObject.getPrimaryInterfaceOf(this.prototype);

    if (iface === undefined) {
      throw new TypeError(
        "@Exposed requires @Interface applied inside it (`@Exposed @Interface`)",
      );
    }

    const global = globalThis as unknown as Record<PropertyKey, unknown>;
    if (iface.identifier in global) return;
    global[iface.identifier] = this;
  });

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
