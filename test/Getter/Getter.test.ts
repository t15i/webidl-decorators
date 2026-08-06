import {
  Attribute,
  Constructor,
  Exposed,
  Getter,
  Interface,
  Operation,
  SupportedPropertyIndices,
  SupportedPropertyNames,
} from "lib";

import {
  IndexedPropertyDeterminator as IndexedPropertyDeterminatorSymbol,
  IndexedPropertyGetter as IndexedPropertyGetterSymbol,
  NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol,
  NamedPropertyGetter as NamedPropertyGetterSymbol,
} from "@t15i/webspecs/webidl";
import { DOMString, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@Getter", () => {
  describe("indexed property getter", () => {
    test("should mark the @Operation as the [IndexedPropertyGetter] of the interface", () => {
      @Exposed("Window")
      @Interface
      @Constructor
      class Test {
        @Getter
        @Operation([UnsignedLong], UnsignedLong)
        item(i: number) {
          return i;
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
        getInterface(Test).members[IndexedPropertyGetterSymbol]!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const methodSteps = Test.prototype.item as any;

      expect(operation.kind).toBe("operation");
      expect(operation.keywords).toBeInstanceOf(Set);
      expect(operation.keywords.has("getter")).toBe(true);
      expect(operation.identifier).toBe("item");
      expect(operation.returnType).toBe(UnsignedLong);
      expect(operation.arguments).toEqual([{ type: UnsignedLong }]);
      expect(typeof operation.methodSteps).toBe("function");
      expect(methodSteps.length).toBe(1);
      expect(methodSteps.name).toBe("item");
      expect(() => methodSteps.call({}, 0)).toThrow(
        new TypeError("Illegal invocation"),
      );
      expect(() => methodSteps.call(instance)).toThrow(
        new TypeError(
          "Failed to execute 'item' on 'Test': At least 1 argument required, but only 0 passed",
        ),
      );
      expect(() => methodSteps.call(instance, 0)).not.toThrow();
      expect(() => methodSteps.call(instance, 0, 1)).not.toThrow();
    });

    test("should also register the @Operation under its identifier as a regular member", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation([UnsignedLong], UnsignedLong)
        item(i: number) {
          return i;
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

      expect(i.members["item"]).toBe(i.members[IndexedPropertyGetterSymbol]);
    });

    test("should not register the behavior to determine the value of an indexed property for a named getter", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation([UnsignedLong], UnsignedLong)
        item(v: number) {
          return v;
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

      expect(i.members[IndexedPropertyGetterSymbol]!.identifier).toBe("item");
      expect(i.members[IndexedPropertyDeterminatorSymbol]).toBeUndefined();
    });

    test("should also register the behavior to determine the value of an indexed property for an anonymous getter", () => {
      const anonymous = Symbol("anonymous");

      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation([UnsignedLong], UnsignedLong)
        [anonymous](v: number) {
          return v;
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
        i.members[IndexedPropertyGetterSymbol]!.identifier,
      ).toBeUndefined();
      expect(i.members[IndexedPropertyDeterminatorSymbol]).toBe(
        i.members[IndexedPropertyGetterSymbol]!.methodSteps,
      );
    });
  });

  describe("named property getter", () => {
    test("should mark the @Operation as the [NamedPropertyGetter] of the interface", () => {
      @Exposed("Window")
      @Interface
      @Constructor
      class Test {
        @Getter
        @Operation([DOMString], DOMString)
        namedItem(name: string) {
          return name;
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const instance = new Test();
      const operation = getInterface(Test).members[NamedPropertyGetterSymbol]!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const methodSteps = Test.prototype.namedItem as any;

      expect(operation.kind).toBe("operation");
      expect(operation.keywords).toBeInstanceOf(Set);
      expect(operation.keywords.has("getter")).toBe(true);
      expect(operation.identifier).toBe("namedItem");
      expect(operation.returnType).toBe(DOMString);
      expect(operation.arguments).toEqual([{ type: DOMString }]);
      expect(typeof operation.methodSteps).toBe("function");
      expect(methodSteps.length).toBe(1);
      expect(methodSteps.name).toBe("namedItem");
      expect(() => methodSteps.call({}, "x")).toThrow(
        new TypeError("Illegal invocation"),
      );
      expect(() => methodSteps.call(instance)).toThrow(
        new TypeError(
          "Failed to execute 'namedItem' on 'Test': At least 1 argument required, but only 0 passed",
        ),
      );
      expect(() => methodSteps.call(instance, "x")).not.toThrow();
      expect(() => methodSteps.call(instance, "x", "y")).not.toThrow();
    });

    test("should not register the behavior to determine the value of a named property for a named getter", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation([DOMString], DOMString)
        namedItem(v: string) {
          return v;
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const i = getInterface(Test);

      expect(i.members[NamedPropertyGetterSymbol]!.identifier).toBe(
        "namedItem",
      );
      expect(i.members[NamedPropertyDeterminatorSymbol]).toBeUndefined();
    });

    test("should also register the behavior to determine the value of a named property for an anonymous getter", () => {
      const anonymous = Symbol("anonymous");

      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation([DOMString], DOMString)
        [anonymous](v: string) {
          return v;
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const i = getInterface(Test);

      expect(i.members[NamedPropertyGetterSymbol]!.identifier).toBeUndefined();
      expect(i.members[NamedPropertyDeterminatorSymbol]).toBe(
        i.members[NamedPropertyGetterSymbol]!.methodSteps,
      );
    });
  });

  test("should reject a @Getter without a preceding @Operation", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Getter
        item(i: number) {
          return i;
        }
      }
    }).toThrow();
  });
});
