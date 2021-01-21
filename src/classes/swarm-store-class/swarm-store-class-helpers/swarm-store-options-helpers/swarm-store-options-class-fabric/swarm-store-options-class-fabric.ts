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
import { IOptionsSerializerValidatorConstructorParams } from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
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
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  SSO extends ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO>
>(
  defaults?: Partial<ISwarmStoreOptionsClassConstructorParams<P, T, DbType, DBO, ConnectorBasic, CO, SSO>>
): ISwarmStoreOptionsClassConstructor<P, T, DbType, DBO, ConnectorBasic, CO, SSO> {
  const getDefaultOptionsValidators = (): IOptionsSerializerValidatorValidators<
    ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
    TSwarmStoreOptionsSerialized
  > => {
    const optionsValidatorsPartial = defaults?.optionsValidators;
    return {
      isValidOptions:
        // eslint-disable-next-line @typescript-eslint/unbound-method
        optionsValidatorsPartial?.isValidOptions ??
        ((opts: unknown): opts is ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO> =>
          validateSwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO>(opts)),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      isValidSerializedOptions: optionsValidatorsPartial?.isValidSerializedOptions ?? validateSwarmStoreOptionsSerialized,
    };
  };

  const getDefaultSerializer = (): IOptionsSerializerValidatorSerializer<
    ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
    TSwarmStoreOptionsSerialized
  > => {
    return defaults?.optionsSerializer ?? JSON;
  };

  const extendOptionsWithDefaults = <
    OPTS extends ISwarmStoreOptionsClassConstructorParams<P, T, DbType, DBO, ConnectorBasic, CO, SSO>['swarmStoreOptions']
  >(
    options: OPTS
  ): ISwarmStoreOptionsClassConstructorParams<P, T, DbType, DBO, ConnectorBasic, CO, SSO>['swarmStoreOptions'] => {
    const defaultSwarmStoreOptions = defaults?.swarmStoreOptions;
    if (!defaultSwarmStoreOptions || typeof defaultSwarmStoreOptions !== 'object') {
      return (
        options ||
        (defaultSwarmStoreOptions as ISwarmStoreOptionsClassConstructorParams<
          P,
          T,
          DbType,
          DBO,
          ConnectorBasic,
          CO,
          SSO
        >['swarmStoreOptions'])
      );
    }
    if (typeof options !== 'object') {
      return options;
    }
    return extend(options as ISwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO>, defaultSwarmStoreOptions);
  };

  class SwarmStoreOptionsClass extends SwarmStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO, SSO> {
    constructor(options: ISwarmStoreOptionsClassConstructorParams<P, T, DbType, DBO, ConnectorBasic, CO, SSO>) {
      super({
        options: extendOptionsWithDefaults(options.swarmStoreOptions),
        serializer: options.optionsSerializer || getDefaultSerializer(),
        validators: options.optionsValidators || getDefaultOptionsValidators(),
      } as IOptionsSerializerValidatorConstructorParams<SSO, string>);
    }
  }

  return SwarmStoreOptionsClass;
}
