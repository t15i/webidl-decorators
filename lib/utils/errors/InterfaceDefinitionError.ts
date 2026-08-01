/**
 * `TypeError` thrown when a decorated class cannot be set up as a WebIDL
 * interface while the {@link Interface} decorator runs.
 *
 * @param options - Standard error options; use `cause` to wrap the underlying
 *  error that triggered the failure.
 *
 * @remarks
 * Thrown from the decorator body itself — for example when neither an
 * identifier argument nor a class name is available to name the interface. The
 * interface is not named in the message: its identifier may not be resolved
 * yet at this point. The specific reason the setup failed is preserved on
 * `cause`. Validation of the accumulated draft happens later, during class
 * initialization, and surfaces as {@link InterfaceInitializationError} instead.
 */
export class InterfaceDefinitionError extends TypeError {
  constructor(options?: ErrorOptions) {
    super(`Cannot define interface`, options);

    this.name = "InterfaceDefinitionError";
  }
}
