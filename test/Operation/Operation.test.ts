import { Attribute, Constructor, Exposed, Interface, Operation } from "lib";

import { DOMString, Undefined, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface, getOperation } from "../utils";

describe("@Operation", () => {
  test("should register a named operation under its identifier on the interface", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Operation([UnsignedLong], UnsignedLong)
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

  test("should support multiple arguments", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Operation([DOMString, UnsignedLong], Undefined)
      set(key: string, value: number): undefined {
        void key;
        void value;
        return;
      }
    }

    const operation = getOperation(getInterface(Test), "set")!;

    expect(operation.arguments).toEqual([
      { type: DOMString },
      { type: UnsignedLong },
    ]);
    expect(operation.returnType).toBe(Undefined);
    expect((Test.prototype.set as (...a: unknown[]) => void).length).toBe(2);
  });

  test("should register a static operation under its identifier on the static members", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Operation([UnsignedLong], UnsignedLong)
      static create(i: number) {
        return i;
      }
    }

    const i = getInterface(Test);

    expect(i.staticMembers["create"]).toBeDefined();
    expect(i.staticMembers["create"]!.kind).toBe("operation");
    expect(i.members["create"]).toBeUndefined();
  });

  test("should not register an anonymous operation under a member identifier", () => {
    const anonymous = Symbol("anonymous");

    @Exposed("Window")
    @Interface
    class Test {
      @Operation([UnsignedLong], UnsignedLong)
      [anonymous](i: number) {
        return i;
      }
    }

    const i = getInterface(Test);

    expect(Object.getOwnPropertySymbols(i.members)).not.toContain(anonymous);
  });

  test("should reject a second operation defined under the same identifier", () => {
    // The second member reuses the identifier "item" via a widened (non-literal)
    // computed key, so the collision is a WebIDL one caught at run time rather
    // than a duplicate JS binding rejected by the compiler.
    const item: string = "item";

    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Operation([UnsignedLong], UnsignedLong)
        item(i: number) {
          return i;
        }

        @Operation([UnsignedLong], UnsignedLong)
        [item](i: number) {
          return i;
        }
      }
    }).toThrow();
  });

  test("should reject an operation defined under an identifier already used by another member kind", () => {
    const foo: string = "foo";

    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Attribute(UnsignedLong)
        get foo() {
          return 0;
        }

        @Operation([UnsignedLong], UnsignedLong)
        [foo](i: number) {
          return i;
        }
      }
    }).toThrow();
  });
});
