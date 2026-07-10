import type { SupportedPropertyIndices } from "@t15i/webspecs/webidl";

export class NaiveSupportedPropertyIndices implements SupportedPropertyIndices {
  #lpo: object;
  #getter: (this: object, index: number) => object | null;

  constructor(
    lpo: object,
    getter: (this: object, index: number) => object | null,
  ) {
    this.#lpo = lpo;
    this.#getter = getter;
  }

  *[Symbol.iterator](): ArrayIterator<number> {
    let i = -1;
    let item: object | null;

    while (true) {
      i += 1;
      item = this.#getter.call(this.#lpo, i);

      if (item !== null) {
        yield i;
      }
    }
  }

  has(index: number): boolean {
    for (const i of this) {
      if (i === index) {
        return true;
      }
    }

    return false;
  }
}
