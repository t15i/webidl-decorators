// The overloads of one operation are declared as private methods, which nothing
// in the class body ever calls: the decorator registers them, and the method the
// interface defines dispatches to whichever one a call matches.
/* eslint-disable no-unused-private-class-members */

import {
  Argument,
  Constructor,
  Exposed,
  Interface,
  Operation,
  Optional,
} from "lib";

import { DOMString, Long, Undefined, UnsignedLong } from "@t15i/webidl-types";

import { describe, expect, test } from "vitest";

import { getInterface, getOverloads } from "../utils";

describe("operation overloads", () => {
  test("should register the private methods named after one identifier as its overloads", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      declare format: {
        (value: number): string;
        (value: string): string;
      };

      @Operation(DOMString, [Argument(UnsignedLong, "value")])
      #format1(value: number): string {
        return `number:${value}`;
      }

      @Operation(DOMString, [Argument(DOMString, "value")])
      #format2(value: string): string {
        return `string:${value}`;
      }
    }

    const overloads = getOverloads(getInterface(Test), "format")!;

    expect(overloads).toHaveLength(2);
    expect(overloads.map((op) => op.identifier)).toEqual(["format", "format"]);
    expect(overloads.map((op) => op.arguments[0]!.type)).toEqual([
      UnsignedLong,
      DOMString,
    ]);
  });

  test("should define one method that dispatches on the types of the arguments passed", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      declare format: {
        (value: number): string;
        (value: string): string;
      };

      @Operation(DOMString, [Argument(UnsignedLong, "value")])
      #format1(value: number): string {
        return `number:${value}`;
      }

      @Operation(DOMString, [Argument(DOMString, "value")])
      #format2(value: string): string {
        return `string:${value}`;
      }
    }

    const instance = new Test();

    expect(instance.format(42)).toBe("number:42");
    expect(instance.format("x")).toBe("string:x");
  });

  test("should register two declarations on one method as its overloads", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      negate(value: number): number;
      negate(value: string): number;

      @Operation(UnsignedLong, [Argument(DOMString, "value")])
      @Operation(Long, [Argument(Long, "value")])
      negate(value: number | string): number {
        return typeof value === "number" ? -value : -value.length;
      }
    }

    const overloads = getOverloads(getInterface(Test), "negate")!;

    expect(overloads).toHaveLength(2);
    expect(overloads.map((op) => op.arguments[0]!.type)).toEqual([
      Long,
      DOMString,
    ]);

    // Both declarations describe the same method, so both run the same steps:
    // what differs is the conversions the call goes through.
    expect(overloads[0]!.methodSteps).toBe(overloads[1]!.methodSteps);
  });

  test("should convert a call through the declaration it matches", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      negate(value: number): number;
      negate(value: string): number;

      @Operation(UnsignedLong, [Argument(DOMString, "value")])
      @Operation(Long, [Argument(Long, "value")])
      negate(value: number | string): number {
        return typeof value === "number" ? -value : -value.length;
      }
    }

    const instance = new Test();

    // A number matches the "long" declaration, and -1 comes back through
    // "long". A string matches the "DOMString" one, and the same -2 comes back
    // through "unsigned long", which wraps it.
    expect(instance.negate(1)).toBe(-1);
    expect(instance.negate("ab")).toBe(4294967294);
  });

  test("should apply the optional argument of the declaration it matches", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      label(value: number): string;
      label(value: string, suffix?: string): string;

      @Operation(DOMString, [
        Argument(DOMString, "value"),
        Optional(Argument(DOMString, "suffix"), "!"),
      ])
      @Operation(DOMString, [Argument(UnsignedLong, "value")])
      label(value: number | string, suffix?: string): string {
        return typeof value === "number" ? `#${value}` : `${value}${suffix}`;
      }
    }

    const instance = new Test();

    expect(instance.label(7)).toBe("#7");
    expect(instance.label("a")).toBe("a!");
    expect(instance.label("a", "?")).toBe("a?");
  });

  test("should stack declarations of different arity on one method", () => {
    // `HTMLSelectElement.remove()` is declared this way in HTML: the inherited
    // `ChildNode` overload takes nothing, and the one of its own takes an index.
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      removed: (number | undefined)[] = [];

      remove(): undefined;
      remove(index: number): undefined;

      @Operation(Undefined)
      @Operation(Undefined, [Argument(Long, "index")])
      remove(index?: number): undefined {
        this.removed.push(index);
        return;
      }
    }

    const instance = new Test();

    instance.remove();
    instance.remove(2);

    expect(instance.removed).toEqual([undefined, 2]);
  });

  test("should resolve a call by argument type rather than by declaration order", () => {
    // The digits only have to make the method names distinct: WebIDL picks the
    // overload from the types of the arguments passed, so numbering them out of
    // order, or leaving gaps, resolves exactly the same.
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      declare pick: {
        (value: string): string;
        (value: number): string;
      };

      @Operation(DOMString, [Argument(DOMString, "value")])
      #pick7(value: string): string {
        void value;
        return "string";
      }

      @Operation(DOMString, [Argument(UnsignedLong, "value")])
      #pick2(value: number): string {
        void value;
        return "number";
      }
    }

    const instance = new Test();

    expect(instance.pick("x")).toBe("string");
    expect(instance.pick(1)).toBe("number");
  });

  test("should overload a public method with a private one declaring its identifier", () => {
    @Exposed("Window")
    @Interface
    @Constructor
    class Test {
      @Operation(DOMString, [Argument(UnsignedLong, "value")])
      describe(value: number): string {
        void value;
        return "number";
      }

      @Operation(DOMString, [Argument(DOMString, "value")])
      #describe2(value: string): string {
        void value;
        return "string";
      }
    }

    const instance = new Test();
    const describe = instance.describe as (value: unknown) => string;

    expect(getOverloads(getInterface(Test), "describe")).toHaveLength(2);
    expect(describe.call(instance, 1)).toBe("number");
    expect(describe.call(instance, "x")).toBe("string");
  });

  test("should overload a static operation the same way", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Operation(DOMString, [Argument(UnsignedLong, "value")])
      static #from1(value: number): string {
        void value;
        return "number";
      }

      @Operation(DOMString, [Argument(DOMString, "value")])
      static #from2(value: string): string {
        void value;
        return "string";
      }
    }

    const from = (Test as unknown as { from: (value: unknown) => string }).from;

    expect(getInterface(Test).staticMembers["from"]).toHaveLength(2);
    expect(from(1)).toBe("number");
    expect(from("x")).toBe("string");
  });

  test("should leave a private method whose name does not end in digits anonymous", () => {
    @Exposed("Window")
    @Interface
    class Test {
      @Operation(UnsignedLong, [Argument(UnsignedLong, "index")])
      #hidden(index: number): number {
        return index;
      }
    }

    const i = getInterface(Test);

    expect(Object.keys(i.members)).not.toContain("hidden");
    expect(Object.keys(i.members)).toHaveLength(0);
  });

  test("should give the defined method the length of its shortest overload", () => {
    @Exposed("Window")
    @Interface
    class Test {
      declare at: {
        (index: number): string;
        (index: number, fallback: string): string;
      };

      @Operation(DOMString, [Argument(UnsignedLong, "index")])
      #at1(index: number): string {
        return `${index}`;
      }

      @Operation(DOMString, [
        Argument(UnsignedLong, "index"),
        Argument(DOMString, "fallback"),
      ])
      #at2(index: number, fallback: string): string {
        void index;
        return fallback;
      }
    }

    expect((Test.prototype.at as unknown as { length: number }).length).toBe(1);
  });

  test("should reject overloads that no argument tells apart", () => {
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Operation(DOMString, [Argument(UnsignedLong, "value")])
        #same1(value: number): string {
          return `${value}`;
        }

        @Operation(DOMString, [Argument(UnsignedLong, "value")])
        #same2(value: number): string {
          return `${value}`;
        }
      }
    }).toThrow();
  });

  test("should accept overloads that return different types", () => {
    // Only the arguments tell overloads apart, so nothing requires the return
    // types to agree: each declaration converts the result its own way.
    expect(() => {
      @Exposed("Window")
      @Interface
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Operation(DOMString, [Argument(UnsignedLong, "value")])
        #mixed1(value: number): string {
          return `${value}`;
        }

        @Operation(Undefined, [Argument(DOMString, "value")])
        #mixed2(value: string): undefined {
          void value;
          return;
        }
      }
    }).not.toThrow();
  });
});
