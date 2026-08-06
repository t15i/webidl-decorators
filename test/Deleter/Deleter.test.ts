import {
  Constructor,
  Deleter,
  Exposed,
  Getter,
  Interface,
  Operation,
  SupportedPropertyNames,
} from "lib";

import {
  ExistingNamedPropertyDeleter as ExistingNamedPropertyDeleterSymbol,
  NamedPropertyDeleter as NamedPropertyDeleterSymbol,
} from "@t15i/webspecs/webidl";
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
      @Operation([DOMString], DOMString)
      namedItem(name: string): string {
        return name;
      }

      @Deleter
      @Operation([DOMString], Undefined)
      namedPropertyDeleter(name: string): undefined {
        void name;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const instance = new Test();
    const operation = getInterface(Test).members[NamedPropertyDeleterSymbol]!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const methodSteps = Test.prototype.namedPropertyDeleter as any;

    expect(operation.kind).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("deleter")).toBe(true);
    expect(operation.identifier).toBe("namedPropertyDeleter");
    expect(operation.returnType).toBe(Undefined);
    expect(operation.arguments).toEqual([{ type: DOMString }]);
    expect(typeof operation.methodSteps).toBe("function");
    expect(methodSteps.length).toBe(1);
    expect(methodSteps.name).toBe("namedPropertyDeleter");
    expect(() => methodSteps.call({}, "x")).toThrow(
      new TypeError("Illegal invocation"),
    );
    expect(() => methodSteps.call(instance)).toThrow(
      new TypeError(
        "Failed to execute 'namedPropertyDeleter' on 'Test': At least 1 argument required, but only 0 passed",
      ),
    );
    expect(() => methodSteps.call(instance, "x")).not.toThrow();
    expect(() => methodSteps.call(instance, "x", "y")).not.toThrow();
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

      @Deleter
      @Operation([DOMString], Boolean)
      namedPropertyDeleter(name: string): boolean {
        void name;
        return true;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const operation = getInterface(Test).members[NamedPropertyDeleterSymbol]!;

    expect(operation.returnType).toBe(Boolean);
  });

  test("should not register the behavior to delete an existing named property for a named deleter", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Getter
      @Operation([DOMString], DOMString)
      namedItem(name: string): string {
        return name;
      }

      @Deleter
      @Operation([DOMString], Undefined)
      namedPropertyDeleter(name: string): undefined {
        void name;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const i = getInterface(Test);

    expect(i.members[NamedPropertyDeleterSymbol]!.identifier).toBe(
      "namedPropertyDeleter",
    );
    expect(i.members[ExistingNamedPropertyDeleterSymbol]).toBeUndefined();
  });

  test("should register the behavior to delete an existing named property for an anonymous deleter", () => {
    const getter = Symbol("getter");
    const deleter = Symbol("deleter");

    @Exposed("Window")
    @Interface
    class Test {
      @Getter
      @Operation([DOMString], DOMString)
      [getter](name: string): string {
        return name;
      }

      @Deleter
      @Operation([DOMString], Undefined)
      [deleter](name: string): undefined {
        void name;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const i = getInterface(Test);

    expect(i.members[NamedPropertyDeleterSymbol]!.identifier).toBeUndefined();
    expect(i.members[ExistingNamedPropertyDeleterSymbol]).toBe(
      i.members[NamedPropertyDeleterSymbol]!.methodSteps,
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
      @Operation([DOMString], DOMString)
      [getter](name: string): string {
        return name;
      }

      @Deleter
      @Operation([DOMString], Boolean)
      [deleter](name: string): boolean {
        return name === "removable";
      }
    }

    const instance = new Test() as unknown as Record<string, unknown>;

    expect(delete instance["removable"]).toBe(true);
    expect(() => delete instance["sticky"]).toThrow(TypeError);
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
