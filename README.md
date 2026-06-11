# webidl-decorators - TypeScript decorators for WebIDL interfaces

A set of TypeScript decorators that let you declare
[WebIDL](https://webidl.spec.whatwg.org/) interfaces, attributes, and special
operations directly on classes. The runtime semantics — platform object
behavior, indexed/named property access, setters, and deleters — are provided
by [`@t15i/webspecs`](https://github.com/t15i/webspecs).

> **Coverage is intentionally narrow** — this is a knowledge base, not a
> polyfill. Only the decorators that have been ported so far are listed below;
> everything else is marked with `...`.

## Install

```sh
npm install @t15i/webidl-decorators
```

## Usage

All decorators are exposed from a single entry point:

```ts
import {
  Interface,
  Attribute,
  IndexedPropertyGetter,
  NamedPropertyGetter,
  // ...
} from "@t15i/webidl-decorators";
```

Decorate a class with `@Interface` and any of its members with the appropriate
decorators. Once instantiated, the class behaves as a WebIDL platform object:

```ts
import { Interface, Attribute, IndexedPropertyGetter } from "@t15i/webidl-decorators";
import { Nullable, Type, UnsignedLong } from "@t15i/webspecs/webidl";

@Interface
class HTMLCollection {
  @Attribute(UnsignedLong)
  get length(): number {
    // ...
  }

  @IndexedPropertyGetter(Nullable(Type(Element)))
  item(index: number): Element | null {
    // ...
  }
}
```

> The decorator proposal used is the
> [TC39 stage-3 / 2023-11](https://github.com/tc39/proposal-decorators)
> variant. Make sure your toolchain supports it.

## What's implemented

Expand a section to see what is currently ported. `...` marks sections with
un-ported content.

<details>
<summary><strong>WebIDL</strong> (<a href="https://webidl.spec.whatwg.org/">spec</a>)</summary>

- **§2 Interface definition language**
  - **§2.2 Interfaces**
    - [x] `@Interface`
  - **§2.5 Members**
    - **§2.5.2 Attributes**
      - [x] `@Attribute`
    - **§2.5.6 Special operations**
      - **§2.5.6.1 Indexed properties**
        - [x] `@IndexedPropertyGetter`
        - [x] `@IndexedPropertySetter`
        - [x] `@IndexedPropertyDeterminator`
        - [x] `@NewIndexedPropertySetter`
        - [x] `@ExistingIndexedPropertySetter`
        - [x] `@SupportedPropertyIndices`
      - **§2.5.6.2 Named properties**
        - [x] `@NamedPropertyGetter`
        - [x] `@NamedPropertySetter`
        - [x] `@NamedPropertyDeleter`
        - [x] `@NamedPropertyDeterminator`
        - [x] `@NewNamedPropertySetter`
        - [x] `@ExistingNamedPropertySetter`
        - [x] `@ExistingNamedPropertyDeleter`
        - [x] `@SupportedPropertyNames`
      - ...
    - ...
  - ...
- **§3 ECMAScript binding**
  - **§3.4 Legacy extended attributes**
    - **§3.4.9 [LegacyUnenumerableNamedProperties]**
      - [x] `@LegacyUnenumerableNamedProperties`
    - ...
  - ...
- ...

</details>

## License

[MIT](./LICENSE)
