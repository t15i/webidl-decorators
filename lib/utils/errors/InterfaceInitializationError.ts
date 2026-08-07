import type { InterfaceDraft } from "@/types";

/**
 * `TypeError` thrown when a decorated class cannot be initialized as a WebIDL
 * interface during class initialization.
 *
 * @param draft - The interface draft whose initialization failed.
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  validation error that triggered the failure.
 *
 * @remarks
 * Raised from the initializer the {@link Interface} decorator registers, once
 * the class is fully decorated: the draft the member decorators accumulated is
 * asserted and validated into a complete WebIDL interface, and the interface is
 * associated with the class. The message names the interface, whose identifier
 * is assigned by this point; the specific reason initialization was rejected —
 * an already-defined interface, an invalid draft, … — is preserved on `cause`.
 */
export class InterfaceInitializationError extends TypeError {
  constructor(draft: InterfaceDraft, options?: ErrorOptions) {
    const named =
      draft.identifier !== undefined ? ` '${draft.identifier}'` : "";

    super(`Cannot initialize interface${named}`, options);

    this.name = "InterfaceInitializationError";
  }
}
