export const debounce = (fn, timeoutMs) => {
    let latestArgs;
    let isTimeoutExists;
    return (...args) => {
        latestArgs = args;
        if (!isTimeoutExists) {
            setTimeout(() => {
                try {
                    fn(...latestArgs);
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    isTimeoutExists = false;
                }
            }, timeoutMs);
            isTimeoutExists = true;
        }
    };
};
//# sourceMappingURL=throttling-utils-main.js.map