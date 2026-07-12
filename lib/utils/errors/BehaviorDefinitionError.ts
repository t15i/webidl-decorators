import type { BehaviorKey } from "@/defineBehavior/types";

function describeBehaviorKey(key: BehaviorKey): string {
  return typeof key === "symbol"
    ? (key.description ?? key.toString())
    : `${key}`;
}

/**
 * `TypeError` thrown when a WebIDL behavior cannot be defined on an interface.
 *
 * @param key - The WebIDL symbol identifying the behavior whose definition
 *  failed.
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  validation error that triggered the failure.
 *
 * @remarks
 * The message names the behavior being defined by `key`. The specific reason
 * the definition was rejected is preserved on `cause`.
 */
export class BehaviorDefinitionError extends TypeError {
  constructor(key: BehaviorKey, options?: ErrorOptions) {
    super(`Cannot define behavior '${describeBehaviorKey(key)}'`, options);

    this.name = "BehaviorDefinitionError";
  }
}
