# webidl-decorators - TypeScript decorators for WebIDL interfaces

A set of TypeScript decorators that let you declare
[WebIDL](https://webidl.spec.whatwg.org/) interfaces, attributes, operations,
constructors, and special operations directly on classes. WebIDL types
(`UnsignedLong`, `DOMString`, `Nullable`, …) come from
[`@t15i/webidl-types`](https://github.com/t15i/webidl-types), and the runtime
semantics - platform object behavior, indexed/named property access, setters,
deleters, and attribute reflection - are provided by
[`@t15i/webspecs`](https://github.com/t15i/webspecs).

> **Coverage is intentionally narrow** - this is a knowledge base, not a
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
  Argument,
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
  Argument,
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
  @Operation(Nullable(InterfaceType(Element)), [
    Argument(UnsignedLong, "index"),
  ])
  item(index: number): Element | null {
    // ...
  }

  @SupportedPropertyIndices
  supportedPropertyIndices(): Set<number> {
    // ...
  }
}
```

Every interface must declare where it is exposed - `@Exposed` is applied
_outside_ `@Interface` (so its identifier is finalized first) and installs the
interface object on the global (e.g. `window.HTMLCollection`). An interface that
is never marked as exposed is rejected when `@Interface` finalizes it.

An operation is declared with `@Operation(returnType, argumentList)`; the
argument list is optional and defaults to empty. Each argument is built with
`Argument(type, identifier)` - WebIDL declares an argument under an identifier,
which must be a valid WebIDL identifier and unique within the operation.
`Optional(argument)` declares an argument optional, widening its type to a union
with `undefined`, and `Optional(argument, defaultValue)` gives it a default
value instead, so the steps never see it missing:

```ts
@Operation(DOMString, [
  Argument(DOMString, "key"),
  Optional(Argument(DOMString, "fallback"), ""),
])
getItem(key: string, fallback: string): string {
  // ...
}
```

A constructor is declared by applying `@Constructor` (or
`@Constructor(argumentList)`) to the class alongside `@Interface`.

### Overloaded operations

WebIDL lets several operations share one identifier; JavaScript does not, so the
overloads are written as private methods whose names end in digits. The digits
are stripped, and every method left with the same name is registered as an
overload of it. HTML declares `remove` on `HTMLSelectElement` twice:

```webidl
[CEReactions] undefined remove(); // ChildNode overload
[CEReactions] undefined remove(long index);
```

which becomes:

```ts
@Exposed("Window")
@Interface
class HTMLSelectElement {
  declare remove: {
    (): undefined;
    (index: number): undefined;
  };

  @Operation(Undefined)
  #remove1(): undefined {
    // ...
  }

  @Operation(Undefined, [Argument(Long, "index")])
  #remove2(index: number): undefined {
    // ...
  }
}
```

`@Interface` defines a single `remove` method on the interface prototype object,
which picks the overload to run from the arguments passed. That choice never
depends on declaration order, so the digits only have to make the method names
distinct: numbering them out of order, or leaving gaps, resolves exactly the
same. WebIDL requires overloads taking the same number of arguments to be
distinguishable by some argument, and rejects an interface whose overloads are
not.

The digit suffix is what declares an overload. A private method whose name does
not end in digits declares an anonymous operation instead, which is what an
unnamed special operation relies on. So a public `remove` is overloaded by
`#remove1`, `#remove2` and so on, never by a private `#remove`.

The `declare` field is what gives the defined method a type: nothing is emitted
for it, and `@Interface` installs the real method under that name. Note that
ESLint's `no-unused-private-class-members` rule does not know the decorator
registers the method, so it reports every overload as unused.

Several declarations can also be stacked on one method, for when a single
implementation serves all of them. The same interface, written that way:

```ts
@Exposed("Window")
@Interface
class HTMLSelectElement {
  remove(): undefined;
  remove(index: number): undefined;

  @Operation(Undefined)
  @Operation(Undefined, [Argument(Long, "index")])
  remove(index?: number): undefined {
    // ...
  }
}
```

Ordinary TypeScript overload signatures type the method here, so no `declare`
field is needed: the decorators go on the implementation, and `@Interface`
replaces it with the method that dispatches to it.

The declaration a call matches decides the conversions its arguments and its
result go through, which is why every declaration has to agree on the native
return type. There is no separate implementation signature the way TypeScript
has one: the method is checked against each declaration on its own, so its
return type must satisfy every one of them. `@Operation(Boolean)` and
`@Operation(UnsignedLong)` cannot be stacked, since `boolean | number` is
assignable to neither, while `long` and `unsigned long` can, since both are
`number`.

Stacking is a convenience for the case that fits it, not the mechanism
overloading rests on. A private method per overload expresses any set of
declarations: each body gets exactly the types of its own declaration, and the
return types need have nothing in common.

A special operation is a regular `@Operation` additionally marked with `@Getter`,
`@Setter`, or `@Deleter`; whether it acts on indexed or named properties is
inferred from the first argument type - an `unsigned long` index makes it
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
import {
  Interface,
  Exposed,
  Attribute,
  Reflect,
} from "@t15i/webidl-decorators";
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
      - [x] `Argument`
      - [x] `Optional`
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
    - **§2.5.8 Overloading**
      - [x] private-method overloads
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

- **Production build** - the bundler replaces `process.env.NODE_ENV` with
  `"production"`, folds the branch to `if (false)`, eliminates it, and
  tree-shakes the entire validation subtree (including webspecs'
  `validateInterface`) out of the output. No configuration is required; a
  standard `vite build` (or webpack `mode: "production"`) does this by default.
- **Development** - the token resolves to `"development"`, so the checks run
  exactly as before.

## License

[MIT](./LICENSE)
