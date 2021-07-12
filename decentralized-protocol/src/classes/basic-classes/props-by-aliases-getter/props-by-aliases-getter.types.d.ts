export declare type TTargetObject = {};
export interface IAliasValueGetter<T extends TTargetObject> {
    (targetObject: T): unknown;
}
export interface IAliasesToPropsPathMap<T extends TTargetObject> {
    [key: string]: string | IAliasValueGetter<T>;
    [key: number]: string | IAliasValueGetter<T>;
}
export interface IPropsByAliasesGetter<T extends TTargetObject> {
    getPropertyValueByPath(aliasName: string, targetObject: T): unknown;
}
export interface IPropsByAliasesGetterConstructor<T extends TTargetObject> {
    new (aliases: IAliasesToPropsPathMap<T>): IPropsByAliasesGetter<T>;
}
//# sourceMappingURL=props-by-aliases-getter.types.d.ts.map