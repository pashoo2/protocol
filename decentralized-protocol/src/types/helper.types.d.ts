export declare type TPrototypeKeys = keyof Object;
export declare type ownKeyOf<T extends object> = keyof T extends TPrototypeKeys ? never : keyof T;
export declare type ownValueOf<T extends object> = keyof T extends ownKeyOf<T> ? T[keyof T] : never;
export declare type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
export declare type FirstPrameter<F extends (arg: any) => any> = Parameters<F> extends Array<infer FirstArg> ? FirstArg : never;
export declare type OmitTypeProp<T extends {}, E> = {
    [k in keyof T]: T[k] extends E ? never : T[k];
};
export declare type OmitType<T, O> = T extends O ? never : T;
export declare type ConstructorType<R, A extends Array<any> = any[]> = new (...args: A) => R;
export declare type ArrayFirst<T extends any[]> = T extends Array<infer F> ? F : never;
export declare type Defined<T extends {}> = {
    [k in keyof T]: T[k] extends undefined ? NonNullable<T[k]> : T[k];
};
export declare type ParametersWithoutFirst<F extends (...args: any[]) => any> = F extends (arg0: any, ...array: infer U) => any ? U : never;
export declare type OmitFirstArg<F> = F extends (x: unknown, ...args: infer P) => unknown ? (...args: P) => ReturnType<F> : never;
export declare type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];
export declare type ConstructorOptionsType<T extends new (...args: any[]) => unknown> = T extends new (...args: infer I) => unknown ? I : never;
export declare type ConstructorArgumentType<T extends new (arg: any) => unknown> = T extends new (arg: infer I) => unknown ? I : never;
export declare type PromiseReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => Promise<infer R> ? Promise<R> : never;
//# sourceMappingURL=helper.types.d.ts.map