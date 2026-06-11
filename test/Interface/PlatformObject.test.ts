import { IndexedPropertyGetter, Interface } from "lib";

import {
  LegacyPlatformObjectInternalMethods,
  UnsignedLong,
} from "@t15i/webspecs/webidl";

import { afterEach, describe, expect, test } from "vitest";

type Methods = typeof LegacyPlatformObjectInternalMethods;

function override<K extends keyof Methods>(
  key: K,
  impl: Methods[K],
): { restore: () => void; calls: Parameters<Methods[K]>[] } {
  const original = LegacyPlatformObjectInternalMethods[key];
  const calls: Parameters<Methods[K]>[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LegacyPlatformObjectInternalMethods[key] = ((...args: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calls.push(args as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (impl as any)(...args);
  }) as Methods[K];
  return {
    restore: () => {
      LegacyPlatformObjectInternalMethods[key] = original;
    },
    calls,
  };
}

describe("PlatformObject proxy", () => {
  describe("non-legacy platform object", () => {
    test("getOwnPropertyDescriptor should fall back to Reflect for non-[PrimaryInterface] keys", () => {
      @Interface
      class Test {
        foo: number = 42;
      }

      const instance = new Test();

      expect(Reflect.getOwnPropertyDescriptor(instance, "foo")?.value).toBe(42);
      expect(
        Reflect.getOwnPropertyDescriptor(instance, "missing"),
      ).toBeUndefined();
    });
  });

  describe("legacy platform object", () => {
    function defineLegacyClass() {
      @Interface
      class Test {
        @IndexedPropertyGetter(UnsignedLong)
        item(i: number): number {
          return i;
        }
      }
      return Test;
    }

    let restore: (() => void) | null = null;

    afterEach(() => {
      restore?.();
      restore = null;
    });

    test("getOwnPropertyDescriptor with string key should forward to [[GetOwnProperty]]", () => {
      const o = override("getOwnProperty", () => undefined);
      restore = o.restore;

      const Test = defineLegacyClass();
      const instance = new Test();

      Reflect.getOwnPropertyDescriptor(instance, "0");

      expect(o.calls.length).toBe(1);
      expect(o.calls[0]![1]).toBe("0");
    });

    test("getOwnPropertyDescriptor with symbol key should fall back to non-legacy handler", () => {
      const o = override("getOwnProperty", () => undefined);
      restore = o.restore;

      const Test = defineLegacyClass();
      const instance = new Test();

      expect(
        Reflect.getOwnPropertyDescriptor(instance, Symbol("missing")),
      ).toBeUndefined();
      expect(o.calls.length).toBe(0);
    });

    test("set with string key should forward to [[Set]]", () => {
      const o = override("set", () => true);
      restore = o.restore;

      const Test = defineLegacyClass();
      const instance = new Test();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any).foo = 1;

      expect(o.calls.length).toBe(1);
      expect(o.calls[0]![1]).toBe("foo");
      expect(o.calls[0]![2]).toBe(1);
    });

    test("set with symbol key should fall back to Reflect.set", () => {
      const o = override("set", () => true);
      restore = o.restore;

      const Test = defineLegacyClass();
      const instance = new Test();
      const key = Symbol("key");
      const receiver: Record<symbol, number> = {};

      Reflect.set(instance, key, 7, receiver);

      expect(o.calls.length).toBe(0);
      expect(receiver[key]).toBe(7);
    });

    test("defineProperty should forward to [[DefineOwnProperty]]", () => {
      const o = override("defineOwnProperty", () => true);
      restore = o.restore;

      const Test = defineLegacyClass();
      const instance = new Test();

      Reflect.defineProperty(instance, "foo", {
        value: 1,
        configurable: true,
        writable: true,
        enumerable: true,
      });

      expect(o.calls.length).toBe(1);
      expect(o.calls[0]![1]).toBe("foo");
    });

    test("deleteProperty with string key should forward to [[Delete]]", () => {
      const o = override("delete", () => true);
      restore = o.restore;

      const Test = defineLegacyClass();
      const instance = new Test();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (instance as any).foo;

      expect(o.calls.length).toBe(1);
      expect(o.calls[0]![1]).toBe("foo");
    });

    test("deleteProperty with symbol key should fall back to Reflect.deleteProperty", () => {
      const o = override("delete", () => true);
      restore = o.restore;

      const Test = defineLegacyClass();
      const instance = new Test();
      const key = Symbol("key");

      expect(Reflect.deleteProperty(instance, key)).toBe(true);
      expect(o.calls.length).toBe(0);
    });

    test("preventExtensions should forward to [[PreventExtensions]]", () => {
      const o = override("preventExtensions", () => false);
      restore = o.restore;

      const Test = defineLegacyClass();
      const instance = new Test();

      expect(Reflect.preventExtensions(instance)).toBe(false);
      expect(o.calls.length).toBe(1);
    });

    test("ownKeys should forward to [[OwnPropertyKeys]]", () => {
      const o = override("ownPropertyKeys", () => ["a", "b"]);
      restore = o.restore;

      const Test = defineLegacyClass();
      const instance = new Test();

      expect(Reflect.ownKeys(instance)).toEqual(["a", "b"]);
      expect(o.calls.length).toBe(1);
    });
  });
});
