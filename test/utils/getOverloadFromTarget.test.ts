import { getOverloadFromTarget } from "lib/utils";

import type { AnyFunction, OperationDraft } from "lib/types";

import { Undefined } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

/**
 * An operation draft carrying `methodSteps`, which is all this resolver reads
 * of it.
 */
function overload(methodSteps: AnyFunction): OperationDraft {
  return {
    kind: "operation",
    extendedAttributes: {},
    keywords: new Set(),
    identifier: "item",
    arguments: [],
    returnType: Undefined,
    methodSteps,
  };
}

describe("getOverloadFromTarget", () => {
  test("should return the overload whose steps are the decorated method", () => {
    const target = () => undefined;
    const mine = overload(target);
    const slot = [overload(() => undefined), mine, overload(() => undefined)];

    expect(getOverloadFromTarget(slot, target)).toBe(mine);
  });

  test("should return the last of the overloads carrying the decorated method", () => {
    // A method carrying several declarations registers them bottom-up, so the
    // last one to reach the slot is the declaration nearest the decorator
    // reading it back.
    const target = () => undefined;
    const first = overload(target);
    const last = overload(target);
    const slot = [first, overload(() => undefined), last];

    expect(getOverloadFromTarget(slot, target)).toBe(last);
  });

  test("should reject a slot whose overloads all belong to other methods", () => {
    // Every overload there was declared by some other method, so there is
    // nothing for the decorated one to be supplemented onto.
    const slot = [overload(() => undefined), overload(() => undefined)];

    expect(() => getOverloadFromTarget(slot, () => undefined)).toThrow(
      "No WebIDL operation is registered for the decorated method; apply @Operation to it",
    );
  });

  test("should reject a slot holding no overload", () => {
    expect(() => getOverloadFromTarget([], () => undefined)).toThrow(
      "No WebIDL operation is registered for the decorated method; apply @Operation to it",
    );
  });
});
