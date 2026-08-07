import type { InterfaceDraft } from "./types";

/**
 * Registry of the WebIDL interface drafts under construction, keyed by the
 * decoration metadata of the classes being decorated.
 *
 * @remarks
 * The registry hands out {@link InterfaceDraft}s: member decorators accumulate
 * their definitions into the draft, and the {@link Interface} decorator
 * validates it into a complete `Interface` once the class is fully decorated.
 * A draft prototype-inherits from the parent class's draft — including its
 * `extendedAttributes`, `staticMembers`, and `members` tables — so inherited
 * definitions stay visible while own ones shadow them.
 */
export class InterfaceDraftRegistry {
  protected drafts_: WeakMap<object, InterfaceDraft> = new WeakMap();

  get(metadata: object): InterfaceDraft {
    if (this.drafts_.has(metadata)) {
      return this.drafts_.get(metadata)!;
    }

    const draft: InterfaceDraft = {
      inherit: null,
      extendedAttributes: {},
      members: {},
      staticMembers: {},
    };
    this.drafts_.set(metadata, draft);

    return draft;
  }

  drop(metadata: object): boolean {
    return this.drafts_.delete(metadata);
  }
}

export const interfaceDraftRegistry: InterfaceDraftRegistry =
  new InterfaceDraftRegistry();
