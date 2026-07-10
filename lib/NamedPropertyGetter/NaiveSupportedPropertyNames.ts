import type { SupportedPropertyNames } from "@t15i/webspecs/webidl";

export class NaiveSupportedPropertyNames implements SupportedPropertyNames {
  [Symbol.iterator](): ArrayIterator<string> {
    return [][Symbol.iterator]();
  }

  has(): boolean {
    return false;
  }
}
