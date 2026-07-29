import {
  deleteContentAttributeOfElementReflectedTarget,
  getAssociatedElement,
  getAssociatedElements,
  getContentAttributeOfElementReflectedTarget,
  getElementOfElementReflectedTarget,
  ReflectedNullableElement,
  ReflectedNullableFrozenArrayOfElements,
  setContentAttributeOfElementReflectedTarget,
  type ReflectedTargetAssociations,
} from "@t15i/webspecs/html";

/**
 * The base target associations backing element reflection: resolves the
 * reflecting element and reads, writes, and deletes its content attributes.
 * Extended by the nullable-`Element` and nullable-`FrozenArray<Element>`
 * variants that add attr-element tracking.
 */
export class ElementReflectedTargetAssociations implements ReflectedTargetAssociations {
  readonly #element: Element;

  constructor(element: Element) {
    this.#element = element;
  }

  getElement(): Element {
    return getElementOfElementReflectedTarget(this.#element);
  }

  getContentAttribute(name: string): string | null {
    return getContentAttributeOfElementReflectedTarget(this.#element, name);
  }

  setContentAttribute(name: string, value: string): void {
    setContentAttributeOfElementReflectedTarget(this.#element, name, value);
  }

  deleteContentAttribute(name: string): void {
    deleteContentAttributeOfElementReflectedTarget(this.#element, name);
  }
}

/**
 * The target associations backing nullable-`Element` reflection: the base
 * element associations plus the explicitly set attr-element the reflected
 * setter records and the reflected getter resolves.
 */
export class NullableElementReflectedTargetAssociations<E extends Element>
  extends ElementReflectedTargetAssociations
  implements ReflectedNullableElement.ReflectedTargetAssociations<E>
{
  explicitlySetElement: WeakRef<E> | null = null;

  getAssociatedElement(
    reflectedIDLAttribute: ReflectedNullableElement.ReflectedIDLAttribute<E>,
    reflectedContentAttributeName: string,
  ): E | null {
    const getAssociatedElementT = getAssociatedElement<E>;
    return getAssociatedElementT.call(
      this,
      reflectedIDLAttribute,
      reflectedContentAttributeName,
    );
  }
}

/**
 * The target associations backing nullable-`FrozenArray<Element>` reflection:
 * the base element associations plus the explicitly set attr-elements the
 * reflected setter records and the cached frozen array the reflected getter
 * resolves and memoizes.
 */
export class NullableFrozenArrayOfElementsReflectedTargetAssociations<
  E extends Element,
>
  extends ElementReflectedTargetAssociations
  implements
    ReflectedNullableFrozenArrayOfElements.ReflectedTargetAssociations<E>
{
  explicitlySetElements: WeakRef<E>[] | null = null;
  cachedAssociatedElements: readonly E[] | null = null;

  getAssociatedElements(
    reflectedIDLAttribute: ReflectedNullableFrozenArrayOfElements.ReflectedIDLAttribute<E>,
    reflectedContentAttributeName: string,
  ): E[] | null {
    const getAssociatedElementsT = getAssociatedElements<E>;
    return getAssociatedElementsT.call(
      this,
      reflectedIDLAttribute,
      reflectedContentAttributeName,
    );
  }
}
