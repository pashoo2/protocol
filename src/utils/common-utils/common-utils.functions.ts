export function isNonArrowFunctionStringified(valueStringified: string): boolean {
  return /^(?:async)*[ ]*function[ ]*(?:[a-zA-Z]\w*)*[ ]*\(.*\)[ ]*/.test(valueStringified);
}

export function isArrowFunctionStringified(valueStringified: string): boolean {
  return /^(?:async)*[ ]*\(.*\)[ ]*=>[ ]*/.test(valueStringified);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isNativeFunction(f: Function): boolean {
  return (
    typeof f === 'function' &&
    (f === Function.prototype ||
      /^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code\]\s*}\s*$/.test(
        String(f)
      ))
  );
}

export function isArrowFunction(fn: Function): boolean {
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

export function createFunctionFromSerializedFunction(functionSerialized: string): (...args: any[]) => any {
  // eslint-disable-next-line no-eval
  try {
    // TODO - ReDoS attacks and make it create function in a sandbox
    const funcitonCreatedFromString = eval(`(${functionSerialized})`);
    if (!funcitonCreatedFromString) {
      throw new Error('Failed to create function by it body');
    }
    return funcitonCreatedFromString;
  } catch (err) {
    throw new Error(`Faild to parser the function serialized ${functionSerialized}`);
  }
}

export function isEqualFunctions(fn1: Function, fn2: Function): boolean {
  if (fn1 === fn2) {
    return true;
  }
  if (fn1.length !== fn2.length) {
    return false;
  }
  if (fn1.name !== fn2.name) {
    return false;
  }
  if (isArrowFunction(fn1) !== isArrowFunction(fn2)) {
    return false;
  }
  if (isNativeFunction(fn1) || isNativeFunction(fn2)) {
    // native functions which not equal each other not equal at all
    return false;
  }
  // compare them stringified
  return String(fn1).trim() === String(fn2).trim();
}
