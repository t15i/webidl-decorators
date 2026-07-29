import type { InterfaceDecoratorContext } from "@/types";

export interface CustomElementPrototype {
  attributeChangedCallback?(
    this: HTMLElement,
    localName: string,
    oldValue: string | null,
    newValue: string | null,
    namespace: string | null,
  ): void;
}

export interface CustomElementConstructor {
  observedAttributes?: Iterable<string>;
  prototype: CustomElementPrototype;
  new (): HTMLElement;
}

export type CustomElementContext =
  InterfaceDecoratorContext<CustomElementConstructor>;
