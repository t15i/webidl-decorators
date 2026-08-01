import type { ReflectedTargetAssociations } from "@t15i/webspecs/html";
import type { Attribute, NativeType, Type } from "@t15i/webspecs/webidl";

export type ReflectedAttributeGetterSpec<
  T extends Type,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute<T>,
> = (
  this: Target,
  idlAttribute: IDL,
  contentAttributeName: string,
) => NativeType<T>;

export type ReflectedAttributeSetterSpec<
  T extends Type,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute<T>,
> = (
  this: Target,
  idlAttribute: IDL,
  contentAttributeName: string,
  value: NativeType<T>,
) => void;

export type ReflectedAttributeChangeStepsSpec<
  T extends Type,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute<T>,
> = (
  this: Target,
  idlAttribute: IDL,
  contentAttributeName: string,
  element: Element,
  localName: string,
  oldValue: string | null,
  newValue: string | null,
  namespace: string | null,
) => void;

export interface ReflectedAttributeSpec<
  T extends Type,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute<T>,
> {
  getter: ReflectedAttributeGetterSpec<T, Target, IDL>;
  setter: ReflectedAttributeSetterSpec<T, Target, IDL>;
  attributeChangeSteps?: ReflectedAttributeChangeStepsSpec<T, Target, IDL>;
}

export interface ReflectionContext<
  T extends Type,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute<T>,
> {
  Target: new (element: Element) => Target;
  idlAttribute: IDL;
  contentAttributeName: string;
}
