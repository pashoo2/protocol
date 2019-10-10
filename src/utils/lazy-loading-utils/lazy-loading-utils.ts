export const lazyLoadScript = (
  url: string,
  crossOrigin: string = 'anonymous'
): Promise<Error | boolean> => {
  try {
    const script = window.document.createElement('script');

    script.src = url;
    script.async = true;
    script.type = 'text/javascript';
    script.crossOrigin = crossOrigin;
    window.document.documentElement.appendChild(script);
    return new Promise<Error | boolean>((res, rej) => {
      script.onload = () => {
        res(true);
      };
      script.onerror = rej;
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
