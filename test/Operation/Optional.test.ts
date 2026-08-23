import {
  Argument,
  Constructor,
  Exposed,
  Interface,
  Operation,
  Optional,
} from "lib";

import { DOMString, Undefined } from "@t15i/webidl-types";
import { isUnionType, type UnionType } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface, getOverloads } from "../utils";

describe("Optional", () => {
  test("should declare the argument optional and widen its type with undefined", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Operation(DOMString, [
        Argument(DOMString, "a"),
        Optional(Argument(DOMString, "b")),
      ])
      join(a: string, b: string | undefined): string {
        return b === undefined ? a : `${a}${b}`;
      }
    }

    const operation = getOverloads(getInterface(Test), "join")![0]!;
    const [a, b] = operation.arguments;

    expect(a!.keywords.has("optional")).toBe(false);
    expect(b!.keywords.has("optional")).toBe(true);
    expect(Object.hasOwn(b!, "defaultValue")).toBe(false);
    expect(isUnionType(b!.type)).toBe(true);
    expect([...(b!.type as UnionType).memberTypes]).toEqual([
      DOMString,
      Undefined,
    ]);
  });

  test("should pass undefined for an optional argument declared without a default", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Operation(DOMString, [
        Argument(DOMString, "a"),
        Optional(Argument(DOMString, "b")),
      ])
      join(a: string, b: string | undefined): string {
        return b === undefined ? a : `${a}${b}`;
      }
    }

    const instance = new Test();

    expect(instance.join("x", undefined)).toBe("x");
    expect(instance.join("x", "y")).toBe("xy");
    expect((instance.join as (a: string) => string)("x")).toBe("x");
  });

  test("should keep the declared type and supply the default value when one is given", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Operation(DOMString, [
        Argument(DOMString, "a"),
        Optional(Argument(DOMString, "b"), "!"),
      ])
      greet(a: string, b: string): string {
        return `${a}${b}`;
      }
    }

    const instance = new Test();
    const b = getOverloads(getInterface(Test), "greet")![0]!.arguments[1]!;

    expect(b.keywords.has("optional")).toBe(true);
    expect(b.defaultValue).toBe("!");
    expect(b.type).toBe(DOMString);
    expect((instance.greet as (a: string) => string)("hi")).toBe("hi!");
    expect(instance.greet("hi", "?")).toBe("hi?");
  });

  test("should mutate the argument it is given rather than copying it", () => {
    const argument = Argument(DOMString, "value");

    expect(Optional(argument, "x")).toBe(argument);
    expect(argument.keywords.has("optional")).toBe(true);
  });
});
