import {
  Constructor,
  ExistingIndexedPropertySetter,
  Exposed,
  Interface,
  Internals,
} from "lib";

import { ExistingIndexedPropertySetter as ExistingIndexedPropertySetterSymbol } from "@t15i/webspecs/webidl";
import { Long } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface } from "../utils";

describe("@Interface", () => {
  test("should associate a primary interface with instances", () => {
    @Exposed("Window")
    @Interface
    class Test {}

    expect(getInterface(Test)).toBeDefined();
  });

  test("should reject an interface that is not exposed", () => {
    expect(() => {
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {}
    }).toThrow();
  });

  test("should preserve constructor behavior", () => {
    @Exposed("Window")
    @Interface
    @Constructor([Long])
    class Test {
      foo: number;
      constructor(foo: number) {
        this.foo = foo;
      }
    }

    const instance = new Test(42);

    expect(instance.foo).toBe(42);
    expect(instance).toBeInstanceOf(Test);
    expect(Test.name).toBe("Test");
    expect(Test.length).toBe(1);
  });

  test("should share the same interface object across instances of the same class", () => {
    @Exposed("Window")
    @Interface
    class Test {}

    const a = getInterface(Test);
    const b = getInterface(Test);

    expect(a).toBe(b);
  });

  test("should produce distinct interface objects for distinct classes", () => {
    @Exposed("Window")
    @Interface
    class A {}

    @Exposed("Window")
    @Interface
    class B {}

    expect(getInterface(A)).not.toBe(getInterface(B));
  });

  test("should use the class name as the WebIDL identifier", () => {
    @Exposed("Window")
    @Interface
    class HTMLCollection {}

    expect(getInterface(HTMLCollection).identifier).toBe("HTMLCollection");
  });

  test("should use the supplied identifier when applied as a factory", () => {
    @Exposed("Window")
    @Interface("HTMLCollection")
    class HTMLCollectionImpl {}

    expect(getInterface(HTMLCollectionImpl).identifier).toBe("HTMLCollection");
  });

  test("should throw when @Interface is applied on top of another @Interface", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      @Interface("First")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Second {}
    }).toThrow();
  });

  test("should always create a staticMembers object on the interface", () => {
    @Exposed("Window")
    @Interface
    class Test {}

    const i = getInterface(Test);

    expect(typeof i.staticMembers).toBe("object");
    expect(i.staticMembers).not.toBeNull();
  });

  test("should always create a members object on the interface", () => {
    @Exposed("Window")
    @Interface
    class Test {}

    const i = getInterface(Test);

    expect(typeof i.members).toBe("object");
    expect(i.members).not.toBeNull();
  });

  test("should inherit staticMembers from a parent metadata via the prototype chain", () => {
    @Exposed("Window")
    @Interface
    class Base {}

    @Exposed("Window")
    @Interface
    class Derived extends Base {}

    const baseStatic = getInterface(Base).staticMembers;
    const derivedStatic = getInterface(Derived).staticMembers;

    expect(derivedStatic).not.toBe(baseStatic);
    expect(Object.getPrototypeOf(derivedStatic)).toBe(baseStatic);
  });

  test("should inherit members from a parent metadata via the prototype chain", () => {
    @Exposed("Window")
    @Interface
    class Base {}

    @Exposed("Window")
    @Interface
    class Derived extends Base {}

    const baseMembers = getInterface(Base).members;
    const derivedMembers = getInterface(Derived).members;

    expect(derivedMembers).not.toBe(baseMembers);
    expect(Object.getPrototypeOf(derivedMembers)).toBe(baseMembers);
  });

  test("should inherit interface members from a parent metadata via the prototype chain", () => {
    @Exposed("Window")
    @Interface
    class Base {
      @ExistingIndexedPropertySetter
      existingIndexedPropertySetter() {}
    }

    @Exposed("Window")
    @Interface
    class Derived extends Base {
      @ExistingIndexedPropertySetter
      override existingIndexedPropertySetter() {}
    }

    const i = getInterface(Derived);

    expect(i.members[ExistingIndexedPropertySetterSymbol]).toBe(
      Derived.prototype.existingIndexedPropertySetter,
    );
    expect(
      Object.getPrototypeOf(i.members)[ExistingIndexedPropertySetterSymbol],
    ).toBe(Base.prototype.existingIndexedPropertySetter);
  });

  test("should throw when @Interface is applied a second time to the same class", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {}
    }).toThrow();
  });

  test("should not treat a derived class's inherited interface as its own definition", () => {
    @Exposed("Window")
    @Interface
    class Base {}

    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Derived extends Base {}
    }).not.toThrow();
  });

  test("should throw when @Interface is applied a second time to a derived class", () => {
    @Exposed("Window")
    @Interface
    class Base {}

    expect(() => {
      @Exposed("Window")
      @Interface
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Derived extends Base {}
    }).toThrow();
  });

  test("should preserve instanceof for both base and derived classes", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Base {}

    @Exposed("Window")
    @Interface
    @Constructor
    class Derived extends Base {}

    const instance = new Derived();

    expect(instance).toBeInstanceOf(Derived);
    expect(instance).toBeInstanceOf(Base);
  });

  test("should expose the same [Internals] to base and derived methods on the same instance", () => {
    interface BaseState {
      base: unknown;
    }

    @Exposed("Window")
    @Interface
    @Constructor
    class Base {
      declare [Internals]: BaseState;

      constructor() {
        this[Internals] = { base: "B" };
      }
    }

    interface DerivedState extends BaseState {
      derived: unknown;
    }

    @Exposed("Window")
    @Interface
    @Constructor
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

    @Exposed("Window")
    @Interface
    @Constructor
    class Base {
      declare [Internals]: BaseState;

      constructor() {
        this[Internals] = {};
      }
    }

    @Exposed("Window")
    @Interface
    @Constructor
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
