import { isNonNativeFunction } from 'utils';

import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import { createImmutableObjectClone } from '../../../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import assert from 'assert';
import {
  ISwarmMessagesChannelsDescriptionsListConnectionOptions,
  TSwrmMessagesChannelsListDBOWithGrantAccess,
} from '../../../../../types/swarm-messages-channels-list-instance.types';
import {
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
  ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric,
} from '../../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp,
  IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp,
} from '../../types/swarm-messages-channels-list-v1-class-options-setup.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../types/swarm-messages-channel-instance.types';
import { TSwarmMessageConstructorBodyMessage } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../../../../swarm-store-class/swarm-store-class.types';

export class SwarmMessagesChannelsListVersionOneOptionsSetUp<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
> extends AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, MD, CTX, DBO, CF, CARGS> {
  protected readonly _channelsListDescription: Readonly<CARGS['description']>;

  protected readonly _connectionOptions: Readonly<CARGS['connectionOptions']>;

  protected readonly _utilities: Readonly<CARGS['utilities']>;

  protected readonly _validators: Readonly<CARGS['validators']>;

  protected readonly _connectorType: P;

  constructor(constructorArguments: CARGS) {
    super();
    this._validateConstructorArguments(constructorArguments);

    const { connectionOptions, validators, description, utilities } = constructorArguments;

    // TODO - https://github.com/microsoft/TypeScript/issues/15300 issue - Index signature is missing in type (only on interfaces, not on type alias)
    this._channelsListDescription = createImmutableObjectClone(description) as Readonly<CARGS['description']>;
    this._connectionOptions = createImmutableObjectClone(connectionOptions) as Readonly<CARGS['connectionOptions']>;
    this._validators = createImmutableObjectClone(validators) as Readonly<CARGS['validators']>;
    this._utilities = createImmutableObjectClone(utilities) as Readonly<CARGS['utilities']>;
    this._connectorType = connectionOptions.connectorType;
  }

  protected __resetOptionsSetup(): void {
    (this as any)._channelsListDescription = undefined;
    (this as any)._connectionOptions = undefined;
    (this as any)._utilities = undefined;
    (this as any)._validators = undefined;
    (this as any)._connectorType = undefined;
  }

  protected _validateConstructorArgumentsConnectionOptions(
    connectionOptions: Readonly<ISwarmMessagesChannelsDescriptionsListConnectionOptions<P, T, MD, CTX, DBO>>
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
      serializer,
      databaseConnectionFabric,
      databaseNameGenerator,
      getDatabaseKeyForChannelDescription,
      getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription,
      getTypeForSwarmMessageWithChannelDescriptionByChannelDescription,
    } = utilities;

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
    assert(serializer, 'A serializer must be provided in arguments');
  }

  protected _validateConstructorArguments(constructorArguments: CARGS): void {
    assert(constructorArguments, 'Constructor arguments must be provided');

    const { connectionOptions, validators, description, utilities } = constructorArguments;

    this._validateConstructorArgumentsValidators(validators);
    this._validateConstructorArgumentsConnectionOptions(connectionOptions);
    this._validateConstructorArgumentsUtitlities(utilities);
    validators.swamChannelsListDatabaseOptionsValidator(connectionOptions.dbOptions);
    validators.channelsListDescriptionValidator(description);
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

  protected _getSerializer(): CARGS['utilities']['serializer'] {
    return this._getUtilities().serializer;
  }

  protected _getValidators(): Readonly<CARGS['validators']> {
    const validators = this._validators;
    if (!validators) {
      throw new Error('There is no a helpers functions provided');
    }
    return validators;
  }

  protected _getJSONSchemaValidator(): CARGS['validators']['jsonSchemaValidator'] {
    return this._getValidators().jsonSchemaValidator;
  }

  protected _getSwarmMessagesChannelDescriptionValidator(): CARGS['validators']['swarmMessagesChannelDescriptionFormatValidator'] {
    const { swarmMessagesChannelDescriptionFormatValidator: swarmMessagesChannelDescriptionValidator } = this._getValidators();
    if (!swarmMessagesChannelDescriptionValidator) {
      throw new Error('"swarmMessagesChannelDescriptionValidator" is not available');
    }
    return swarmMessagesChannelDescriptionValidator;
  }

  /**
   * validates channel description format
   *
   * @param channelDescriptionRaw
   * @return {Promise<void>}
   * @throws - if the format is not valid
   */
  protected async _validateChannelDescriptionFormat(
    channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): Promise<void> {
    // TODO - context is not provided on here, so we need to move the context usages
    await this._getSwarmMessagesChannelDescriptionValidator()(channelDescriptionRaw, this._getJSONSchemaValidator());
  }

  protected _serializeChannelDescriptionRaw(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): string {
    // TODO - may be it is necessary to serialize channelDescriptionRaw.dbOptions
    // separately because the channelDescriptionRaw.dbOptions.grandAccess is a function
    const serializer = this._getSerializer();
    return serializer.stringify(channelDescriptionRaw);
  }

  protected _deserializeChannelDescriptionRaw(
    channelDescriptionSerialized: string
  ): ISwarmMessageChannelDescriptionRaw<P, T, any, any> {
    // TODO - may be it is necessary to deserialize channelDescriptionRaw.dbOptions
    // separately because the channelDescriptionRaw.dbOptions.grandAccess is a function
    const serializer = this._getSerializer();
    return serializer.parse(channelDescriptionSerialized);
  }

  /**
   * Returns a "type" param for a message, which represents a swarm messages channel description
   *
   * @protected
   * @param {ISwarmMessageChannelDescriptionRaw<P, T, any, any>} channelDescriptionRaw
   * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ']}
   * @memberof SwarmMessagesChannelsListVersionOne
   */
  protected _createChannelDescriptionMessageTyp(): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'] {
    const { getTypeForSwarmMessageWithChannelDescriptionByChannelDescription } = this._getUtilities();
    const channelsListDescription = this._getChannelsListDescription();
    return getTypeForSwarmMessageWithChannelDescriptionByChannelDescription(channelsListDescription);
  }

  /**
   * Return an issuer param for a swarm message, which represents a swarm messages channel description
   *
   * @protected
   * @param {ISwarmMessageChannelDescriptionRaw<P, T, any, any>} channelDescriptionRaw
   * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss']}
   * @memberof SwarmMessagesChannelsListVersionOne
   */
  protected _createChannelDescriptionMessageIssuer(): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'] {
    const { getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription } = this._getUtilities();
    const channelsListDescription = this._getChannelsListDescription();
    return getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription(channelsListDescription);
  }

  /**
   * Return a database key for storing the swarm messages channel description
   *
   * @protected
   * @param {ISwarmMessageChannelDescriptionRaw<P, T, any, any>} channelDescriptionRaw
   * @returns {string}
   * @memberof SwarmMessagesChannelsListVersionOneOptionsSetUp
   */
  protected _getKeyInDatabaseForStoringChannelsListDescription(
    channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): TSwarmStoreDatabaseEntityKey<P> {
    const { getDatabaseKeyForChannelDescription } = this._getUtilities();
    return getDatabaseKeyForChannelDescription(channelDescriptionRaw);
  }

  protected _parseSwarmMessagesChannelDescription = (
    channelDescription: string
  ): ISwarmMessageChannelDescriptionRaw<P, T, any, any> => {
    return this._getSerializer().parse(channelDescription);
  };
}

export function getIConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
>(): IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, MD, CTX, DBO, CF, CARGS> {
  // TODO - remove the type cast
  return SwarmMessagesChannelsListVersionOneOptionsSetUp as unknown as IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    CARGS
  >;
}
