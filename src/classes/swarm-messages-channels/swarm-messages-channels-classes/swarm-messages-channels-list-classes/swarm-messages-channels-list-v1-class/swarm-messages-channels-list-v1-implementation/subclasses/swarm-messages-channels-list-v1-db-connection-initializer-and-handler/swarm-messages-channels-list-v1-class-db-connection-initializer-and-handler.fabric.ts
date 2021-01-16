import assert from 'assert';
import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../../types/swarm-messages-channel.types';
import { PromiseResolveType } from '../../../../../../../../types/promise.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  TSwrmMessagesChannelsListFullDBO,
} from '../../../../../../types/swarm-messages-channels-list.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../../../types/swarm-messages-channels-validation.types';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../../../../types/swarm-messages-channels-list.types';
import { createImmutableObjectClone } from '../../../../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import { isNonNativeFunction } from '../../../../../../../../utils/common-utils/common-utils.functions';
import { IAdditionalUtils } from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { ISwarmMessagesChannelsListV1GrantAccessConstantArguments } from '../../types/swarm-messages-channels-list-v1-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from '../../types/swarm-messages-channels-list-v1-class-options-setup.types';
import { IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler } from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';

export function getSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandlerClass<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, I, CTX, DBO>
>(
  ClassSwarmMessagesChannelsListVersionOneOptionsSetUp: IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<
    P,
    T,
    I,
    CTX,
    DBO,
    CARGS
  >,
  additionalUtils: IAdditionalUtils<P, T, I, CTX, DBO>
): IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<P, T, I, CTX, DBO, CARGS> {
  abstract class SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler extends ClassSwarmMessagesChannelsListVersionOneOptionsSetUp {
    public get description(): Readonly<CARGS['description']> {
      return this._getChannelsListDescription();
    }

    protected readonly __additionalUtils: Readonly<IAdditionalUtils<P, T, I, CTX, DBO>>;

    protected get _additionalUtils(): Readonly<IAdditionalUtils<P, T, I, CTX, DBO>> {
      const additionalUtils = this.__additionalUtils;
      if (!additionalUtils) {
        throw new Error('Additional utilities for the instance are not exists');
      }
      return additionalUtils;
    }

    protected _swarmMessagesKeyValueDatabaseConnectionPending: Promise<
      PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>
    >;

    constructor(constructorArguments: CARGS) {
      super(constructorArguments);
      this._validateAdditionalUtils(additionalUtils);
      this.__additionalUtils = createImmutableObjectClone(additionalUtils);
      this._swarmMessagesKeyValueDatabaseConnectionPending = this._createActiveConnectionToChannelsListDatabase();
    }

    protected _validateAdditionalUtils(additionalUtils: IAdditionalUtils<P, T, I, CTX, DBO>): void {
      assert(
        additionalUtils,
        'Additional utils should be provided for the SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler constructor'
      );
      assert(typeof additionalUtils === 'object', 'Additional utils should have an object type');

      const {
        createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator,
        getArgumentsForSwarmMessageWithChannelDescriptionValidator,
        getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
      } = additionalUtils;

      assert(
        isNonNativeFunction(createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator),
        'createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator function should be provided in the "additionalUtils" constructor argument'
      );
      assert(
        isNonNativeFunction(getArgumentsForSwarmMessageWithChannelDescriptionValidator),
        'getArgumentsForSwarmMessageWithChannelDescriptionValidator function should be provided in the "additionalUtils" constructor argument'
      );
      assert(
        isNonNativeFunction(getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator),
        'getArgumentsForSwarmMessageWithChannelDescriptionValidator function should be provided in the "additionalUtils" constructor argument'
      );
    }

    protected _getChannelsListDatabaseName(): string {
      const channelListDescription = this._getChannelsListDescription();
      const { databaseNameGenerator } = this._getUtilities();

      return databaseNameGenerator(channelListDescription);
    }

    protected _getConstantArgumentsForGrantAccessCallbackValidator(): ISwarmMessagesChannelsListV1GrantAccessConstantArguments<
      P,
      T,
      I,
      CTX,
      DBO
    > {
      const channelsListDescription = this._getChannelsListDescription();
      const {
        dbOptions: { grantAccess },
      } = this._getConnectionOptions();
      const {
        getDatabaseKeyForChannelDescription,
        getTypeForSwarmMessageWithChannelDescriptionByChannelDescription,
        getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription,
      } = this._getUtilities();
      const { swarmMessagesChannelDescriptionFormatValidator } = this._getValidators();

      return {
        channelsListDescription,
        grandAccessCallbackFromDbOptions: grantAccess as NonNullable<DBO['grantAccess']>,
        getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription: getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription,
        getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription: getTypeForSwarmMessageWithChannelDescriptionByChannelDescription,
        getDatabaseKeyForChannelDescription,
        channelDescriptionFormatValidator: swarmMessagesChannelDescriptionFormatValidator,
      };
    }

    protected async _getSwarmMessagesKeyValueDatabaseConnection(): Promise<
      PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>
    > {
      const swarmMessagesKeyValueDatabaseConnection = this._swarmMessagesKeyValueDatabaseConnectionPending;
      if (!swarmMessagesKeyValueDatabaseConnection) {
        throw new Error('There is no an active connection with the swarm messages databse');
      }
      return await swarmMessagesKeyValueDatabaseConnection;
    }

    protected _createOptionsForCollectingDbKey(
      dbbKey: string
    ): Parameters<PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>['collect']>[0] {
      return {
        [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: dbbKey,
        [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 1,
      };
    }

    protected async _readValueForDbKey(dbbKey: string): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined> {
      const dbConnection = await this._getSwarmMessagesKeyValueDatabaseConnection();
      const optionsForReadingKeyValue = this._createOptionsForCollectingDbKey(dbbKey);
      // TODO - dbConnection.collectWithMeta(optionsForReadingKeyValue) returns the "any" type
      const messageForTheKey = await dbConnection.collectWithMeta(optionsForReadingKeyValue);
      return messageForTheKey;
    }

    protected _getExistingChannelDescriptionByMessageKey = async (
      dbbKey: string
    ): Promise<IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, I, CTX, DBO>['channelExistingDescription']> => {
      return await this._readValueForDbKey(dbbKey);
    };

    protected _createGrantAccessCallbackForChannelsListDatabase(): DBO['grantAccess'] {
      const argumentsConstant = this._getConstantArgumentsForGrantAccessCallbackValidator();
      const { channelDescriptionSwarmMessageValidator } = this._getValidators();
      const {
        createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator,
        getArgumentsForSwarmMessageWithChannelDescriptionValidator,
        getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
      } = this._additionalUtils;
      const params = {
        constantArguments: argumentsConstant,
        channelDescriptionSwarmMessageValidator,
        getArgumentsForSwarmMessageWithChannelDescriptionValidator,
        getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
        getExistingChannelDescriptionByMessageKey: this._getExistingChannelDescriptionByMessageKey,
      };
      return createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator(params);
    }

    /**
     * Resposible for options creation of a connection to the database
     *
     * @protected
     * @returns {TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>}
     * @memberof SwarmMessagesChannelsListVersionOne
     */
    protected _getChannelsListDatabaseOptions(): TSwrmMessagesChannelsListFullDBO<P, T, I, CTX, DBO> {
      const databaseName = this._getChannelsListDatabaseName();
      const { dbOptions } = this._getConnectionOptions();
      const databaseGrantAccessCallback = this._createGrantAccessCallbackForChannelsListDatabase();
      // TOOD - remove the type cast to the "unknown" type
      return ({
        ...dbOptions,
        dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
        dbName: databaseName,
        grantAccess: databaseGrantAccessCallback,
      } as unknown) as TSwrmMessagesChannelsListFullDBO<P, T, I, CTX, DBO>;
    }

    protected async _createActiveConnectionToChannelsListDatabase(): Promise<
      PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>
    > {
      const optionsForDatabase = this._getChannelsListDatabaseOptions();
      const { databaseConnectionFabric } = this._getUtilities();
      const connectionToDatabase = await databaseConnectionFabric(optionsForDatabase);
      return connectionToDatabase as PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>;
    }
  }
  // TODO - typescript issue https://github.com/microsoft/TypeScript/issues/22815
  // Abstract classes that implement interfaces shouldn't require method signatures
  return (SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler as unknown) as IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
    P,
    T,
    I,
    CTX,
    DBO,
    CARGS
  >;
}
