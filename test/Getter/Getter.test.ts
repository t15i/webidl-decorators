import {
  Argument,
  Attribute,
  Constructor,
  Exposed,
  Getter,
  Interface,
  Operation,
  SupportedPropertyIndices,
  SupportedPropertyNames,
} from "lib";

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
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
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
      const operation = getInterface(Test).indexedPropertyGetter!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const methodSteps = Test.prototype.item as any;

      expect(operation.kind).toBe("operation");
      expect(operation.keywords).toBeInstanceOf(Set);
      expect(operation.keywords.has("getter")).toBe(true);
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

    test("should also register the @Operation under its identifier as a regular member", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
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

      expect(i.members["item"]).toContain(i.indexedPropertyGetter);
    });

    test("should not register the behavior to determine the value of an indexed property for a named getter", () => {
      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
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

      expect(i.indexedPropertyGetter!.identifier).toBe("item");
      expect(i.behaviors.indexedPropertyDeterminator).toBeUndefined();
    });

    test("should also register the behavior to determine the value of an indexed property for an anonymous getter", () => {
      const anonymous = Symbol("anonymous");

      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
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

      expect(i.indexedPropertyGetter!.identifier).toBeUndefined();
      expect(i.behaviors.indexedPropertyDeterminator).toBe(
        i.indexedPropertyGetter!.methodSteps,
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
        @Operation(DOMString, [Argument(DOMString, "name")])
        namedItem(name: string) {
          return name;
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const instance = new Test();
      const operation = getInterface(Test).namedPropertyGetter!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const methodSteps = Test.prototype.namedItem as any;

      expect(operation.kind).toBe("operation");
      expect(operation.keywords).toBeInstanceOf(Set);
      expect(operation.keywords.has("getter")).toBe(true);
      expect(operation.identifier).toBe("namedItem");
      expect(operation.returnType).toBe(DOMString);
      expect(operation.arguments).toEqual([
        { type: DOMString, identifier: "name", keywords: new Set() },
      ]);
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
        @Operation(DOMString, [Argument(DOMString, "name")])
        namedItem(v: string) {
          return v;
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const i = getInterface(Test);

      expect(i.namedPropertyGetter!.identifier).toBe("namedItem");
      expect(i.behaviors.namedPropertyDeterminator).toBeUndefined();
    });

    test("should also register the behavior to determine the value of a named property for an anonymous getter", () => {
      const anonymous = Symbol("anonymous");

      @Exposed("Window")
      @Interface
      class Test {
        @Getter
        @Operation(DOMString, [Argument(DOMString, "name")])
        [anonymous](v: string) {
          return v;
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }

      const i = getInterface(Test);

      expect(i.namedPropertyGetter!.identifier).toBeUndefined();
      expect(i.behaviors.namedPropertyDeterminator).toBe(
        i.namedPropertyGetter!.methodSteps,
      );
    });
  });

  test("should carry an indexed property getter over to a derived interface", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Base {
      @Getter
      @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
      item(i: number) {
        return i;
      }

      @Attribute(UnsignedLong)
      get length() {
        return 1;
      }

      @SupportedPropertyIndices
      supportedPropertyIndices() {
        return new Set<number>([0]);
      }
    }

    @Exposed("Window")
    @Interface
    @Constructor
    class Derived extends Base {}

    const derived = getInterface(Derived);
    const instance = new Derived();

    expect(Object.hasOwn(derived, "indexedPropertyGetter")).toBe(false);
    expect(derived.indexedPropertyGetter).toBe(
      getInterface(Base).indexedPropertyGetter,
    );

    // A derived interface supports indexed properties too, so its instances are
    // legacy platform objects: reading index 0 goes through the inherited
    // getter rather than resolving as an ordinary property.
    expect((instance as unknown as Record<number, unknown>)[0]).toBe(0);
  });

  test("should leave an operation taking no arguments unmarked as a getter", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Getter
        @Operation(UnsignedLong)
        item() {
          return 0;
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

  test("should reject a @Getter without a preceding @Operation under a name Object.prototype carries", () => {
    // The member table is a plain object, so an identifier such as "toString"
    // resolves to the `Object.prototype` property of that name unless the lookup
    // asks for an own key - and a member that is not there at all must be
    // reported as missing, not as one of another kind.
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Getter
        toString() {
          return "x";
        }
      }
    }).toThrow(
      expect.objectContaining({
        cause: expect.objectContaining({
          message:
            "No WebIDL member is registered under the decorated identifier 'toString'",
        }),
      }),
    );
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

  test("should reject a @Getter without a preceding @Operation when an overload of the identifier is registered", () => {
    // The slot under "item" is open, but every overload in it was declared by
    // '#item1': the decorated method has no operation of its own to mark, and
    // marking the neighbour's would leave 'item' registered nowhere.
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
        // eslint-disable-next-line no-unused-private-class-members
        #item1(i: number) {
          return i;
        }

        @Getter
        item(i: number) {
          return i;
        }
      }
    }).toThrow(
      expect.objectContaining({
        cause: expect.objectContaining({
          message:
            "No WebIDL operation is registered for the decorated method; apply @Operation to it",
        }),
      }),
    );
  });

  test("should reject an anonymous @Getter without a preceding @Operation", () => {
    const anonymous = Symbol("anonymous");

    // An anonymous special operation has no identifier to name, so the failure
    // reports the kind alone.
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Getter
        [anonymous](index: number) {
          return index;
        }
      }
    }).toThrow("Cannot define getter");
  });
});
