export function getIdentifierByName(name: string | symbol): string | undefined {
  if (typeof name === "symbol") {
    return undefined;
  }

  if (name.startsWith("#")) {
    return undefined;
  }

  return name;
}
