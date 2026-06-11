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
      namedPropertyDeleter() {}
    }

    const operation = getInterface(new Test())[NamedPropertyDeleterSymbol]!;

    expect(operation.memberType).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("deleter")).toBe(true);
    expect(operation.identifier).toBe("namedPropertyDeleter");
    expect(operation.returnType).toBe(Undefined);
    expect(operation.arguments).toEqual([{ type: DOMString }]);
    expect(operation.methodSteps).toBe(Test.prototype.namedPropertyDeleter);
  });

  test("should use the provided Return type when supplied", () => {
    @Interface
    class Test {
      @NamedPropertyDeleter(Boolean)
      namedPropertyDeleter(): boolean {
        return true;
      }
    }

    const operation = getInterface(new Test())[NamedPropertyDeleterSymbol]!;

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

    const operation = getInterface(new Test())[NamedPropertyDeleterSymbol]!;

    expect(operation.identifier).toBeUndefined();
  });
});
