import type { ReflectedTargetAssociations } from "@t15i/webspecs/html";
import type { Attribute } from "@t15i/webspecs/webidl";

export type ReflectedAttributeGetterSpec<
  T,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute,
> = (this: Target, idlAttribute: IDL, contentAttributeName: string) => T;

export type ReflectedAttributeSetterSpec<
  T,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute,
> = (
  this: Target,
  idlAttribute: IDL,
  contentAttributeName: string,
  value: T,
) => void;

export type ReflectedAttributeChangeStepsSpec<
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute,
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
  T,
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute,
> {
  getter: ReflectedAttributeGetterSpec<T, Target, IDL>;
  setter: ReflectedAttributeSetterSpec<T, Target, IDL>;
  attributeChangeSteps?: ReflectedAttributeChangeStepsSpec<Target, IDL>;
}

export interface ReflectionContext<
  Target extends ReflectedTargetAssociations,
  IDL extends Attribute,
> {
  Target: new (element: Element) => Target;
  idlAttribute: IDL;
  contentAttributeName: string;
}
