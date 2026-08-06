import {
  Attribute,
  Constructor,
  Exposed,
  Getter,
  Interface,
  Operation,
  Setter,
  SupportedPropertyIndices,
  SupportedPropertyNames,
} from "lib";

import {
  ExistingIndexedPropertySetter as ExistingIndexedPropertySetterSymbol,
  ExistingNamedPropertySetter as ExistingNamedPropertySetterSymbol,
  IndexedPropertySetter as IndexedPropertySetterSymbol,
  NamedPropertySetter as NamedPropertySetterSymbol,
  NewIndexedPropertySetter as NewIndexedPropertySetterSymbol,
  NewNamedPropertySetter as NewNamedPropertySetterSymbol,
} from "@t15i/webspecs/webidl";
import {
  Boolean,
  DOMString,
  Undefined,
  UnsignedLong,
} from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@Setter", () => {
  describe("indexed property setter", () => {
    test("should mark the @Operation as the [IndexedPropertySetter] of the interface", () => {
      @Exposed("Window")
      @Interface
      @Constructor
      class Test {
        @Getter
        @Operation([UnsignedLong], UnsignedLong)
        item(i: number) {
          return i;
        }

        @Setter
        @Operation([UnsignedLong, UnsignedLong], Undefined)
        indexedPropertySetter(i: number, v: number): undefined {
          void i;
          void v;
        }

        @Attribute(UnsignedLong)
        get length() {
          return 0;
        }

        @SupportedPropertyIndices
        supportedPropertyIndices() {
          return new Set<number>();
        }
      }

      const instance = new Test();
      const operation =
        getInterface(Test).members[IndexedPropertySetterSymbol]!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const methodSteps = Test.prototype.indexedPropertySetter as any;

      expect(operation.kind).toBe("operation");
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
          "Failed to execute 'indexedPropertySetter' on 'Test': At least 2 arguments required, but only 1 passed",
        ),
      );
      expect(() => methodSteps.call(instance, 0, 0)).not.toThrow();
      expect(() => methodSteps.call(instance, 0, 0, 0)).not.toThrow();
    });

    test("should not register the behaviors to set the value of a new or existing indexed property for a named setter", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation([UnsignedLong], UnsignedLong)
        item(i: number) {
          return i;
        }

        @Setter
        @Operation([UnsignedLong, UnsignedLong], Undefined)
        indexedPropertySetter(k: number, v: number): undefined {
          void (k + v);
        }

        @Attribute(UnsignedLong)
        get length() {
          return 0;
        }

        @SupportedPropertyIndices
        supportedPropertyIndices() {
          return new Set<number>();
        }
      }

      const i = getInterface(Test);

      expect(i.members[IndexedPropertySetterSymbol]!.identifier).toBe(
        "indexedPropertySetter",
      );
      expect(i.members[NewIndexedPropertySetterSymbol]).toBeUndefined();
      expect(i.members[ExistingIndexedPropertySetterSymbol]).toBeUndefined();
    });

    test("should register the behaviors to set the value of a new and existing indexed property for an anonymous setter", () => {
      const anonymous = Symbol("anonymous");

      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation([UnsignedLong], UnsignedLong)
        item(i: number) {
          return i;
        }

        @Setter
        @Operation([UnsignedLong, UnsignedLong], Undefined)
        [anonymous](k: number, v: number): undefined {
          void (k + v);
        }

        @Attribute(UnsignedLong)
        get length() {
          return 0;
        }

        @SupportedPropertyIndices
        supportedPropertyIndices() {
          return new Set<number>();
        }
      }

      const i = getInterface(Test);

      expect(
        i.members[IndexedPropertySetterSymbol]!.identifier,
      ).toBeUndefined();
      expect(i.members[NewIndexedPropertySetterSymbol]).toBe(
        i.members[IndexedPropertySetterSymbol]!.methodSteps,
      );
      expect(i.members[ExistingIndexedPropertySetterSymbol]).toBe(
        i.members[IndexedPropertySetterSymbol]!.methodSteps,
      );
    });
  });

  describe("named property setter", () => {
    test("should mark the @Operation as the [NamedPropertySetter] of the interface", () => {
      @Exposed("Window")
      @Interface
      @Constructor
      class Test {
        @Getter
        @Operation([DOMString], DOMString)
        namedItem(name: string): string {
          return name;
        }

        @Setter
        @Operation([DOMString, DOMString], Undefined)
        namedPropertySetter(name: string, value: string): undefined {
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
          "Failed to execute 'namedPropertySetter' on 'Test': At least 2 arguments required, but only 1 passed",
        ),
      );
      expect(() => methodSteps.call(instance, "x", "y")).not.toThrow();
      expect(() => methodSteps.call(instance, "x", "y", "z")).not.toThrow();
    });

    test("should use the provided return type when supplied", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation([DOMString], DOMString)
        namedItem(name: string): string {
          return name;
        }

        @Setter
        @Operation([DOMString, DOMString], Boolean)
        namedPropertySetter(k: string, v: string): boolean {
          void (k + v);
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
        @Getter
        @Operation([DOMString], DOMString)
        namedItem(name: string): string {
          return name;
        }

        @Setter
        @Operation([DOMString, DOMString], Undefined)
        namedPropertySetter(k: string, v: string): undefined {
          void (k + v);
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const i = getInterface(Test);

      expect(i.members[NamedPropertySetterSymbol]!.identifier).toBe(
        "namedPropertySetter",
      );
      expect(i.members[NewNamedPropertySetterSymbol]).toBeUndefined();
      expect(i.members[ExistingNamedPropertySetterSymbol]).toBeUndefined();
    });

    test("should register the behaviors to set the value of a new and existing named property for an anonymous setter", () => {
      const anonymous = Symbol("anonymous");

      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation([DOMString], DOMString)
        namedItem(name: string): string {
          return name;
        }

        @Setter
        @Operation([DOMString, DOMString], Undefined)
        [anonymous](k: string, v: string): undefined {
          void (k + v);
        }

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
  });

  test("should reject a @Setter without a preceding @Operation", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Setter
        indexedPropertySetter(i: number, v: number) {
          void i;
          void v;
        }
      }
    }).toThrow();
  });
});
