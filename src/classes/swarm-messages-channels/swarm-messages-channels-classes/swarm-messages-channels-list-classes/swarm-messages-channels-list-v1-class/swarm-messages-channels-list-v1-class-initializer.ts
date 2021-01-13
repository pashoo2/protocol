import { DeepReadonly, DictionaryValues } from 'ts-essentials';
import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../../../swarm-message/swarm-message-constructor.types';
import { createImmutableObjectClone } from '../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import assert from 'assert';
import {
  ISwarmMessagesChannelsDescriptionsListConnectionOptions,
  TSwrmMessagesChannelsListDBOWithGrantAccess,
} from '../../../types/swarm-messages-channels-list.types';
import { isNonNativeFunction } from '../../../../../utils/common-utils/common-utils.functions';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../types/swarm-messages-channels-list.types';

export class SwarmMessagesChannelsListVersionOneInitializer<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, DBO>
> {
  protected readonly _serializer: CARGS['serializer'];

  protected readonly _channelsListDescription: Readonly<CARGS['description']>;

  protected readonly _connectionOptions: Readonly<CARGS['connectionOptions']>;

  protected readonly _utilities: Readonly<CARGS['utilities']>;

  protected readonly _validators: Readonly<CARGS['validators']>;

  constructor(constructorArguments: CARGS) {
    this._validateConstructorArguments(constructorArguments);

    const { serializer, connectionOptions, validators, description, utilities } = constructorArguments;

    // TODO - https://github.com/microsoft/TypeScript/issues/15300 issue Index signature is missing in type (only on interfaces, not on type alias)
    this._serializer = serializer;
    this._channelsListDescription = createImmutableObjectClone(description) as Readonly<CARGS['description']>;
    this._connectionOptions = createImmutableObjectClone(connectionOptions) as Readonly<CARGS['connectionOptions']>;
    this._validators = createImmutableObjectClone(validators) as Readonly<CARGS['validators']>;
    this._utilities = createImmutableObjectClone(utilities) as Readonly<CARGS['utilities']>;
  }

  protected _validateConstructorArgumentsConnectionOptions(
    connectionOptions: Readonly<ISwarmMessagesChannelsDescriptionsListConnectionOptions<P, T, DBO>>
  ): void {
    assert(connectionOptions, 'Conection options should be provided');
    assert(connectionOptions.connectorType, 'Connector type is not provided');
    assert(connectionOptions.dbOptions, 'A database options must be provided');
  }

  protected _validateConstructorArgumentsValidators(validators: CARGS['validators']): void {
    assert(validators, 'Validators should be provided in the arguments');
    assert(typeof validators === 'object', 'Validators argument should be an object');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {
      channelDescriptionSwarmMessageValidator,
      channelsListDescriptionValidator,
      swarmMessagesChannelDescriptionFormatValidator,
      swamChannelsListDatabaseOptionsValidator: validateSwamChannelsListDatabaseOptions,
    } = validators;

    assert(
      isNonNativeFunction(channelDescriptionSwarmMessageValidator),
      '"channelDescriptionSwarmMessageValidator" validator must be a non native functon'
    );
    assert(
      isNonNativeFunction(channelsListDescriptionValidator),
      '"channelsListDescriptionValidator" validator must be a non native functon'
    );
    assert(
      isNonNativeFunction(swarmMessagesChannelDescriptionFormatValidator),
      '"swarmMessagesChannelDescriptionFormatValidator" validator must be a non native functon'
    );
    assert(
      isNonNativeFunction(validateSwamChannelsListDatabaseOptions),
      '"validateSwamChannelsListDatabaseOptions" validator must be a non native functon'
    );
  }

  protected _validateConstructorArgumentsUtitlities(utilities: CARGS['utilities']): void {
    assert(utilities, 'Utilities must be passed in the constructor arguments');
    assert(typeof utilities === 'object', 'Utilities option must be an object');

    const {
      createSwarmMessageBodyForChannelDescription,
      databaseConnectionFabric,
      databaseNameGenerator,
      getDatabaseKeyForChannelDescription,
      getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription,
      getTypeForSwarmMessageWithChannelDescriptionByChannelDescription,
    } = utilities;

    assert(
      isNonNativeFunction(createSwarmMessageBodyForChannelDescription),
      '"createSwarmMessageBodyForChannelDescription" utility must be a non native functon'
    );
    assert(isNonNativeFunction(databaseConnectionFabric), '"databaseConnectionFabric" utility must be a non native functon');
    assert(isNonNativeFunction(databaseNameGenerator), '"databaseNameGenerator" utility must be a non native functon');
    assert(
      isNonNativeFunction(getDatabaseKeyForChannelDescription),
      '"getDatabaseKeyForChannelDescription" utility must be a non native functon'
    );
    assert(
      isNonNativeFunction(getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription),
      '"getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription" utility must be a non native functon'
    );
    assert(
      isNonNativeFunction(getTypeForSwarmMessageWithChannelDescriptionByChannelDescription),
      '"getTypeForSwarmMessageWithChannelDescriptionByChannelDescription" utility must be a non native functon'
    );
  }

  protected _validateConstructorArguments(constructorArguments: CARGS): void {
    assert(constructorArguments, 'Constructor arguments must be provided');

    const { serializer, connectionOptions, validators, description, utilities } = constructorArguments;

    assert(serializer, 'A serializer must be provided in arguments');
    this._validateConstructorArgumentsValidators(validators);
    this._validateConstructorArgumentsConnectionOptions(connectionOptions);
    this._validateConstructorArgumentsUtitlities(utilities);
    validators.swamChannelsListDatabaseOptionsValidator(connectionOptions.dbOptions);
    validators.channelsListDescriptionValidator(description);
  }

  protected _getSerializer(): CARGS['serializer'] {
    const serializer = this._serializer;
    if (!serializer) {
      throw new Error('Serializer is not defiend');
    }
    return serializer;
  }

  protected _getChannelsListDescription(): Readonly<CARGS['description']> {
    const channelsListDescription = this._channelsListDescription;
    if (!channelsListDescription) {
      throw new Error('There is no a description for the swarm channels list');
    }
    return channelsListDescription;
  }

  protected _getConnectionOptions(): Readonly<CARGS['connectionOptions']> {
    const connectionOptions = this._connectionOptions;
    if (!connectionOptions) {
      throw new Error('There is no a swarm connection options defined for the swarm channels list');
    }
    return connectionOptions;
  }

  protected _getUtilities(): Readonly<CARGS['utilities']> {
    const utilities = this._utilities;
    if (!utilities) {
      throw new Error('There is no a helpers functions provided');
    }
    return utilities;
  }

  protected getValidators(): Readonly<CARGS['validators']> {
    const validators = this._validators;
    if (!validators) {
      throw new Error('There is no a helpers functions provided');
    }
    return validators;
  }
}
