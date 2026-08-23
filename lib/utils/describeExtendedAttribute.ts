/**
 * Converts an extended-attribute key to the name the spec gives it, so a
 * message can name an extended attribute the caller only holds the key of.
 *
 * @param xattr - The key webspecs holds the extended attribute under.
 */
export function describeExtendedAttribute(xattr: string): string {
  return xattr.replace(/^./u, (first) => first.toUpperCase());
}
