import { Attribute, Constructor, Exposed, Interface, Reflect } from "lib";

import { customElementReactions } from "lib/CustomElementReactions";

import { InterfaceType, Nullable } from "@t15i/webidl-types";

import { describe, expect, test, vi } from "vitest";

describe("the custom element reaction queue", () => {
  test("runs a reaction where it was offered when no operation is running", () => {
    const order: string[] = [];

    expect(customElementReactions.enqueue(() => order.push("reaction"))).toBe(
      false,
    );

    expect(order).toEqual([]);
  });

  test("holds a reaction back until the operation that queued it is done", () => {
    const order: string[] = [];

    const result = customElementReactions.run(() => {
      expect(customElementReactions.enqueue(() => order.push("reaction"))).toBe(
        true,
      );

      order.push("last step");

      return "returned";
    });

    expect(result).toBe("returned");
    expect(order).toEqual(["last step", "reaction"]);
  });

  test("holds it back until the outermost operation is done", () => {
    const order: string[] = [];

    customElementReactions.run(() => {
      customElementReactions.enqueue(() => order.push("outer reaction"));

      customElementReactions.run(() => {
        customElementReactions.enqueue(() => order.push("inner reaction"));
        order.push("inner steps");
      });

      order.push("after the inner operation");
    });

    expect(order).toEqual([
      "inner steps",
      "after the inner operation",
      "outer reaction",
      "inner reaction",
    ]);
  });

  test("invokes what is queued when the operation throws", () => {
    const order: string[] = [];

    expect(() =>
      customElementReactions.run(() => {
        customElementReactions.enqueue(() => order.push("reaction"));
        throw new TypeError("from the steps");
      }),
    ).toThrow(new TypeError("from the steps"));

    expect(order).toEqual(["reaction"]);
  });

  test("reports an exception from a reaction and runs the rest", () => {
    const order: string[] = [];
    const error = new TypeError("from a reaction");
    const reported = vi
      .spyOn(window, "reportError")
      .mockImplementation(() => {});

    try {
      customElementReactions.run(() => {
        customElementReactions.enqueue(() => {
          throw error;
        });
        customElementReactions.enqueue(() => order.push("the next one"));
      });

      expect(reported).toHaveBeenCalledWith(error);
      expect(order).toEqual(["the next one"]);
    } finally {
      reported.mockRestore();
    }
  });
});

describe("a reflected setter as a [CEReactions] operation", () => {
  interface Seen {
    attr: string | null;
    idl: string | null;
  }

  test("leaves the assignment finished for the reaction its write queues", () => {
    // The platform, doing the same thing: an attr-element IDL attribute whose
    // setter writes the content attribute first and records the element
    // second. Measured in both engines - the reaction runs once, after the
    // last step, and reads the element back.
    const native: Seen[] = [];

    class ReactionsNativeProbe extends HTMLElement {
      static observedAttributes: string[] = ["aria-activedescendant"];

      attributeChangedCallback(): void {
        native.push({
          attr: this.getAttribute("aria-activedescendant"),
          idl: this.ariaActiveDescendantElement?.localName ?? null,
        });
      }
    }

    customElements.define("reactions-native-probe", ReactionsNativeProbe);

    const ours: Seen[] = [];

    @Exposed("Window")
    @Interface("ReactionsReflectedElement")
    @Constructor
    class ReactionsReflectedElement extends HTMLElement {
      @Reflect("anchor")
      @Attribute(Nullable(InterfaceType(HTMLElement)))
      accessor anchorElement: HTMLElement | null = null;

      attributeChangedCallback(): void {
        ours.push({
          attr: this.getAttribute("anchor"),
          idl: this.anchorElement?.localName ?? null,
        });
      }
    }

    customElements.define(
      "reactions-reflected-element",
      ReactionsReflectedElement,
    );

    const nativeElement = document.createElement(
      "reactions-native-probe",
    ) as ReactionsNativeProbe;
    const element = document.createElement(
      "reactions-reflected-element",
    ) as ReactionsReflectedElement;
    const target = document.createElement("span");
    document.body.append(nativeElement, element, target);

    nativeElement.ariaActiveDescendantElement = target;
    element.anchorElement = target;

    expect(native).toEqual([{ attr: "", idl: "span" }]);
    expect(ours).toEqual(native);

    nativeElement.remove();
    element.remove();
    target.remove();
  });

  test("runs the reaction of a write of anyone else's where the DOM delivered it", () => {
    const seen: Seen[] = [];

    @Exposed("Window")
    @Interface("ReactionsExternalWrite")
    @Constructor
    class ReactionsExternalWrite extends HTMLElement {
      @Reflect("anchor")
      @Attribute(Nullable(InterfaceType(HTMLElement)))
      accessor anchorElement: HTMLElement | null = null;

      attributeChangedCallback(): void {
        seen.push({
          attr: this.getAttribute("anchor"),
          idl: this.anchorElement?.localName ?? null,
        });
      }
    }

    customElements.define("reactions-external-write", ReactionsExternalWrite);

    const element = document.createElement(
      "reactions-external-write",
    ) as ReactionsExternalWrite;
    const target = document.createElement("span");
    target.id = "reactions-external-target";
    document.body.append(element, target);

    // Nothing of ours is running, so the reaction is not held back: the write
    // is the whole of what happened, and the callback reads it done.
    element.setAttribute("anchor", "reactions-external-target");

    expect(seen).toEqual([{ attr: "reactions-external-target", idl: "span" }]);

    element.remove();
    target.remove();
  });

  test("keeps a throwing reaction out of the assignment that caused it", () => {
    const error = new TypeError("from the callback");
    const reported = vi
      .spyOn(window, "reportError")
      .mockImplementation(() => {});

    @Exposed("Window")
    @Interface("ReactionsThrowingCallback")
    @Constructor
    class ReactionsThrowingCallback extends HTMLElement {
      @Reflect("anchor")
      @Attribute(Nullable(InterfaceType(HTMLElement)))
      accessor anchorElement: HTMLElement | null = null;

      attributeChangedCallback(): void {
        throw error;
      }
    }

    customElements.define(
      "reactions-throwing-callback",
      ReactionsThrowingCallback,
    );

    const element = document.createElement(
      "reactions-throwing-callback",
    ) as ReactionsThrowingCallback;
    const target = document.createElement("span");
    document.body.append(element, target);

    try {
      // The platform reports what a reaction throws; the assignment that
      // queued it returns as if nothing had.
      expect(() => (element.anchorElement = target)).not.toThrow();
      expect(reported).toHaveBeenCalledWith(error);
    } finally {
      reported.mockRestore();
    }

    expect(element.anchorElement).toBe(target);

    element.remove();
    target.remove();
  });
});
