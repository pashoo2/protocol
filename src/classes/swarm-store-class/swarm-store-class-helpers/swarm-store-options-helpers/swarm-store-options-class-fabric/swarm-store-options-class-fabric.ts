import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreConnectorBasic,
  TSwarmStoreOptionsSerialized,
  ISwarmStoreOptions,
  ISwarmStoreOptionsClassConstructor,
} from '../../../swarm-store-class.types';
import { SwarmStoreOptions } from '../swarm-store-options-class/swarm-store-options-class';
import { ISwarmStoreOptionsClassConstructorParams } from '../../../swarm-store-class.types';
import { extend } from '../../../../../utils/common-utils/common-utils-objects';
import {
  IOptionsSerializerValidatorValidators,
  IOptionsSerializerValidatorSerializer,
} from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import {
  validateSwarmStoreOptions,
  validateSwarmStoreOptionsSerialized,
} from '../swarm-store-options-utils/swarm-store-options-utils';

export function swarmStoreOptionsClassFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
>(
  defaults?: Partial<ISwarmStoreOptionsClassConstructorParams<P, ItemType, DbType, DBO, ConnectorBasic, PO>>
): ISwarmStoreOptionsClassConstructor<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
  const getDefaultOptionsValidators = (): IOptionsSerializerValidatorValidators<
    ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
    TSwarmStoreOptionsSerialized
  > => {
    const optionsValidatorsPartial = defaults?.optionsValidators;
    return {
      isValidOptions:
        // eslint-disable-next-line @typescript-eslint/unbound-method
        optionsValidatorsPartial?.isValidOptions ??
        ((opts: unknown): opts is ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO> =>
          validateSwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>(opts)),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      isValidSerializedOptions: optionsValidatorsPartial?.isValidSerializedOptions ?? validateSwarmStoreOptionsSerialized,
    };
  };

  const getDefaultSerializer = (): IOptionsSerializerValidatorSerializer<
    ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
    TSwarmStoreOptionsSerialized
  > => {
    return defaults?.optionsSerializer ?? JSON;
  };

  const extendOptionsWithDefaults = <
    OPTS extends ISwarmStoreOptionsClassConstructorParams<P, ItemType, DbType, DBO, ConnectorBasic, PO>['swarmStoreOptions']
  >(
    options: OPTS
  ): ISwarmStoreOptionsClassConstructorParams<P, ItemType, DbType, DBO, ConnectorBasic, PO>['swarmStoreOptions'] => {
    const defaultSwarmStoreOptions = defaults?.swarmStoreOptions;
    if (!defaultSwarmStoreOptions || typeof defaultSwarmStoreOptions !== 'object') {
      return (
        options ||
        (defaultSwarmStoreOptions as ISwarmStoreOptionsClassConstructorParams<
          P,
          ItemType,
          DbType,
          DBO,
          ConnectorBasic,
          PO
        >['swarmStoreOptions'])
      );
    }
    if (typeof options !== 'object') {
      return options;
    }
    return extend(options as ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>, defaultSwarmStoreOptions);
  };

  return class SwarmStoreOptionsClass extends SwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
    constructor(options: ISwarmStoreOptionsClassConstructorParams<P, ItemType, DbType, DBO, ConnectorBasic, PO>) {
      super({
        options: extendOptionsWithDefaults(options.swarmStoreOptions),
        serializer: options.optionsSerializer || getDefaultSerializer(),
        validators: options.optionsValidators || getDefaultOptionsValidators(),
      });
    }
  };
}
