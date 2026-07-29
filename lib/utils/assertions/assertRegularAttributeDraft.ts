import type { AttributeDraft, RegularAttributeDraft } from "@/types";

/**
 * Throws `TypeError` unless the attribute draft `draft` is a regular (non-
 * static) attribute. The `asserts` signature narrows `draft` to
 * {@link RegularAttributeDraft} for the caller.
 *
 * @param draft - The attribute draft to check.
 *
 * @remarks
 * Reflection applies only to regular attributes; a `static` attribute has no
 * reflected content attribute on an element.
 */
export function assertRegularAttributeDraft(
  draft: AttributeDraft,
): asserts draft is RegularAttributeDraft {
  if (draft.keywords.has("static")) {
    throw new TypeError(
      "The WebIDL attribute is static, but reflection applies only to regular attributes",
    );
  }
}
