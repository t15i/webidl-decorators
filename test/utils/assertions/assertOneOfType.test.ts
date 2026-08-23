import type { Type } from "@t15i/webspecs/webidl";

import { assertOneOfType, assertStrictOneOfType } from "lib/utils/assertions";

import {
  Annotated,
  Clamp,
  DOMString,
  Long,
  UnsignedLong,
} from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

/**
 * A coercion function that was never added to the shared type registry, so
 * `getTypeId` resolves no identifier for it. Both assertions name the types
 * they reject, and fall back to "unknown" for a type they cannot name.
 */
function makeUnregisteredType(): Type {
  return ((value: unknown) => value) as unknown as Type;
}

describe("assertOneOfType", () => {
  test("should accept a type that is one of the candidates", () => {
    expect(() => assertOneOfType(Long, DOMString, Long)).not.toThrow();
  });

  test("should reject a type that is none of the candidates", () => {
    expect(() => assertOneOfType(DOMString, Long, UnsignedLong)).toThrow(
      "The WebIDL type 'DOMString' is not one of: long, unsigned long",
    );
  });

  test("should name an unregistered type as unknown", () => {
    expect(() =>
      assertOneOfType(makeUnregisteredType(), makeUnregisteredType()),
    ).toThrow("The WebIDL type 'unknown' is not one of: unknown");
  });

  test("should compare an annotated type by its underlying type", () => {
    expect(() =>
      assertOneOfType(Annotated({ [Clamp]: null }, Long), Long),
    ).not.toThrow();
    expect(() =>
      assertOneOfType(Long, Annotated({ [Clamp]: null }, Long)),
    ).not.toThrow();
  });
});

describe("assertStrictOneOfType", () => {
  test("should accept a type that is one of the candidates", () => {
    expect(() => assertStrictOneOfType(Long, DOMString, Long)).not.toThrow();
  });

  test("should reject a type that is none of the candidates", () => {
    expect(() => assertStrictOneOfType(DOMString, Long, UnsignedLong)).toThrow(
      "The WebIDL type 'DOMString' is not one of: long, unsigned long",
    );
  });

  test("should name an unregistered type as unknown", () => {
    expect(() =>
      assertStrictOneOfType(makeUnregisteredType(), makeUnregisteredType()),
    ).toThrow("The WebIDL type 'unknown' is not one of: unknown");
  });

  test("should treat an annotated type as distinct from its underlying type", () => {
    expect(() =>
      assertStrictOneOfType(Annotated({ [Clamp]: null }, Long), Long),
    ).toThrow("The WebIDL type '[Clamp] long' is not one of: long");
  });
});
