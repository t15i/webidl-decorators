import { IndexedPropertySetter, Interface } from "lib";

import {
  ExistingIndexedPropertySetter as ExistingIndexedPropertySetterSymbol,
  IndexedPropertySetter as IndexedPropertySetterSymbol,
  NewIndexedPropertySetter as NewIndexedPropertySetterSymbol,
} from "@t15i/webspecs/webidl";
import { Undefined, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@IndexedPropertySetter", () => {
  test("should define [IndexedPropertySetter] operation on the interface", () => {
    @Interface
    class Test {
      @IndexedPropertySetter(UnsignedLong)
      indexedPropertySetter(i: number, v: number) {
        void i;
        void v;
      }
    }

    const instance = new Test();
    const operation = getInterface(Test).members[IndexedPropertySetterSymbol]!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const methodSteps = Test.prototype.indexedPropertySetter as any;

    expect(operation.memberType).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("setter")).toBe(true);
    expect(operation.identifier).toBe("indexedPropertySetter");
    expect(operation.returnType).toBe(Undefined);
    expect(operation.arguments[0]).toEqual({ type: UnsignedLong });
    expect(operation.arguments[1]).toEqual({ type: UnsignedLong });
    expect(typeof operation.methodSteps).toBe("function");
    expect(methodSteps.length).toBe(2);
    expect(methodSteps.name).toBe("indexedPropertySetter");
    expect(() => methodSteps.call({}, 0, 0)).toThrow(
      new TypeError("Illegal invocation"),
    );
    expect(() => methodSteps.call(instance, 0)).toThrow(
      new TypeError(
        "Failed to execute 'indexedPropertySetter' on 'Test': 2 arguments required, but only 1 present.",
      ),
    );
    expect(() => methodSteps.call(instance, 0, 0)).not.toThrow();
    expect(() => methodSteps.call(instance, 0, 0, 0)).not.toThrow();
  });

  test("should use the provided Return type when supplied", () => {
    @Interface
    class Test {
      @IndexedPropertySetter(UnsignedLong, UnsignedLong)
      indexedPropertySetter(): number {
        return 0;
      }
    }

    const operation = getInterface(Test).members[IndexedPropertySetterSymbol]!;

    expect(operation.returnType).toBe(UnsignedLong);
  });

  test("should not register the behaviors to set the value of a new or existing indexed property for a named setter", () => {
    @Interface
    class Test {
      @IndexedPropertySetter(UnsignedLong)
      indexedPropertySetter() {}
    }

    const i = getInterface(Test);

    expect(i.members[NewIndexedPropertySetterSymbol]).toBeUndefined();
    expect(i.members[ExistingIndexedPropertySetterSymbol]).toBeUndefined();
  });

  test("should also register the behaviors to set the value of a new and existing indexed property for an anonymous setter", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @IndexedPropertySetter(UnsignedLong)
      [anonymous]() {}
    }

    const i = getInterface(Test);

    expect(i.members[IndexedPropertySetterSymbol]!.identifier).toBeUndefined();
    expect(i.members[NewIndexedPropertySetterSymbol]).toBe(
      i.members[IndexedPropertySetterSymbol]!.methodSteps,
    );
    expect(i.members[ExistingIndexedPropertySetterSymbol]).toBe(
      i.members[IndexedPropertySetterSymbol]!.methodSteps,
    );
  });
});
