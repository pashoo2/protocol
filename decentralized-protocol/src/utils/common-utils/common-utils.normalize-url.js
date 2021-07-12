import normalizeUrlModule from 'normalize-url';
export const normalizeUrl = (url, options) => {
    try {
        return normalizeUrlModule(url, Object.assign({ defaultProtocol: 'https:', normalizeProtocol: true, stripWWW: true, sortQueryParameters: true }, options));
    }
    catch (err) {
        return err;
    }
};
//# sourceMappingURL=common-utils.normalize-url.js.map