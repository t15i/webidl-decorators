import { Interface, NamedPropertySetter } from "lib";

import {
  Boolean,
  DOMString,
  ExistingNamedPropertySetter as ExistingNamedPropertySetterSymbol,
  NamedPropertySetter as NamedPropertySetterSymbol,
  NewNamedPropertySetter as NewNamedPropertySetterSymbol,
  Undefined,
} from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NamedPropertySetter", () => {
  test("should define [NamedPropertySetter] operation on the interface", () => {
    @Interface
    class Test {
      @NamedPropertySetter(DOMString)
      namedPropertySetter() {}
    }

    const operation = getInterface(new Test())[NamedPropertySetterSymbol]!;

    expect(operation.memberType).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("setter")).toBe(true);
    expect(operation.identifier).toBe("namedPropertySetter");
    expect(operation.returnType).toBe(Undefined);
    expect(operation.arguments[0]).toEqual({ type: DOMString });
    expect(operation.arguments[1]).toEqual({ type: DOMString });
    expect(operation.methodSteps).toBe(Test.prototype.namedPropertySetter);
  });

  test("should use the provided Return type when supplied", () => {
    @Interface
    class Test {
      @NamedPropertySetter(DOMString, Boolean)
      namedPropertySetter(): boolean {
        return true;
      }
    }

    const operation = getInterface(new Test())[NamedPropertySetterSymbol]!;

    expect(operation.returnType).toBe(Boolean);
  });

  test("should not register the behaviors to set the value of a new or existing named property for a named setter", () => {
    @Interface
    class Test {
      @NamedPropertySetter(DOMString)
      namedPropertySetter() {}
    }

    const i = getInterface(new Test());

    expect(i[NewNamedPropertySetterSymbol]).toBeUndefined();
    expect(i[ExistingNamedPropertySetterSymbol]).toBeUndefined();
  });

  test("should also register the behaviors to set the value of a new and existing named property for an anonymous setter", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @NamedPropertySetter(DOMString)
      [anonymous]() {}
    }

    const i = getInterface(new Test());

    expect(i[NamedPropertySetterSymbol]!.identifier).toBeUndefined();
    expect(i[NewNamedPropertySetterSymbol]).toBe(Test.prototype[anonymous]);
    expect(i[ExistingNamedPropertySetterSymbol]).toBe(
      Test.prototype[anonymous],
    );
  });
});
