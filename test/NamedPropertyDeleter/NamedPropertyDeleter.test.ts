import { Interface, NamedPropertyDeleter } from "lib";

import {
  Boolean,
  DOMString,
  NamedPropertyDeleter as NamedPropertyDeleterSymbol,
  Undefined,
} from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NamedPropertyDeleter", () => {
  test("should define [NamedPropertyDeleter] operation on the interface", () => {
    @Interface
    class Test {
      @NamedPropertyDeleter
      namedPropertyDeleter(name: string) {
        void name;
      }
    }

    const instance = new Test();
    const operation =
      getInterface(instance).members[NamedPropertyDeleterSymbol]!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const methodSteps = Test.prototype.namedPropertyDeleter as any;

    expect(operation.memberType).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("deleter")).toBe(true);
    expect(operation.identifier).toBe("namedPropertyDeleter");
    expect(operation.returnType).toBe(Undefined);
    expect(operation.arguments).toEqual([{ type: DOMString }]);
    expect(operation.methodSteps).toBe(Test.prototype.namedPropertyDeleter);
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
    @Interface
    class Test {
      @NamedPropertyDeleter(Boolean)
      namedPropertyDeleter(): boolean {
        return true;
      }
    }

    const operation = getInterface(new Test()).members[
      NamedPropertyDeleterSymbol
    ]!;

    expect(operation.returnType).toBe(Boolean);
  });

  test("should leave identifier undefined when name is a symbol", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @NamedPropertyDeleter
      [anonymous](): undefined {
        return;
      }
    }

    const operation = getInterface(new Test()).members[
      NamedPropertyDeleterSymbol
    ]!;

    expect(operation.identifier).toBeUndefined();
  });
});
