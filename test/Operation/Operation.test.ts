// Overloads are declared as private methods, which nothing in the class body
// ever calls: the decorator registers them.
/* eslint-disable no-unused-private-class-members */

import {
  Argument,
  Attribute,
  Constructor,
  Exposed,
  Interface,
  Operation,
} from "lib";

import type { Operation as IDLOperation } from "@t15i/webspecs/webidl";
import { DOMString, Undefined, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface, getOperation } from "../utils";

describe("@Operation", () => {
  test("should register a named operation under its identifier on the interface", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
      item(i: number) {
        return i;
      }
    }

    const instance = new Test();
    const operation = getOperation(getInterface(Test), "item")!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const methodSteps = Test.prototype.item as any;

    expect(operation.kind).toBe("operation");
    expect(operation.identifier).toBe("item");
    expect(operation.returnType).toBe(UnsignedLong);
    expect(operation.arguments).toEqual([
      { type: UnsignedLong, identifier: "index", keywords: new Set() },
    ]);
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

  test("should default to an empty argument list when omitted", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Operation(UnsignedLong)
      count(): number {
        return 0;
      }
    }

    const operation = getOperation(getInterface(Test), "count")!;

    expect(operation.arguments).toEqual([]);
    expect(operation.returnType).toBe(UnsignedLong);
    expect((Test.prototype.count as (...a: unknown[]) => void).length).toBe(0);
  });

  test("should reject a method with arguments when the argument list is omitted", () => {
    @Exposed("Window")
    @Interface
    class Test {
      // @ts-expect-error omitting the argument list requires a no-argument method
      @Operation(UnsignedLong)
      count(extra: number): number {
        void extra;
        return 0;
      }
    }

    const operation = getOperation(getInterface(Test), "count")!;

    expect(operation.arguments).toEqual([]);
  });

  test("should support multiple arguments", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Operation(Undefined, [
        Argument(DOMString, "key"),
        Argument(UnsignedLong, "value"),
      ])
      set(key: string, value: number): undefined {
        void key;
        void value;
        return;
      }
    }

    const operation = getOperation(getInterface(Test), "set")!;

    expect(operation.arguments).toEqual([
      { type: DOMString, identifier: "key", keywords: new Set() },
      { type: UnsignedLong, identifier: "value", keywords: new Set() },
    ]);
    expect(operation.returnType).toBe(Undefined);
    expect((Test.prototype.set as (...a: unknown[]) => void).length).toBe(2);
  });

  test("should register a static operation under its identifier on the static members", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
      static create(i: number) {
        return i;
      }
    }

    const i = getInterface(Test);
    const overloads = i.staticMembers["create"];

    expect(overloads).toBeDefined();
    expect(overloads).toHaveLength(1);
    expect((overloads as IDLOperation[])[0]!.kind).toBe("operation");
    expect(i.members["create"]).toBeUndefined();
  });

  test("should not register an anonymous operation under a member identifier", () => {
    const anonymous = Symbol("anonymous");

    @Exposed("Window")
    @Interface
    class Test {
      @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
      [anonymous](i: number) {
        return i;
      }
    }

    const i = getInterface(Test);

    expect(Object.getOwnPropertySymbols(i.members)).not.toContain(anonymous);
  });

  test("should register an operation under an identifier Object.prototype also carries", () => {
    // The member table is a plain object, so `members["toString"]` resolves to
    // `Object.prototype.toString` unless the lookup asks for an own key. A
    // stringifier is a real WebIDL operation, so the identifier is not
    // hypothetical.
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Operation(DOMString)
      toString(): string {
        return "Test";
      }
    }

    const instance = new Test();
    const operation = getOperation(getInterface(Test), "toString")!;

    expect(operation.kind).toBe("operation");
    expect(operation.identifier).toBe("toString");
    expect(instance.toString()).toBe("Test");
  });

  test("should reject an operation whose identifier is already an attribute", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Attribute(UnsignedLong)
        get foo() {
          return 0;
        }

        // The overload declares the WebIDL identifier "foo", which the attribute
        // above already holds. The JS names differ, so nothing but WebIDL sees
        // the collision - two elements of the same JS name are rejected by the
        // decorator transform long before this library runs.
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
        #foo1(i: number) {
          return i;
        }
      }
    }).toThrow(
      "attribute member 'foo' is already defined, but a WebIDL operation was expected",
    );
  });

  test("should reject an attribute whose identifier is already an operation", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
        #bar1(i: number) {
          return i;
        }

        @Attribute(UnsignedLong)
        get bar() {
          return 0;
        }
      }
    }).toThrow(
      expect.objectContaining({
        cause: expect.objectContaining({
          message: expect.stringContaining(
            "operation member 'bar' is already defined, but a WebIDL attribute was expected",
          ),
        }),
      }),
    );
  });
});
