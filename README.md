# webidl-decorators — TypeScript decorators for WebIDL interfaces

A set of TypeScript decorators that let you declare
[WebIDL](https://webidl.spec.whatwg.org/) interfaces, attributes, operations,
constructors, and special operations directly on classes. WebIDL types
(`UnsignedLong`, `DOMString`, `Nullable`, …) come from
[`@t15i/webidl-types`](https://github.com/t15i/webidl-types), and the runtime
semantics — platform object behavior, indexed/named property access, setters,
deleters, and attribute reflection — are provided by
[`@t15i/webspecs`](https://github.com/t15i/webspecs).

> **Coverage is intentionally narrow** — this is a knowledge base, not a
> polyfill. Only the decorators that have been ported so far are listed below;
> everything else is marked with `...`.

## Install

```sh
npm install @t15i/webidl-decorators @t15i/webidl-types @t15i/webspecs
```

`@t15i/webidl-types` and `@t15i/webspecs` are peer dependencies: the first
supplies the WebIDL type values you pass to the decorators, the second provides
the runtime that makes decorated classes behave as platform objects.

## Usage

All decorators are exposed from a single entry point:

```ts
import {
  Interface,
  Exposed,
  Attribute,
  Operation,
  Getter,
  SupportedPropertyIndices,
  // ...
} from "@t15i/webidl-decorators";
```

Decorate a class with `@Interface`, mark where it is exposed with `@Exposed`,
and annotate its members with the appropriate decorators. Type values used by
the decorators are imported from `@t15i/webidl-types`. Once instantiated, the
class behaves as a WebIDL platform object:

```ts
import {
  Interface,
  Exposed,
  Attribute,
  Operation,
  Getter,
  SupportedPropertyIndices,
} from "@t15i/webidl-decorators";
import { UnsignedLong, Nullable, InterfaceType } from "@t15i/webidl-types";

@Exposed("Window")
@Interface
class HTMLCollection {
  @Attribute(UnsignedLong)
  get length(): number {
    // ...
  }

  @Getter
  @Operation(Nullable(InterfaceType(Element)), [UnsignedLong])
  item(index: number): Element | null {
    // ...
  }

  @SupportedPropertyIndices
  supportedPropertyIndices(): Set<number> {
    // ...
  }
}
```

Every interface must declare where it is exposed — `@Exposed` is applied
_outside_ `@Interface` (so its identifier is finalized first) and installs the
interface object on the global (e.g. `window.HTMLCollection`). An interface that
is never marked as exposed is rejected when `@Interface` finalizes it.

An operation is declared with `@Operation(returnType, [argTypes])`; the argument
list is optional and defaults to empty. A constructor is declared by applying
`@Constructor` (or `@Constructor([argTypes])`) to the class alongside
`@Interface`.

A special operation is a regular `@Operation` additionally marked with `@Getter`,
`@Setter`, or `@Deleter`; whether it acts on indexed or named properties is
inferred from the first argument type — an `unsigned long` index makes it
indexed, a `DOMString` name makes it named. The behavior decorators
(`@SupportedPropertyIndices`, `@NewNamedPropertySetter`, …) fill in the
supporting steps that a bare getter/setter/deleter cannot.

> The decorator proposal used is the
> [TC39 stage-3 / 2023-11](https://github.com/tc39/proposal-decorators)
> variant. Make sure your toolchain supports it.

### Reflected attributes

An IDL attribute of an element interface can reflect a content attribute. Stack
a reflect decorator on top of `@Attribute`, applied to an `accessor` member of a
class that extends `HTMLElement`:

```ts
import { Interface, Exposed, Attribute, Reflect } from "@t15i/webidl-decorators";
import { DOMString } from "@t15i/webidl-types";

@Exposed("Window")
@Interface
class HTMLInputElement extends HTMLElement {
  @Reflect
  @Attribute(DOMString)
  accessor name: string = "";
}
```

Reading `name` returns the parsed `name` content attribute; assigning to it
writes the attribute back. The content attribute name defaults to a lower-cased
copy of the IDL identifier and can be overridden by calling the decorator as a
factory (`@Reflect("data-name")`). `@ReflectNonNegative`, `@ReflectPositive`,
`@ReflectPositiveWithFallback`, and `@ReflectURL` reflect with the corresponding
limits; `@ReflectDefault` and `@ReflectRange` supplement a reflect trigger with
a default value or a clamped range; `@ReflectSetter` reflects on assignment
only, keeping the separately declared getter.

### Private state on legacy platform objects

A legacy platform object (a class with indexed or named property behaviors) is
wrapped in a proxy, so its `#private` fields are not reachable through method
calls on instances. Use the provided `this[Internals]` object to store
instance-private state instead:

```ts
import { Interface, Exposed, Internals } from "@t15i/webidl-decorators";

interface State {
  items: Element[];
}

@Exposed("Window")
@Interface
class HTMLCollection {
  declare [Internals]: State;

  constructor() {
    this[Internals] = { items: [] };
  }
}
```

A regular platform object (no indexed/named property behaviors) is not proxied
and can use `#private` fields as usual.

## What's implemented

Expand a section to see what is currently ported. `...` marks sections with
un-ported content.

<details>
<summary><strong>WebIDL</strong> (<a href="https://webidl.spec.whatwg.org/">spec</a>)</summary>

- **§2 Interface definition language**
  - **§2.2 Interfaces**
    - [x] `@Interface`
  - **§2.5 Interface members**
    - **§2.5.2 Attributes**
      - [x] `@Attribute`
    - **§2.5.3 Operations**
      - [x] `@Operation`
    - **§2.5.4 Constructor operations**
      - [x] `@Constructor`
    - **§2.5.6 Special operations**
      - [x] `@Getter`
      - [x] `@Setter`
      - [x] `@Deleter`
      - **§2.5.6.1 Indexed properties**
        - [x] `@SupportedPropertyIndices`
        - [x] `@IndexedPropertyDeterminator`
        - [x] `@NewIndexedPropertySetter`
        - [x] `@ExistingIndexedPropertySetter`
      - **§2.5.6.2 Named properties**
        - [x] `@SupportedPropertyNames`
        - [x] `@NamedPropertyDeterminator`
        - [x] `@NewNamedPropertySetter`
        - [x] `@ExistingNamedPropertySetter`
        - [x] `@ExistingNamedPropertyDeleter`
    - ...
  - ...
- **§3 JavaScript binding**
  - **§3.3 Extended attributes**
    - **§3.3.7 [Exposed]**
      - [x] `@Exposed`
    - ...
  - **§3.4 Legacy extended attributes**
    - **§3.4.9 [LegacyUnenumerableNamedProperties]**
      - [x] `@LegacyUnenumerableNamedProperties`
    - ...
  - ...
- ...

</details>

<details>
<summary><strong>HTML</strong> (<a href="https://html.spec.whatwg.org/multipage/common-dom-interfaces.html">spec</a>)</summary>

- **§2.6 Common DOM interfaces**
  - **§2.6.1 Reflecting content attributes in IDL attributes**
    - [x] `@Reflect`
    - [x] `@ReflectSetter`
    - [x] `@ReflectDefault`
    - [x] `@ReflectRange`
    - [x] `@ReflectNonNegative`
    - [x] `@ReflectPositive`
    - [x] `@ReflectPositiveWithFallback`
    - [x] `@ReflectURL`
  - ...
- ...

</details>

## Validation and tree-shaking

When a class is decorated with `@Interface`, the accumulated interface draft is
checked for correctness (`assertInterface` plus webspecs' `validateInterface`)
inside the class's initializer. These checks are valuable while authoring an
interface, but they are expensive and pointless in a shipped production build,
where the interface definitions are already known to be correct.

The checks are therefore guarded by `process.env.NODE_ENV`:

```ts
if (process.env.NODE_ENV !== "production") {
  assertInterface(iface);
  validateInterface(iface);
}
```

This package is published unminified with `"sideEffects": false`, so a
consumer's bundler can act on the guard:

- **Production build** — the bundler replaces `process.env.NODE_ENV` with
  `"production"`, folds the branch to `if (false)`, eliminates it, and
  tree-shakes the entire validation subtree (including webspecs'
  `validateInterface`) out of the output. No configuration is required; a
  standard `vite build` (or webpack `mode: "production"`) does this by default.
- **Development** — the token resolves to `"development"`, so the checks run
  exactly as before.

## License

[MIT](./LICENSE)
