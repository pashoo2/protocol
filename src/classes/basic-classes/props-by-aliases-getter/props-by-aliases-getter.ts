import {
  TTargetObject,
  IAliasValueGetter as IPropValueGetter,
  IAliasesToPropsPathMap,
  IPropsByAliasesGetter,
} from './props-by-aliases-getter.types';

export class PropsByAliasesGetter<T extends TTargetObject> implements IPropsByAliasesGetter<T> {
  private readonly __aliasesGetters: Record<string | number, IPropValueGetter<T>> = {};
  constructor(aliasesMap: IAliasesToPropsPathMap<T>) {
    this._createAliasesGetters(aliasesMap);
  }

  public getPropertyValueByPath(aliasNameOrPropertyPath: string, targetObject: T): unknown {
    let propValueGetter = this._getPropValueGetterForPath(aliasNameOrPropertyPath);

    if (typeof propValueGetter !== 'function') {
      propValueGetter = this._createSetInCacheAndReturnValueGetterForPropertyPath(aliasNameOrPropertyPath);
    }
    return propValueGetter(targetObject);
  }

  protected _getPropValueGetterForPath(aliasNameOrPropertyPath: string): IPropValueGetter<T> {
    return this.__aliasesGetters[aliasNameOrPropertyPath];
  }

  protected _setValueGetterForPathOrAlias(aliasOrPath: string, valueGetter: IPropValueGetter<T>) {
    this.__aliasesGetters[aliasOrPath] = valueGetter;
  }

  protected _createAliasesGetters(aliasesMap: IAliasesToPropsPathMap<T>): void {
    Object.keys(aliasesMap).forEach((aliasName) => {
      const aliasPathStringOrGetterFunction = aliasesMap[aliasName];
      const propValueGetter =
        typeof aliasPathStringOrGetterFunction === 'function'
          ? aliasPathStringOrGetterFunction
          : this._createAliasValueGetter(aliasPathStringOrGetterFunction);

      this._setValueGetterForPathOrAlias(aliasName, propValueGetter);
    });
  }

  protected _createAliasValueGetter(aliasPathStringOrGetterFunction: string): IPropValueGetter<T> {
    const aliasPathParts = aliasPathStringOrGetterFunction.split('.');

    if (aliasPathParts.length < 1) {
      throw new Error(`Path defined for the alias is not a valid`);
    }
    return function getAliasValue(
      this: {
        aliasPathParts: string[];
      },
      targetObject: T
    ) {
      const { aliasPathParts } = this;
      const pathsPartsCount = aliasPathParts.length;
      let current = targetObject as Record<string | number, unknown>;
      let idx = 0;

      while (idx < pathsPartsCount) {
        if (!current || typeof current !== 'object') {
          throw new Error(`Failed to get path part ${idx}: ${aliasPathParts[idx]}`);
        }
        current = current[aliasPathParts[idx]] as Record<string | number, unknown>;
        idx += 1;
      }
      return current;
    }.bind({ aliasPathParts } as {
      aliasPathParts: string[];
    });
  }

  protected _createSetInCacheAndReturnValueGetterForPropertyPath(aliasNameOrPropertyPath: string): IPropValueGetter<T> {
    const pathGetter = this._createAliasValueGetter(aliasNameOrPropertyPath);

    this._setValueGetterForPathOrAlias(aliasNameOrPropertyPath, pathGetter);
    return pathGetter;
  }
}
