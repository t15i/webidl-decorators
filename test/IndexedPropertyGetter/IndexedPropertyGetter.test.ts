import {
  Attribute,
  Exposed,
  IndexedPropertyGetter,
  Interface,
  SupportedPropertyIndices,
} from "lib";

import {
  IndexedPropertyDeterminator as IndexedPropertyDeterminatorSymbol,
  IndexedPropertyGetter as IndexedPropertyGetterSymbol,
} from "@t15i/webspecs/webidl";
import { UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@IndexedPropertyGetter", () => {
  test("should define [IndexedPropertyGetter] operation on the interface", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @IndexedPropertyGetter(UnsignedLong)
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
    const operation = getInterface(Test).members[IndexedPropertyGetterSymbol]!;
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
        "Failed to execute 'item' on 'Test': 1 argument required, but only 0 present.",
      ),
    );
    expect(() => methodSteps.call(instance, 0)).not.toThrow();
    expect(() => methodSteps.call(instance, 0, 1)).not.toThrow();
  });

  test("should leave identifier undefined when name is a symbol", () => {
    const anonymous = Symbol("anonymous");

    @Exposed("Window")
    @Interface
    class Test {
      @IndexedPropertyGetter(UnsignedLong)
      [anonymous]() {
        return 0;
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

    const operation = getInterface(Test).members[IndexedPropertyGetterSymbol]!;

    expect(operation.identifier).toBeUndefined();
    expect(typeof operation.methodSteps).toBe("function");
  });

  test("should not register the behavior to determine the value of an indexed property for a named getter", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @IndexedPropertyGetter(UnsignedLong)
      item() {
        return 0;
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

    expect(i.members[IndexedPropertyDeterminatorSymbol]).toBeUndefined();
  });

  test("should also register the behavior to determine the value of an indexed property for an anonymous getter", () => {
    const anonymous = Symbol("anonymous");

    @Exposed("Window")
    @Interface
    class Test {
      @IndexedPropertyGetter(UnsignedLong)
      [anonymous]() {
        return 0;
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

    expect(i.members[IndexedPropertyGetterSymbol]!.identifier).toBeUndefined();
    expect(i.members[IndexedPropertyDeterminatorSymbol]).toBe(
      i.members[IndexedPropertyGetterSymbol]!.methodSteps,
    );
  });

  test("should reject an indexed property getter without a length attribute", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @IndexedPropertyGetter(UnsignedLong)
        item(i: number) {
          return i;
        }

        @SupportedPropertyIndices
        supportedPropertyIndices() {
          return new Set<number>();
        }
      }
    }).toThrow();
  });

  test("should reject an indexed property getter without supported property indices", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @IndexedPropertyGetter(UnsignedLong)
        item(i: number) {
          return i;
        }

        @Attribute(UnsignedLong)
        get length() {
          return 0;
        }
      }
    }).toThrow();
  });

  test("should reject a second indexed property getter on the same interface", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @IndexedPropertyGetter(UnsignedLong)
        first(i: number) {
          return i;
        }

        @IndexedPropertyGetter(UnsignedLong)
        second(i: number) {
          return i;
        }
      }
    }).toThrow("Cannot define special operation 'second'");
  });
});
