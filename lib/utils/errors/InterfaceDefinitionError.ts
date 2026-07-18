import type { InterfaceDraft } from "@/types";

/**
 * `TypeError` thrown when a decorated class cannot be defined as a WebIDL
 * interface.
 *
 * @param draft - The interface draft whose finalization failed.
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  validation error that triggered the failure.
 *
 * @remarks
 * Thrown when the draft the member decorators accumulated does not validate
 * as a complete WebIDL interface. The message names the interface when its
 * identifier is already assigned; the specific reason the definition was
 * rejected is preserved on `cause`.
 */
export class InterfaceDefinitionError extends TypeError {
  constructor(draft: InterfaceDraft, options?: ErrorOptions) {
    const named =
      draft.identifier !== undefined ? ` '${draft.identifier}'` : "";

    super(`Cannot define interface${named}`, options);

    this.name = "InterfaceDefinitionError";
  }
}
