import { InterfaceInitializationError } from "lib/utils/errors";

import type { InterfaceDraft } from "lib/types";

import { describe, expect, test } from "vitest";

function makeDraft(identifier?: string): InterfaceDraft {
  const draft: InterfaceDraft = {
    inherit: null,
    extendedAttributes: { exposed: "Window" },
    behaviors: {},
    members: {},
    staticMembers: {},
  };

  if (identifier !== undefined) {
    draft.identifier = identifier;
  }

  return draft;
}

describe("InterfaceInitializationError", () => {
  test("should name the interface whose initialization failed", () => {
    const error = new InterfaceInitializationError(makeDraft("Test"));

    expect(error).toBeInstanceOf(TypeError);
    expect(error.name).toBe("InterfaceInitializationError");
    expect(error.message).toBe("Cannot initialize interface 'Test'");
  });

  test("should preserve the underlying failure as the cause", () => {
    const cause = new TypeError("An interface must have an identifier");
    const error = new InterfaceInitializationError(makeDraft("Test"), {
      cause,
    });

    expect(error.cause).toBe(cause);
  });

  test("should leave a draft with no identifier unnamed", () => {
    // @Interface assigns the identifier before registering the initializer
    // that raises this error, so a draft reaching it unnamed is defensive
    // ground: the message then names the kind alone.
    const error = new InterfaceInitializationError(makeDraft());

    expect(error.message).toBe("Cannot initialize interface");
  });
});
