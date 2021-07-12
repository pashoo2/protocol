export const lazyLoadScript = (url, crossOrigin = 'anonymous') => {
    try {
        const script = window.document.createElement('script');
        script.src = url;
        script.async = true;
        script.type = 'text/javascript';
        script.crossOrigin = crossOrigin;
        window.document.body.appendChild(script);
        return new Promise((res, rej) => {
            script.onload = () => {
                res(true);
            };
            script.onerror = rej;
        });
    }
    catch (err) {
        return Promise.reject(err);
    }
};
//# sourceMappingURL=lazy-loading-utils.js.map