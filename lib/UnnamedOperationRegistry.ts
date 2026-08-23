import type { PropertyKey } from "@t15i/webspecs/ecma";

import type { OperationDraft } from "./types";

/**
 * Registry of the anonymous WebIDL operation drafts under construction, keyed by
 * the decoration metadata of the classes being decorated and, within each, by
 * the decorated member's property name.
 *
 * @remarks
 * A named operation is stored directly in its interface draft's member table,
 * among the overloads declared under its identifier. An anonymous one - a
 * special operation keyed by a symbol, or by a private name that declares no
 * overload - has no such slot, so {@link Operation} parks it here for the
 * supplementing decorators ({@link Getter}, {@link Setter}, {@link Deleter}) to
 * read back by the same property name. The {@link Interface} decorator drops the
 * class's entry once the class is fully decorated.
 */
class UnnamedOperationRegistry {
  private data_ = new WeakMap<object, Map<PropertyKey, OperationDraft>>();

  add(metadata: object, name: PropertyKey, op: OperationDraft): void {
    const ops = this.data_.get(metadata) ?? new Map();
    ops.set(name, op);

    this.data_.set(metadata, ops);
  }

  get(metadata: object, name: PropertyKey): OperationDraft | undefined {
    return this.data_.get(metadata)?.get(name);
  }

  drop(metadata: object): boolean {
    return this.data_.delete(metadata);
  }
}

export const unnamedOperationRegistry: UnnamedOperationRegistry =
  new UnnamedOperationRegistry();
