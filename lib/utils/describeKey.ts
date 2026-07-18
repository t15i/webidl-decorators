/**
 * Renders a member key as a human-readable string for error messages,
 * unwrapping a symbol to its description.
 */
export function describeKey(key: PropertyKey): string {
  return typeof key === "symbol"
    ? (key.description ?? key.toString())
    : `${key}`;
}
