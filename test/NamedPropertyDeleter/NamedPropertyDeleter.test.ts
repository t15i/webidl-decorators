import {
  Exposed,
  Interface,
  NamedPropertyDeleter,
  NamedPropertyGetter,
  SupportedPropertyNames,
} from "lib";

import { NamedPropertyDeleter as NamedPropertyDeleterSymbol } from "@t15i/webspecs/webidl";
import { Boolean, DOMString, Undefined } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NamedPropertyDeleter", () => {
  test("should define [NamedPropertyDeleter] operation on the interface", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem(name: string): string | null {
        return name;
      }

      @NamedPropertyDeleter
      namedPropertyDeleter(name: string) {
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
        "Failed to execute 'namedPropertyDeleter' on 'Test': 1 argument required, but only 0 present.",
      ),
    );
    expect(() => methodSteps.call(instance, "x")).not.toThrow();
    expect(() => methodSteps.call(instance, "x", "y")).not.toThrow();
  });

  test("should use the provided Return type when supplied", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem(name: string): string | null {
        return name;
      }

      @NamedPropertyDeleter(Boolean)
      namedPropertyDeleter(): boolean {
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

  test("should leave identifier undefined when name is a symbol", () => {
    const anonymous = Symbol("anonymous");

    @Exposed("Window")
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem(name: string): string | null {
        return name;
      }

      @NamedPropertyDeleter
      [anonymous](): undefined {
        return;
      }

      @SupportedPropertyNames
      supportedPropertyNames() {
        return new Set<string>();
      }
    }

    const operation = getInterface(Test).members[NamedPropertyDeleterSymbol]!;

    expect(operation.identifier).toBeUndefined();
  });

  test("should report the deletion result through [[Delete]] when an anonymous deleter returns a boolean", () => {
    const getter = Symbol("getter");
    const deleter = Symbol("deleter");

    @Exposed("Window")
    @Interface
    class Test {
      @SupportedPropertyNames
      supportedPropertyNames(): Set<string> {
        return new Set(["removable", "sticky"]);
      }

      @NamedPropertyGetter(DOMString)
      [getter](name: string): string | null {
        return name;
      }

      @NamedPropertyDeleter(Boolean)
      [deleter](name: string): boolean {
        return name === "removable";
      }
    }

    const instance = new Test() as unknown as Record<string, unknown>;

    expect(delete instance["removable"]).toBe(true);
    expect(() => delete instance["sticky"]).toThrow(TypeError);
  });

  test("should reject a named property deleter without a named property getter", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @NamedPropertyDeleter
        namedPropertyDeleter(name: string) {
          void name;
        }
      }
    }).toThrow();
  });
});
