/**
 * A symbol that exposes per-instance internal state on {@link Interface}-decorated
 * classes.
 *
 * @remarks
 * Assign an object to `this[Internals]` inside the constructor to register the
 * instance's internal state. Once construction completes, reading
 * `instance[Internals]` yields that same object on every subsequent access,
 * across all methods of the instance, including methods inherited from parent
 * {@link Interface}-decorated classes.
 *
 * Because `@Interface` replaces the class with a proxy, `#private` fields
 * declared on the class are not reachable through method calls on instances.
 * Use `this[Internals]` to store instance-private state instead.
 *
 * @example
 * ```ts
 * interface HTMLCollectionInternals {
 *   items: Element[];
 * }
 *
 * \@Interface
 * class HTMLCollection {
 *   /** \@internal *\/
 *   declare [Internals]: HTMLCollectionInternals;
 *
 *   constructor() {
 *     this[Internals] = { items: [] };
 *   }
 *
 *   \@IndexedPropertyGetter(Element)
 *   item(index: number): Element | null {
 *     return this[Internals].items[index] ?? null;
 *   }
 * }
 * ```
 */
export const Internals: unique symbol = Symbol();

export const internals: WeakMap<object, object> = new WeakMap();
