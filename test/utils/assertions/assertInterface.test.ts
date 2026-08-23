import type { Interface } from "@t15i/webspecs/webidl";

import { assertInterface } from "lib/utils/assertions";

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

describe("assertInterface", () => {
  test("should accept a draft that is exposed and has an identifier", () => {
    expect(() => assertInterface(makeDraft("Test"))).not.toThrow();
  });

  test("should reject a draft that is not exposed", () => {
    const draft = makeDraft("Test");
    draft.extendedAttributes = {};

    expect(() => assertInterface(draft)).toThrow(
      "An interface must be exposed on at least one global; apply @Exposed",
    );
  });

  test("should reject a draft with no identifier", () => {
    expect(() => assertInterface(makeDraft())).toThrow(
      "An interface must have an identifier",
    );
  });

  test("should reject a draft that only inherits an identifier", () => {
    // A draft inherits from the interface its class extends, so the identifier
    // has to be an own key: an inherited one names the parent, not this
    // interface.
    const draft = Object.setPrototypeOf(
      makeDraft(),
      makeDraft("Base") as Interface,
    ) as InterfaceDraft;

    expect(draft.identifier).toBe("Base");
    expect(() => assertInterface(draft)).toThrow(
      "An interface must have an identifier",
    );
  });

  test("should reject an attribute that defines no getter", () => {
    const draft = makeDraft("Test");
    draft.members["value"] = {
      kind: "attribute",
      extendedAttributes: {},
      keywords: new Set(),
      identifier: "value",
      type: ((v: unknown) => v) as never,
    };

    expect(() => assertInterface(draft)).toThrow(
      "The attribute 'value' must define a getter",
    );
  });
});
