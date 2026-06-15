import {
  ExistingIndexedPropertySetter,
  ExistingNamedPropertyDeleter,
  ExistingNamedPropertySetter,
  IndexedPropertyDeterminator,
  IndexedPropertyGetter,
  IndexedPropertySetter,
  Interface,
  LegacyUnenumerableNamedProperties,
  NamedPropertyDeleter,
  NamedPropertyDeterminator,
  NamedPropertyGetter,
  NamedPropertySetter,
  NewIndexedPropertySetter,
  NewNamedPropertySetter,
  SupportedPropertyIndices,
  SupportedPropertyNames,
} from "lib";

import { DOMString, Undefined, UnsignedLong } from "@t15i/webspecs/webidl";

import { describe, expect, test } from "vitest";

const targetTests = [
  { details: "is undefined", target: undefined, gotType: "undefined" },
  { details: "is null", target: null, gotType: "object" },
  { details: "is number", target: 0, gotType: "number" },
  { details: "is string", target: "string", gotType: "string" },
  { details: "is symbol", target: Symbol(), gotType: "symbol" },
  { details: "is object", target: {}, gotType: "object" },
].map(({ details, target, gotType }) => ({
  details,
  target,
  error: TypeError(`Expected target to be 'function', got '${gotType}'`),
}));

const contextTests = [
  {
    details: "is undefined",
    context: undefined,
    error: TypeError(
      "Expected context to be non-null 'object', got 'undefined'",
    ),
  },
  {
    details: "is null",
    context: null,
    error: TypeError("Expected context to be non-null 'object', got 'null'"),
  },
  {
    details: "is number",
    context: 0,
    error: TypeError("Expected context to be non-null 'object', got 'number'"),
  },
  {
    details: "is string",
    context: "string",
    error: TypeError("Expected context to be non-null 'object', got 'string'"),
  },
  {
    details: "does not have metadata",
    context: {},
    error: TypeError("context.metadata is required, but does not exist"),
  },
  {
    details: "has metadata which is a number",
    context: { metadata: 0 },
    error: TypeError(
      "Expected context.metadata to be non-null 'object', got 'number'",
    ),
  },
  {
    details: "has metadata which is null",
    context: { metadata: null },
    error: TypeError(
      "Expected context.metadata to be non-null 'object', got 'null'",
    ),
  },
];

const operationContextTests = [
  ...contextTests,
  {
    details: "does not have name",
    context: { metadata: {} },
    error: TypeError("context.name is required, but does not exist"),
  },
  {
    details: "has name which is undefined",
    context: { metadata: {}, name: undefined },
    error: TypeError(
      "Expected context.name to be 'string' or 'symbol', got 'undefined'",
    ),
  },
  {
    details: "has name which is a number",
    context: { metadata: {}, name: 0 },
    error: TypeError(
      "Expected context.name to be 'string' or 'symbol', got 'number'",
    ),
  },
  {
    details: "has name which is null",
    context: { metadata: {}, name: null },
    error: TypeError(
      "Expected context.name to be 'string' or 'symbol', got 'object'",
    ),
  },
  {
    details: "does not have static",
    context: { metadata: {}, name: "foo" },
    error: TypeError("context.static is required, but does not exist"),
  },
  {
    details: "has static which is a string",
    context: { metadata: {}, name: "foo", static: "yes" },
    error: TypeError("Expected context.static to be 'boolean', got 'string'"),
  },
  {
    details: "does not have kind",
    context: { metadata: {}, name: "foo", static: false },
    error: TypeError("context.kind is required, but does not exist"),
  },
  {
    details: "has kind which is 'getter'",
    context: { metadata: {}, name: "foo", static: false, kind: "getter" },
    error: TypeError("Expected context.kind to be 'method', got 'getter'"),
  },
];

const specialOperationContextTests = [
  ...operationContextTests,
  {
    details: "has static which is true",
    context: { metadata: {}, name: "foo", static: true, kind: "method" },
    error: TypeError("Expected context.static to be 'false', got 'true'"),
  },
];

describe("typeguard tests", () => {
  describe("@Interface (toInterfaceDecoratorTarget, toDecoratorContext)", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fn = Interface("Test") as any;

    test.for(targetTests)(
      "should throw if target $details",
      ({ target, error }) => {
        expect(() => fn(target, { metadata: {} })).toThrow(error);
      },
    );

    test.for(contextTests)(
      "should throw if context $details",
      ({ context, error }) => {
        expect(() => fn(class {}, context)).toThrow(error);
      },
    );
  });

  describe("@LegacyUnenumerableNamedProperties (toDecoratorContext)", () => {
    test.for(contextTests)(
      "should throw if context $details",
      ({ context, error }) => {
        expect(() =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          LegacyUnenumerableNamedProperties(class {}, context as any),
        ).toThrow(error);
      },
    );
  });

  describe.for([
    {
      name: "ExistingIndexedPropertySetter",
      decorator: ExistingIndexedPropertySetter,
    },
    {
      name: "ExistingNamedPropertyDeleter",
      decorator: ExistingNamedPropertyDeleter,
    },
    {
      name: "ExistingNamedPropertySetter",
      decorator: ExistingNamedPropertySetter,
    },
    {
      name: "IndexedPropertyDeterminator",
      decorator: IndexedPropertyDeterminator,
    },
    {
      name: "NamedPropertyDeterminator",
      decorator: NamedPropertyDeterminator,
    },
    { name: "NewIndexedPropertySetter", decorator: NewIndexedPropertySetter },
    { name: "NewNamedPropertySetter", decorator: NewNamedPropertySetter },
    { name: "SupportedPropertyIndices", decorator: SupportedPropertyIndices },
    { name: "SupportedPropertyNames", decorator: SupportedPropertyNames },
  ])(
    "@$name (toBehaviorDecoratorTarget, toDecoratorContext)",
    ({ decorator }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fn = decorator as any;

      test.for(targetTests)(
        "should throw if target $details",
        ({ target, error }) => {
          expect(() => fn(target, { metadata: {} })).toThrow(error);
        },
      );

      test.for(contextTests)(
        "should throw if context $details",
        ({ context, error }) => {
          expect(() => fn(() => {}, context)).toThrow(error);
        },
      );
    },
  );

  describe.for([
    {
      name: "IndexedPropertyGetter",
      decorator: IndexedPropertyGetter(UnsignedLong),
    },
    {
      name: "IndexedPropertySetter",
      decorator: IndexedPropertySetter(UnsignedLong),
    },
    {
      name: "NamedPropertyGetter",
      decorator: NamedPropertyGetter(DOMString),
    },
    {
      name: "NamedPropertySetter",
      decorator: NamedPropertySetter(DOMString),
    },
    {
      name: "NamedPropertyDeleter",
      decorator: NamedPropertyDeleter(Undefined),
    },
  ])(
    "@$name (toOperationDecoratorTarget, toSpecialOperationDecoratorContext)",
    ({ decorator }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fn = decorator as any;

      test.for(targetTests)(
        "should throw if target $details",
        ({ target, error }) => {
          expect(() =>
            fn(target, {
              metadata: {},
              name: "foo",
              static: false,
              kind: "method",
            }),
          ).toThrow(error);
        },
      );

      test.for(specialOperationContextTests)(
        "should throw if context $details",
        ({ context, error }) => {
          expect(() => fn(() => {}, context)).toThrow(error);
        },
      );
    },
  );
});
