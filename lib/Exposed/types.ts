import type {
  InterfaceDecoratorContext,
  InterfaceDecoratorTarget,
} from "@/types";

/**
 * The decorator produced by {@link Exposed}: a class decorator that records the
 * exposure set on the WebIDL interface and exposes the interface object on the
 * matching globals.
 */
export type ExposedDecorator = <T extends InterfaceDecoratorTarget>(
  target: T,
  context: InterfaceDecoratorContext,
) => T;
