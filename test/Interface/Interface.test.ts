import { ExistingIndexedPropertySetter, Interface, Internals } from "lib";

import {
  ExistingIndexedPropertySetter as ExistingIndexedPropertySetterSymbol,
  staticMembers,
} from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@Interface", () => {
  test("should expose [PrimaryInterface] on instances", () => {
    @Interface
    class Test {}

    expect(getInterface(new Test())).toBeDefined();
  });

  test("should preserve constructor behavior", () => {
    @Interface
    class Test {
      foo: number;
      constructor(foo: number) {
        this.foo = foo;
      }
    }

    const instance = new Test(42);

    expect(instance.foo).toBe(42);
    expect(instance).toBeInstanceOf(Test);
  });

  test("should share the same interface object across instances of the same class", () => {
    @Interface
    class Test {}

    const a = getInterface(new Test());
    const b = getInterface(new Test());

    expect(a).toBe(b);
  });

  test("should produce distinct interface objects for distinct classes", () => {
    @Interface
    class A {}

    @Interface
    class B {}

    expect(getInterface(new A())).not.toBe(getInterface(new B()));
  });

  test("should always create a [staticMembers] object on the interface", () => {
    @Interface
    class Test {}

    const i = getInterface(new Test());

    expect(typeof i[staticMembers]).toBe("object");
    expect(i[staticMembers]).not.toBeNull();
  });

  test("should inherit [staticMembers] from a parent metadata via the prototype chain", () => {
    @Interface
    class Base {}

    @Interface
    class Derived extends Base {}

    const baseStatic = getInterface(new Base())[staticMembers];
    const derivedStatic = getInterface(new Derived())[staticMembers];

    expect(derivedStatic).not.toBe(baseStatic);
    expect(Object.getPrototypeOf(derivedStatic)).toBe(baseStatic);
  });

  test("should inherit interface members from a parent metadata via the prototype chain", () => {
    @Interface
    class Base {
      @ExistingIndexedPropertySetter
      existingIndexedPropertySetter() {}
    }

    @Interface
    class Derived extends Base {
      @ExistingIndexedPropertySetter
      override existingIndexedPropertySetter() {}
    }

    const i = getInterface(new Derived());

    expect(i[ExistingIndexedPropertySetterSymbol]).toBe(
      Derived.prototype.existingIndexedPropertySetter,
    );
    expect(Object.getPrototypeOf(i)[ExistingIndexedPropertySetterSymbol]).toBe(
      Base.prototype.existingIndexedPropertySetter,
    );
  });

  test("should be a no-op when applied a second time to the same class", () => {
    expect(() => {
      @Interface
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class _ {}
    }).not.toThrow();
  });

  test("should preserve instanceof for both base and derived classes", () => {
    @Interface
    class Base {}

    @Interface
    class Derived extends Base {}

    const instance = new Derived();

    expect(instance).toBeInstanceOf(Derived);
    expect(instance).toBeInstanceOf(Base);
  });

  test("should expose the same [Internals] to base and derived methods on the same instance", () => {
    interface BaseState {
      base: unknown;
    }

    @Interface
    class Base {
      declare [Internals]: BaseState;

      constructor() {
        this[Internals] = { base: "B" };
      }
    }

    interface DerivedState extends BaseState {
      derived: unknown;
    }

    @Interface
    class Derived extends Base {
      declare [Internals]: DerivedState;

      constructor() {
        super();
        this[Internals]!.derived = "D";
      }
    }

    const instance = new Derived();

    expect(instance[Internals]!.base).toBe("B");
    expect(instance[Internals]!.derived).toBe("D");
  });

  test("should isolate [Internals] between instances of the same derived class", () => {
    interface BaseState {
      marker?: unknown;
    }

    @Interface
    class Base {
      declare [Internals]: BaseState;

      constructor() {
        this[Internals] = {};
      }
    }

    @Interface
    class Derived extends Base {}

    const a = new Derived();
    const b = new Derived();

    a[Internals]!.marker = "a";
    b[Internals]!.marker = "b";

    expect(a[Internals]).not.toBe(b[Internals]);
    expect(a[Internals]!.marker).toBe("a");
    expect(b[Internals]!.marker).toBe("b");
  });
});
