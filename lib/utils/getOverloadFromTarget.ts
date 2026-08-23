import type { AnyFunction, OperationDraft } from "@/types";

/**
 * Picks, out of the overloads declared under one identifier, the one the
 * decorated method declared.
 *
 * @param slot - The overloads registered under the identifier, in declaration
 *  order.
 * @param target - The decorated method, which the overload it declared carries
 *  as its method steps.
 *
 * @returns The overload whose steps are `target`.
 *
 * @throws TypeError if no overload of the slot carries `target`.
 *
 * @remarks
 * A supplementing decorator ({@link Getter}, {@link Setter}, {@link Deleter})
 * writes onto the operation the {@link Operation} below it registered. That
 * slot may already hold overloads another method declared, so the one to write
 * onto is found by its steps rather than by position - searching from the end,
 * since a method carrying several declarations registers the topmost one last.
 *
 * Finding none is an error rather than a reason to settle for another overload
 * of the slot: the decorated method declared no operation of its own, and every
 * overload there belongs to some other method. An empty slot is that same error
 * reached from the other side.
 *
 * Matching on the function object ties the two decorators to one method, so a
 * decorator between them that replaced the decorated method would leave nothing
 * to match. No decorator of this library replaces one.
 */
export function getOverloadFromTarget(
  slot: OperationDraft[],
  target: AnyFunction,
): OperationDraft {
  const op = slot.findLast((overload) => overload.methodSteps === target);

  if (op === undefined) {
    throw new TypeError(
      "No WebIDL operation is registered for the decorated method; apply @Operation to it",
    );
  }

  return op;
}
