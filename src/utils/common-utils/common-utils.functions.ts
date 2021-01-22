export function isUnnamedFunctionSerialized(functionSerialized: string): boolean {
  return functionSerialized.startsWith('function (');
}

export function isNamedFunctionSerialized(functionSerialized: string): boolean {
  return functionSerialized.startsWith('function (');
}

export function isArrowFunctionSerialized(functionSerialized: string): boolean {
  return functionSerialized.startsWith('(') && functionSerialized.includes(') => ');
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isNativeFunction(f: Function): boolean {
  return (
    typeof f === 'function' &&
    (f === Function.prototype ||
      /^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code\]\s*}\s*$/i.test(
        String(f)
      ))
  );
}

export function isArrowFunction(fn: (...args: any[]) => any): boolean {
  if (typeof fn !== 'function') return false;
  if (isNativeFunction(fn)) {
    return false;
  }
  return fn.prototype === undefined && /^[^{]+?=>/.test(Function.prototype.toString.call(fn));
}

/**
 * Returns whether the argument is a non native function.
 *
 * @export
 * @param {unknown} value
 * @returns {value is (...args: unknown[])}
 */
export function isNonNativeFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function' && !isNativeFunction(value);
}
