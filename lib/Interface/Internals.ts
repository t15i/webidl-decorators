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
 * `@Interface` replaces a legacy platform object (a class with indexed or named
 * property behaviors) with a proxy, which makes `#private` fields declared on
 * that class unreachable through method calls on instances. Use
 * `this[Internals]` to store instance-private state on such classes instead. A
 * regular platform object is not proxied, so its `#private` fields work as
 * usual and `this[Internals]` is unnecessary.
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
 *   \@Getter
 *   \@Operation(Nullable(InterfaceType(Element)), [UnsignedLong])
 *   item(index: number): Element | null {
 *     return this[Internals].items[index] ?? null;
 *   }
 * }
 * ```
 *
 */
export const Internals: unique symbol = Symbol();
