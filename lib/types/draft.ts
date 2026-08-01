import type { PropertyKey } from "@t15i/webspecs/ecma";
import type {
  Attribute,
  Interface,
  InterfaceMembers,
  InterfaceStaticMembers,
  Operation,
  RegularAttribute,
  Type,
} from "@t15i/webspecs/webidl";

/**
 * A draft of a WebIDL definition `T`: the same shape as the finished
 * definition, but with the fields `K` — the parts the drafting process has
 * not necessarily produced yet — optional. Every other field stays required.
 *
 * @remarks
 * A draft is explicit about what may be missing: only the fields listed in
 * `K` may be absent, so consumers keep the finished definition's guarantees
 * everywhere else and presence checks concentrate where the definition is
 * genuinely still open.
 */
export type Draft<T, K extends keyof T = never> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * A draft of a WebIDL attribute: the same shape as {@link Attribute}, but
 * with the `getterSteps` and `setterSteps` fields optional.
 *
 * @remarks
 * Decorators build attributes up incrementally — a getter registers an
 * attribute without its setter steps, a later setter extends it in place — so
 * until the enclosing class is finalized by {@link Interface} either accessor
 * steps may still be missing. Everything else is derived from the WebIDL
 * type and the decorator context up front.
 */
export type AttributeDraft<T extends Type = Type> = Draft<
  Attribute<T>,
  "getterSteps" | "setterSteps"
>;

export type RegularAttributeDraft<T extends Type = Type> = Draft<
  RegularAttribute<T>,
  "getterSteps" | "setterSteps"
>;

/**
 * A draft of a WebIDL operation.
 *
 * @remarks
 * An operation is created whole — its signature, identifier, and method
 * steps are all derived the moment the decorator runs — so no field is
 * optional; the alias marks operations that still live in an
 * {@link InterfaceDraft}.
 */
export type OperationDraft<
  Args extends Type[] = Type[],
  Return extends Type = Type,
> = Draft<Operation<Args, Return>>;

/** A draft of a WebIDL interface member. */
export type MemberDraft = AttributeDraft | OperationDraft;

/**
 * Maps a member-table slot to its draft: an attribute to its
 * {@link AttributeDraft} and an operation to its {@link OperationDraft},
 * preserving the member's type parameters; behavior functions are registered
 * whole and keep their shape.
 */
type MemberSlotDraft<V> =
  V extends Attribute<infer T extends Type>
    ? AttributeDraft<T>
    : V extends Operation<infer Args, infer Return>
      ? OperationDraft<Args, Return>
      : V;

export type InterfaceDraftSpecialMembers = Record<PropertyKey, OperationDraft>;

/**
 * The member table of an {@link InterfaceDraft}: the same slots as
 * {@link InterfaceMembers}, with every member held as its draft.
 */
export type InterfaceDraftMembers = {
  [K in keyof InterfaceMembers]: MemberSlotDraft<InterfaceMembers[K]>;
};

/**
 * The static-member table of an {@link InterfaceDraft}: the same slots as
 * {@link InterfaceStaticMembers}, with every static member held as its draft.
 */
export type InterfaceDraftStaticMembers = {
  [K in keyof InterfaceStaticMembers]: MemberSlotDraft<
    InterfaceStaticMembers[K]
  >;
};

/**
 * A draft of a WebIDL interface: the same shape as {@link Interface}, but
 * with the `identifier` optional and the member tables holding member
 * drafts. The `extendedAttributes`, `members`, and `staticMembers`
 * containers are created up front by the {@link interfaceDraftRegistry} that
 * hands out the draft.
 *
 * @remarks
 * A draft is what member decorators accumulate their definitions into while
 * the class is being decorated: the identifier is only assigned once the
 * class decorator runs, and attributes may still be partial. The
 * {@link Interface} decorator validates the finished draft and narrows it to
 * a complete {@link Interface} before associating it with the class.
 */
export interface InterfaceDraft extends Draft<
  Omit<Interface, "members" | "staticMembers">,
  "identifier"
> {
  members: InterfaceDraftMembers;
  staticMembers: InterfaceDraftStaticMembers;
}
