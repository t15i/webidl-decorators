import { Interface, NamedPropertyGetter } from "lib";

import {
  DOMString,
  NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol,
  NamedPropertyGetter as NamedPropertyGetterSymbol,
} from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NamedPropertyGetter", () => {
  test("should define [NamedPropertyGetter] operation on the interface", () => {
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem() {
        return "";
      }
    }

    const operation = getInterface(new Test())[NamedPropertyGetterSymbol]!;

    expect(operation.memberType).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("getter")).toBe(true);
    expect(operation.identifier).toBe("namedItem");
    expect(operation.returnType).toBe(DOMString);
    expect(operation.arguments).toEqual([{ type: DOMString }]);
    expect(operation.methodSteps).toBe(Test.prototype.namedItem);
  });

  test("should leave identifier undefined when name is a symbol", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      [anonymous]() {
        return "";
      }
    }

    const operation = getInterface(new Test())[NamedPropertyGetterSymbol]!;

    expect(operation.identifier).toBeUndefined();
  });

  test("should not register the behavior to determine the value of a named property for a named getter", () => {
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem() {
        return "";
      }
    }

    const i = getInterface(new Test());

    expect(i[NamedPropertyDeterminatorSymbol]).toBeUndefined();
  });

  test("should also register the behavior to determine the value of a named property for an anonymous getter", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      [anonymous]() {
        return "";
      }
    }

    const i = getInterface(new Test());

    expect(i[NamedPropertyGetterSymbol]!.identifier).toBeUndefined();
    expect(i[NamedPropertyDeterminatorSymbol]).toBe(Test.prototype[anonymous]);
  });
});
