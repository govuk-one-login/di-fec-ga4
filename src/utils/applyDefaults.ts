export function applyDefaults<T extends Object>(
  originalValue: T,
  defaults: Partial<T>,
): T {
  const clonedOriginal = JSON.parse(JSON.stringify(originalValue));

  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (clonedOriginal[key] === undefined) {
      clonedOriginal[key] = defaultValue;
    }
  }

  return clonedOriginal;
}
