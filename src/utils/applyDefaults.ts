export function applyDefaults<T extends object>(
  originalValue: T,
  defaults: Partial<T>,
): T {
  const clonedOriginal = JSON.parse(JSON.stringify(originalValue));

  Object.entries(defaults).forEach(([key, defaultValue]) => {
    if (clonedOriginal[key] === undefined) {
      clonedOriginal[key] = defaultValue;
    }
  });

  return clonedOriginal;
}
