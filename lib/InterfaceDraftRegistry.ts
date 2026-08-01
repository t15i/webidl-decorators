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

    let parentDraft: InterfaceDraft | null = null;

    let proto = Object.getPrototypeOf(metadata);
    while (proto !== null) {
      if (this.drafts_.has(proto)) {
        parentDraft = this.drafts_.get(proto)!;
        break;
      }

      proto = Object.getPrototypeOf(proto);
    }

    const draft: InterfaceDraft = Object.create(parentDraft, {
      extendedAttributes: {
        value: Object.create(parentDraft?.extendedAttributes ?? null),
      },
      staticMembers: {
        value: Object.create(parentDraft?.staticMembers ?? null),
      },
      members: {
        value: Object.create(parentDraft?.members ?? null),
      },
    });
    this.drafts_.set(metadata, draft);

    return draft;
  }
}

export const interfaceDraftRegistry: InterfaceDraftRegistry =
  new InterfaceDraftRegistry();
