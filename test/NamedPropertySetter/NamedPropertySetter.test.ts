import {
  Exposed,
  Interface,
  NamedPropertyGetter,
  NamedPropertySetter,
  SupportedPropertyNames,
} from "lib";

import {
  ExistingNamedPropertySetter as ExistingNamedPropertySetterSymbol,
  NamedPropertySetter as NamedPropertySetterSymbol,
  NewNamedPropertySetter as NewNamedPropertySetterSymbol,
} from "@t15i/webspecs/webidl";
import { Boolean, DOMString, Undefined } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NamedPropertySetter", () => {
  test("should define [NamedPropertySetter] operation on the interface", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem(name: string): string | null {
        return name;
      }

      @NamedPropertySetter(DOMString)
      namedPropertySetter(name: string, value: string) {
        void name;
        void value;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const instance = new Test();
    const operation = getInterface(Test).members[NamedPropertySetterSymbol]!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const methodSteps = Test.prototype.namedPropertySetter as any;

    expect(operation.kind).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("setter")).toBe(true);
    expect(operation.identifier).toBe("namedPropertySetter");
    expect(operation.returnType).toBe(Undefined);
    expect(operation.arguments[0]).toEqual({ type: DOMString });
    expect(operation.arguments[1]).toEqual({ type: DOMString });
    expect(typeof operation.methodSteps).toBe("function");
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
    @Exposed("Window")
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem(name: string): string | null {
        return name;
      }

      @NamedPropertySetter(DOMString, Boolean)
      namedPropertySetter(): boolean {
        return true;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const operation = getInterface(Test).members[NamedPropertySetterSymbol]!;

    expect(operation.returnType).toBe(Boolean);
  });

  test("should not register the behaviors to set the value of a new or existing named property for a named setter", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem(name: string): string | null {
        return name;
      }

      @NamedPropertySetter(DOMString)
      namedPropertySetter() {}

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const i = getInterface(Test);

    expect(i.members[NewNamedPropertySetterSymbol]).toBeUndefined();
    expect(i.members[ExistingNamedPropertySetterSymbol]).toBeUndefined();
  });

  test("should also register the behaviors to set the value of a new and existing named property for an anonymous setter", () => {
    const anonymous = Symbol("anonymous");

    @Exposed("Window")
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem(name: string): string | null {
        return name;
      }

      @NamedPropertySetter(DOMString)
      [anonymous]() {}

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const i = getInterface(Test);

    expect(i.members[NamedPropertySetterSymbol]!.identifier).toBeUndefined();
    expect(i.members[NewNamedPropertySetterSymbol]).toBe(
      i.members[NamedPropertySetterSymbol]!.methodSteps,
    );
    expect(i.members[ExistingNamedPropertySetterSymbol]).toBe(
      i.members[NamedPropertySetterSymbol]!.methodSteps,
    );
  });

  test("should reject a named property setter without a named property getter", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @NamedPropertySetter(DOMString)
        namedPropertySetter(name: string, value: string) {
          void name;
          void value;
        }
      }
    }).toThrow();
  });
});
