import { Interface, NamedPropertyGetter } from "lib";

import {
  DOMString,
  NamedPropertyDeterminator as NamedPropertyDeterminatorSymbol,
  NamedPropertyGetter as NamedPropertyGetterSymbol,
} from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@NamedPropertyGetter", () => {
  test("should define [NamedPropertyGetter] operation on the interface", () => {
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem(name: string) {
        return name;
      }
    }

    const instance = new Test();
    const operation =
      getInterface(instance).members[NamedPropertyGetterSymbol]!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const methodSteps = Test.prototype.namedItem as any;

    expect(operation.memberType).toBe("operation");
    expect(operation.keywords).toBeInstanceOf(Set);
    expect(operation.keywords.has("getter")).toBe(true);
    expect(operation.identifier).toBe("namedItem");
    expect(operation.returnType).toBe(DOMString);
    expect(operation.arguments).toEqual([{ type: DOMString }]);
    expect(operation.methodSteps).toBe(Test.prototype.namedItem);
    expect(methodSteps.length).toBe(1);
    expect(methodSteps.name).toBe("namedItem");
    expect(() => methodSteps.call({}, "x")).toThrow(
      new TypeError("Illegal invocation"),
    );
    expect(() => methodSteps.call(instance)).toThrow(
      new TypeError(
        "Failed to execute 'namedItem' on 'Test': 1 argument required, but only 0 present.",
      ),
    );
    expect(() => methodSteps.call(instance, "x")).not.toThrow();
    expect(() => methodSteps.call(instance, "x", "y")).not.toThrow();
  });

  test("should leave identifier undefined when name is a symbol", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      [anonymous]() {
        return "";
      }
    }

    const operation = getInterface(new Test()).members[
      NamedPropertyGetterSymbol
    ]!;

    expect(operation.identifier).toBeUndefined();
  });

  test("should not register the behavior to determine the value of a named property for a named getter", () => {
    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      namedItem() {
        return "";
      }
    }

    const i = getInterface(new Test());

    expect(i.members[NamedPropertyDeterminatorSymbol]).toBeUndefined();
  });

  test("should also register the behavior to determine the value of a named property for an anonymous getter", () => {
    const anonymous = Symbol("anonymous");

    @Interface
    class Test {
      @NamedPropertyGetter(DOMString)
      [anonymous]() {
        return "";
      }
    }

    const i = getInterface(new Test());

    expect(i.members[NamedPropertyGetterSymbol]!.identifier).toBeUndefined();
    expect(i.members[NamedPropertyDeterminatorSymbol]).toBe(
      Test.prototype[anonymous],
    );
  });
});
