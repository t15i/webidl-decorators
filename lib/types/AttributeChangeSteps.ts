export type AttributeChangeSteps = (
  this: HTMLElement,
  localName: string,
  oldValue: string | null,
  newValue: string | null,
  namespace: string | null,
) => void;
