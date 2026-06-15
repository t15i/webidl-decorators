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
      namedPropertySetter(name: string, value: string) {
        void name;
        void value;
      }
    }

    const instance = new Test();
    const operation =
      getInterface(instance).members[NamedPropertySetterSymbol]!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const methodSteps = Test.prototype.namedPropertySetter as any;

    expect(operation.memberType).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("setter")).toBe(true);
    expect(operation.identifier).toBe("namedPropertySetter");
    expect(operation.returnType).toBe(Undefined);
    expect(operation.arguments[0]).toEqual({ type: DOMString });
    expect(operation.arguments[1]).toEqual({ type: DOMString });
    expect(operation.methodSteps).toBe(Test.prototype.namedPropertySetter);
    expect(methodSteps.length).toBe(2);
    expect(methodSteps.name).toBe("namedPropertySetter");
    expect(() => methodSteps.call({}, "x", "y")).toThrow(
      new TypeError("Illegal invocation"),
    );
    expect(() => methodSteps.call(instance, "x")).toThrow(
      new TypeError(
        "Failed to execute 'namedPropertySetter' on 'Test': 2 arguments required, but only 1 present.",
      ),
    );
    expect(() => methodSteps.call(instance, "x", "y")).not.toThrow();
    expect(() => methodSteps.call(instance, "x", "y", "z")).not.toThrow();
  });

  test("should use the provided Return type when supplied", () => {
    @Interface
    class Test {
      @NamedPropertySetter(DOMString, Boolean)
      namedPropertySetter(): boolean {
        return true;
      }
    }

    const operation = getInterface(new Test()).members[
      NamedPropertySetterSymbol
    ]!;

    expect(operation.returnType).toBe(Boolean);
  });

  test("should not register the behaviors to set the value of a new or existing named property for a named setter", () => {
    @Interface
    class Test {
      @NamedPropertySetter(DOMString)
      namedPropertySetter() {}
    }

    const i = getInterface(new Test());

    expect(i.members[NewNamedPropertySetterSymbol]).toBeUndefined();
    expect(i.members[ExistingNamedPropertySetterSymbol]).toBeUndefined();
  });

  test("should also register the behaviors to set the value of a new and existing named property for an anonymous setter", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @NamedPropertySetter(DOMString)
      [anonymous]() {}
    }

    const i = getInterface(new Test());

    expect(i.members[NamedPropertySetterSymbol]!.identifier).toBeUndefined();
    expect(i.members[NewNamedPropertySetterSymbol]).toBe(
      Test.prototype[anonymous],
    );
    expect(i.members[ExistingNamedPropertySetterSymbol]).toBe(
      Test.prototype[anonymous],
    );
  });
});
