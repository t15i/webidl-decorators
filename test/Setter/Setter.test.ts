import {
  Argument,
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
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
        item(i: number) {
          return i;
        }

        @Setter
        @Operation(Undefined, [
          Argument(UnsignedLong, "index"),
          Argument(UnsignedLong, "value"),
        ])
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
      const operation = getInterface(Test).indexedPropertySetter!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const methodSteps = Test.prototype.indexedPropertySetter as any;

      expect(operation.kind).toBe("operation");
      expect(operation.keywords).toBeInstanceOf(Set);
      expect(operation.keywords.has("setter")).toBe(true);
      expect(operation.identifier).toBe("indexedPropertySetter");
      expect(operation.returnType).toBe(Undefined);
      expect(operation.arguments[0]).toEqual({
        type: UnsignedLong,
        identifier: "index",
        keywords: new Set(),
      });
      expect(operation.arguments[1]).toEqual({
        type: UnsignedLong,
        identifier: "value",
        keywords: new Set(),
      });
      expect(typeof operation.methodSteps).toBe("function");
      expect(methodSteps.length).toBe(2);
      expect(methodSteps.name).toBe("indexedPropertySetter");
      expect(() => methodSteps.call({}, 0, 0)).toThrow(
        new TypeError("Illegal invocation"),
      );
      expect(() => methodSteps.call(instance, 0)).toThrow(
        new TypeError("At least 2 arguments required, but only 1 passed"),
      );
      expect(() => methodSteps.call(instance, 0, 0)).not.toThrow();
      expect(() => methodSteps.call(instance, 0, 0, 0)).not.toThrow();
    });

    test("should not register the behaviors to set the value of a new or existing indexed property for a named setter", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
        item(i: number) {
          return i;
        }

        @Setter
        @Operation(Undefined, [
          Argument(UnsignedLong, "index"),
          Argument(UnsignedLong, "value"),
        ])
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

      expect(i.indexedPropertySetter!.identifier).toBe("indexedPropertySetter");
      expect(i.behaviors.newIndexedPropertySetter).toBeUndefined();
      expect(i.behaviors.existingIndexedPropertySetter).toBeUndefined();
    });

    test("should register the behaviors to set the value of a new and existing indexed property for an anonymous setter", () => {
      const anonymous = Symbol("anonymous");

      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
        item(i: number) {
          return i;
        }

        @Setter
        @Operation(Undefined, [
          Argument(UnsignedLong, "index"),
          Argument(UnsignedLong, "value"),
        ])
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

      expect(i.indexedPropertySetter!.identifier).toBeUndefined();
      expect(i.behaviors.newIndexedPropertySetter).toBe(
        i.indexedPropertySetter!.methodSteps,
      );
      expect(i.behaviors.existingIndexedPropertySetter).toBe(
        i.indexedPropertySetter!.methodSteps,
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
        @Operation(DOMString, [Argument(DOMString, "name")])
        namedItem(name: string): string {
          return name;
        }

        @Setter
        @Operation(Undefined, [
          Argument(DOMString, "name"),
          Argument(DOMString, "value"),
        ])
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
      const operation = getInterface(Test).namedPropertySetter!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const methodSteps = Test.prototype.namedPropertySetter as any;

      expect(operation.kind).toBe("operation");
      expect(operation.keywords).toBeInstanceOf(Set);
      expect(operation.keywords.has("setter")).toBe(true);
      expect(operation.identifier).toBe("namedPropertySetter");
      expect(operation.returnType).toBe(Undefined);
      expect(operation.arguments[0]).toEqual({
        type: DOMString,
        identifier: "name",
        keywords: new Set(),
      });
      expect(operation.arguments[1]).toEqual({
        type: DOMString,
        identifier: "value",
        keywords: new Set(),
      });
      expect(typeof operation.methodSteps).toBe("function");
      expect(methodSteps.length).toBe(2);
      expect(methodSteps.name).toBe("namedPropertySetter");
      expect(() => methodSteps.call({}, "x", "y")).toThrow(
        new TypeError("Illegal invocation"),
      );
      expect(() => methodSteps.call(instance, "x")).toThrow(
        new TypeError("At least 2 arguments required, but only 1 passed"),
      );
      expect(() => methodSteps.call(instance, "x", "y")).not.toThrow();
      expect(() => methodSteps.call(instance, "x", "y", "z")).not.toThrow();
    });

    test("should use the provided return type when supplied", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation(DOMString, [Argument(DOMString, "name")])
        namedItem(name: string): string {
          return name;
        }

        @Setter
        @Operation(Boolean, [
          Argument(DOMString, "name"),
          Argument(DOMString, "value"),
        ])
        namedPropertySetter(k: string, v: string): boolean {
          void (k + v);
          return true;
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const operation = getInterface(Test).namedPropertySetter!;

      expect(operation.returnType).toBe(Boolean);
    });

    test("should not register the behaviors to set the value of a new or existing named property for a named setter", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation(DOMString, [Argument(DOMString, "name")])
        namedItem(name: string): string {
          return name;
        }

        @Setter
        @Operation(Undefined, [
          Argument(DOMString, "name"),
          Argument(DOMString, "value"),
        ])
        namedPropertySetter(k: string, v: string): undefined {
          void (k + v);
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const i = getInterface(Test);

      expect(i.namedPropertySetter!.identifier).toBe("namedPropertySetter");
      expect(i.behaviors.newNamedPropertySetter).toBeUndefined();
      expect(i.behaviors.existingNamedPropertySetter).toBeUndefined();
    });

    test("should register the behaviors to set the value of a new and existing named property for an anonymous setter", () => {
      const anonymous = Symbol("anonymous");

      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation(DOMString, [Argument(DOMString, "name")])
        namedItem(name: string): string {
          return name;
        }

        @Setter
        @Operation(Undefined, [
          Argument(DOMString, "name"),
          Argument(DOMString, "value"),
        ])
        [anonymous](k: string, v: string): undefined {
          void (k + v);
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const i = getInterface(Test);

      expect(i.namedPropertySetter!.identifier).toBeUndefined();
      expect(i.behaviors.newNamedPropertySetter).toBe(
        i.namedPropertySetter!.methodSteps,
      );
      expect(i.behaviors.existingNamedPropertySetter).toBe(
        i.namedPropertySetter!.methodSteps,
      );
    });
  });

  test("should leave an operation taking no arguments unmarked as a setter", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Setter
        @Operation(Undefined)
        setItem(): undefined {
          return;
        }
      }
    }).toThrow(
      expect.objectContaining({
        cause: expect.objectContaining({
          message:
            "This operation is declared as a special operation but, taking no arguments, matches no getter, setter, or deleter declaration.",
        }),
      }),
    );
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
