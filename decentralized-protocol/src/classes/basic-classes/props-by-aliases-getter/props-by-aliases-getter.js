export class PropsByAliasesGetter {
    constructor(aliasesMap) {
        this.__aliasesGetters = {};
        this._createAliasesGetters(aliasesMap);
    }
    getPropertyValueByPath(aliasNameOrPropertyPath, targetObject) {
        let propValueGetter = this._getPropValueGetterForPath(aliasNameOrPropertyPath);
        if (typeof propValueGetter !== 'function') {
            propValueGetter = this._createSetInCacheAndReturnValueGetterForPropertyPath(aliasNameOrPropertyPath);
        }
        return propValueGetter(targetObject);
    }
    _getPropValueGetterForPath(aliasNameOrPropertyPath) {
        return this.__aliasesGetters[aliasNameOrPropertyPath];
    }
    _setValueGetterForPathOrAlias(aliasOrPath, valueGetter) {
        this.__aliasesGetters[aliasOrPath] = valueGetter;
    }
    _createAliasesGetters(aliasesMap) {
        Object.keys(aliasesMap).forEach((aliasName) => {
            const aliasPathStringOrGetterFunction = aliasesMap[aliasName];
            const propValueGetter = typeof aliasPathStringOrGetterFunction === 'function'
                ? aliasPathStringOrGetterFunction
                : this._createAliasValueGetter(aliasPathStringOrGetterFunction);
            this._setValueGetterForPathOrAlias(aliasName, propValueGetter);
        });
    }
    _createAliasValueGetter(aliasPathStringOrGetterFunction) {
        const aliasPathParts = aliasPathStringOrGetterFunction.split('.');
        if (aliasPathParts.length < 1) {
            throw new Error(`Path defined for the alias is not a valid`);
        }
        return function getAliasValue(targetObject) {
            const { aliasPathParts } = this;
            const pathsPartsCount = aliasPathParts.length;
            let current = targetObject;
            let idx = 0;
            while (idx < pathsPartsCount) {
                if (!current || typeof current !== 'object') {
                    throw new Error(`Failed to get path part ${idx}: ${aliasPathParts[idx]}`);
                }
                current = current[aliasPathParts[idx]];
                idx += 1;
            }
            return current;
        }.bind({ aliasPathParts });
    }
    _createSetInCacheAndReturnValueGetterForPropertyPath(aliasNameOrPropertyPath) {
        const pathGetter = this._createAliasValueGetter(aliasNameOrPropertyPath);
        this._setValueGetterForPathOrAlias(aliasNameOrPropertyPath, pathGetter);
        return pathGetter;
    }
}
//# sourceMappingURL=props-by-aliases-getter.js.map