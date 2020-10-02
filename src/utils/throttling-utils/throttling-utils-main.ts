export const debounce = <F extends (...args: unknown[]) => unknown>(
  fn: F,
  timeoutMs: number
) => {
  let latestArgs: Parameters<F>;
  let isTimeoutExists: boolean;

  return (...args: Parameters<F>): void => {
    latestArgs = args;
    if (!isTimeoutExists) {
      setTimeout(() => {
        try {
          fn(...latestArgs);
        } catch (err) {
          console.error(err);
        } finally {
          isTimeoutExists = false;
        }
      }, timeoutMs);
      isTimeoutExists = true;
    }
  };
};
