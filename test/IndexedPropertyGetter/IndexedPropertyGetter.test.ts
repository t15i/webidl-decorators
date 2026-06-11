import { IndexedPropertyGetter, Interface } from "lib";

import {
  IndexedPropertyDeterminator as IndexedPropertyDeterminatorSymbol,
  IndexedPropertyGetter as IndexedPropertyGetterSymbol,
  UnsignedLong,
} from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@IndexedPropertyGetter", () => {
  test("should define [IndexedPropertyGetter] operation on the interface", () => {
    @Interface
    class Test {
      @IndexedPropertyGetter(UnsignedLong)
      item() {
        return 0;
      }
    }

    const operation = getInterface(new Test())[IndexedPropertyGetterSymbol]!;

    expect(operation.memberType).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("getter")).toBe(true);
    expect(operation.identifier).toBe("item");
    expect(operation.returnType).toBe(UnsignedLong);
    expect(operation.arguments).toEqual([{ type: UnsignedLong }]);
    expect(operation.methodSteps).toBe(Test.prototype.item);
  });

  test("should leave identifier undefined when name is a symbol", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @IndexedPropertyGetter(UnsignedLong)
      [anonymous]() {
        return 0;
      }
    }

    const operation = getInterface(new Test())[IndexedPropertyGetterSymbol]!;

    expect(operation.identifier).toBeUndefined();
    expect(operation.methodSteps).toBe(Test.prototype[anonymous]);
  });

  test("should not register the behavior to determine the value of an indexed property for a named getter", () => {
    @Interface
    class Test {
      @IndexedPropertyGetter(UnsignedLong)
      item() {
        return 0;
      }
    }

    const i = getInterface(new Test());

    expect(i[IndexedPropertyDeterminatorSymbol]).toBeUndefined();
  });

  test("should also register the behavior to determine the value of an indexed property for an anonymous getter", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @IndexedPropertyGetter(UnsignedLong)
      [anonymous]() {
        return 0;
      }
    }

    const i = getInterface(new Test());

    expect(i[IndexedPropertyGetterSymbol]!.identifier).toBeUndefined();
    expect(i[IndexedPropertyDeterminatorSymbol]).toBe(
      Test.prototype[anonymous],
    );
  });
});
