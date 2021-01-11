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
export function isNativeFunction(fn: Function): boolean {
  if (typeof fn !== 'function') return false;
  // Used to resolve the internal `[[Class]]` of values
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const toString = Object.prototype.toString;

  // Used to resolve the decompiled source of functions
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const fnToString = Function.prototype.toString;

  // Used to detect host constructors (Safari > 4; really typed array specific)
  const reHostCtor = /^\[object .+?Constructor\]$/;

  // Compile a regexp using a common native method as a template.
  // We chose `Object#toString` because there's a good chance it is not being mucked with.
  const reNative = RegExp(
    '^' +
      // Coerce `Object#toString` to a string
      String(toString)
        // Escape any special regexp characters
        .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
        // Replace mentions of `toString` with `.*?` to keep the template generic.
        // Replace thing like `for ...` to support environments like Rhino which add extra info
        // such as method arity.
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
      '$'
  );
  const type = typeof fn;
  return type === 'function'
    ? // Use `Function#toString` to bypass the fn's own `toString` method
      // and avoid being faked out.
      reNative.test(fnToString.call(fn))
    : // Fallback to a host object check because some environments will represent
      // things like typed arrays as DOM methods which may not conform to the
      // normal native pattern.
      (fn && type === 'object' && reHostCtor.test(toString.call(fn))) || false;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isArrowFunction(fn: Function): boolean {
  if (typeof fn !== 'function') return false;
  if (isNativeFunction(fn)) {
    return false;
  }
  return fn.prototype === undefined;
}
