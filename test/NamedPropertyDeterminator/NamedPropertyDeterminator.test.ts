import {
  Exposed,
  Interface,
  NamedPropertyDeterminator,
  NamedPropertyGetter,
  SupportedPropertyNames,
} from "lib";

import { NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol } from "@t15i/webspecs/webidl";
import { DOMString } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NamedPropertyDeterminator", () => {
  test("should register the target as the behavior to determine the value of a named property", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @NamedPropertyDeterminator
      namedPropertyDeterminator() {}
    }

    expect(getInterface(Test).members[NamedPropertyDeterminatorSymbol]).toBe(
      Test.prototype.namedPropertyDeterminator,
    );
  });

  test("should take precedence over the behavior installed by an anonymous @NamedPropertyGetter regardless of order", () => {
    const anonymous = Symbol("anonymous");

    @Exposed("Window")
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      [anonymous](name: string): string {
        return name;
      }

      @NamedPropertyDeterminator
      namedPropertyDeterminator() {}

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    expect(getInterface(Test).members[NamedPropertyDeterminatorSymbol]).toBe(
      Test.prototype.namedPropertyDeterminator,
    );
  });
});
