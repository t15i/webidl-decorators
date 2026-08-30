import {
  Argument,
  Constructor,
  Deleter,
  Exposed,
  Getter,
  Interface,
  Operation,
  SupportedPropertyNames,
} from "lib";

import { Boolean, DOMString, Undefined } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@Deleter", () => {
  test("should mark the @Operation as the [NamedPropertyDeleter] of the interface", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Getter
      @Operation(DOMString, [Argument(DOMString, "name")])
      namedItem(name: string): string {
        return name;
      }

      @Deleter
      @Operation(Undefined, [Argument(DOMString, "name")])
      namedPropertyDeleter(name: string): undefined {
        void name;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const instance = new Test();
    const operation = getInterface(Test).namedPropertyDeleter!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const methodSteps = Test.prototype.namedPropertyDeleter as any;

    expect(operation.kind).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("deleter")).toBe(true);
    expect(operation.identifier).toBe("namedPropertyDeleter");
    expect(operation.returnType).toBe(Undefined);
    expect(operation.arguments).toEqual([
      { type: DOMString, identifier: "name", keywords: new Set() },
    ]);
    expect(typeof operation.methodSteps).toBe("function");
    expect(methodSteps.length).toBe(1);
    expect(methodSteps.name).toBe("namedPropertyDeleter");
    expect(() => methodSteps.call({}, "x")).toThrow(
      new TypeError("Illegal invocation"),
    );
    expect(() => methodSteps.call(instance)).toThrow(
      new TypeError("At least 1 argument required, but only 0 passed"),
    );
    expect(() => methodSteps.call(instance, "x")).not.toThrow();
    expect(() => methodSteps.call(instance, "x", "y")).not.toThrow();
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

      @Deleter
      @Operation(Boolean, [Argument(DOMString, "name")])
      namedPropertyDeleter(name: string): boolean {
        void name;
        return true;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const operation = getInterface(Test).namedPropertyDeleter!;

    expect(operation.returnType).toBe(Boolean);
  });

  test("should not register the behavior to delete an existing named property for a named deleter", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Getter
      @Operation(DOMString, [Argument(DOMString, "name")])
      namedItem(name: string): string {
        return name;
      }

      @Deleter
      @Operation(Undefined, [Argument(DOMString, "name")])
      namedPropertyDeleter(name: string): undefined {
        void name;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const i = getInterface(Test);

    expect(i.namedPropertyDeleter!.identifier).toBe("namedPropertyDeleter");
    expect(i.behaviors.existingNamedPropertyDeleter).toBeUndefined();
  });

  test("should register the behavior to delete an existing named property for an anonymous deleter", () => {
    const getter = Symbol("getter");
    const deleter = Symbol("deleter");

    @Exposed("Window")
    @Interface
    class Test {
      @Getter
      @Operation(DOMString, [Argument(DOMString, "name")])
      [getter](name: string): string {
        return name;
      }

      @Deleter
      @Operation(Undefined, [Argument(DOMString, "name")])
      [deleter](name: string): undefined {
        void name;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const i = getInterface(Test);

    expect(i.namedPropertyDeleter!.identifier).toBeUndefined();
    expect(i.behaviors.existingNamedPropertyDeleter).toBe(
      i.namedPropertyDeleter!.methodSteps,
    );
  });

  test("should report the deletion result through [[Delete]] when an anonymous deleter returns a boolean", () => {
    const getter = Symbol("getter");
    const deleter = Symbol("deleter");

    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @SupportedPropertyNames
      supportedPropertyNames(): Set<string> {
        return new Set(["removable", "sticky"]);
      }

      @Getter
      @Operation(DOMString, [Argument(DOMString, "name")])
      [getter](name: string): string {
        return name;
      }

      @Deleter
      @Operation(Boolean, [Argument(DOMString, "name")])
      [deleter](name: string): boolean {
        return name === "removable";
      }
    }

    const instance = new Test() as unknown as Record<string, unknown>;

    expect(delete instance["removable"]).toBe(true);
    expect(() => delete instance["sticky"]).toThrow(TypeError);
  });

  test("should leave an operation taking no arguments unmarked as a deleter", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Deleter
        @Operation(Undefined)
        removeItem(): undefined {
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

  test("should reject a @Deleter without a preceding @Operation", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Deleter
        namedPropertyDeleter(name: string) {
          void name;
        }

        @SupportedPropertyNames
        supportedPropertyNames() {
          return new Set<string>();
        }
      }
    }).toThrow();
  });
});
