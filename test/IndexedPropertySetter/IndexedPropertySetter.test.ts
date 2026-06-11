import { IndexedPropertySetter, Interface } from "lib";

import {
  ExistingIndexedPropertySetter as ExistingIndexedPropertySetterSymbol,
  IndexedPropertySetter as IndexedPropertySetterSymbol,
  NewIndexedPropertySetter as NewIndexedPropertySetterSymbol,
  Undefined,
  UnsignedLong,
} from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@IndexedPropertySetter", () => {
  test("should define [IndexedPropertySetter] operation on the interface", () => {
    @Interface
    class Test {
      @IndexedPropertySetter(UnsignedLong)
      indexedPropertySetter() {}
    }

    const operation = getInterface(new Test())[IndexedPropertySetterSymbol]!;

    expect(operation.memberType).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("setter")).toBe(true);
    expect(operation.identifier).toBe("indexedPropertySetter");
    expect(operation.returnType).toBe(Undefined);
    expect(operation.arguments[0]).toEqual({ type: UnsignedLong });
    expect(operation.arguments[1]).toEqual({ type: UnsignedLong });
    expect(operation.methodSteps).toBe(Test.prototype.indexedPropertySetter);
  });

  test("should use the provided Return type when supplied", () => {
    @Interface
    class Test {
      @IndexedPropertySetter(UnsignedLong, UnsignedLong)
      indexedPropertySetter(): number {
        return 0;
      }
    }

    const operation = getInterface(new Test())[IndexedPropertySetterSymbol]!;

    expect(operation.returnType).toBe(UnsignedLong);
  });

  test("should not register the behaviors to set the value of a new or existing indexed property for a named setter", () => {
    @Interface
    class Test {
      @IndexedPropertySetter(UnsignedLong)
      indexedPropertySetter() {}
    }

    const i = getInterface(new Test());

    expect(i[NewIndexedPropertySetterSymbol]).toBeUndefined();
    expect(i[ExistingIndexedPropertySetterSymbol]).toBeUndefined();
  });

  test("should also register the behaviors to set the value of a new and existing indexed property for an anonymous setter", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @IndexedPropertySetter(UnsignedLong)
      [anonymous]() {}
    }

    const i = getInterface(new Test());

    expect(i[IndexedPropertySetterSymbol]!.identifier).toBeUndefined();
    expect(i[NewIndexedPropertySetterSymbol]).toBe(Test.prototype[anonymous]);
    expect(i[ExistingIndexedPropertySetterSymbol]).toBe(
      Test.prototype[anonymous],
    );
  });
});
