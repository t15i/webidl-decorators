import type { Accessor, AttributeDecoratorContext, Setter } from "@/types";

/**
 * Adapts an accessor member's decorator `context` into a setter member's
 * decorator context, so setter-shaped reflection can be installed on an
 * auto-accessor (its generated getter is left in place).
 *
 * @remarks
 * The accessor `access` already exposes `set`, so it is reused for the setter
 * context; `addInitializer` is bound to the original context so initializers
 * register on the actual class element.
 *
 * @param context - The accessor member decorator context to adapt.
 *
 * @returns A setter member decorator context backed by `context`.
 */
export function getSetterContextFromAccessorContext<
  Ctx extends AttributeDecoratorContext,
>(context: Accessor<Ctx>): Setter<Ctx> {
  return {
    ...context,
    kind: "setter",
    access: {
      has: context.access.has,
      set: context.access.set,
    },
    addInitializer: context.addInitializer.bind(context),
  } as Setter<Ctx>;
}
