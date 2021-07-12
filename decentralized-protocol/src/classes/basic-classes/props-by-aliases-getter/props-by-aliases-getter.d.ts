import { TTargetObject, IAliasValueGetter as IPropValueGetter, IAliasesToPropsPathMap, IPropsByAliasesGetter } from './props-by-aliases-getter.types';
export declare class PropsByAliasesGetter<T extends TTargetObject> implements IPropsByAliasesGetter<T> {
    private readonly __aliasesGetters;
    constructor(aliasesMap: IAliasesToPropsPathMap<T>);
    getPropertyValueByPath(aliasNameOrPropertyPath: string, targetObject: T): unknown;
    protected _getPropValueGetterForPath(aliasNameOrPropertyPath: string): IPropValueGetter<T>;
    protected _setValueGetterForPathOrAlias(aliasOrPath: string, valueGetter: IPropValueGetter<T>): void;
    protected _createAliasesGetters(aliasesMap: IAliasesToPropsPathMap<T>): void;
    protected _createAliasValueGetter(aliasPathStringOrGetterFunction: string): IPropValueGetter<T>;
    protected _createSetInCacheAndReturnValueGetterForPropertyPath(aliasNameOrPropertyPath: string): IPropValueGetter<T>;
}
//# sourceMappingURL=props-by-aliases-getter.d.ts.map