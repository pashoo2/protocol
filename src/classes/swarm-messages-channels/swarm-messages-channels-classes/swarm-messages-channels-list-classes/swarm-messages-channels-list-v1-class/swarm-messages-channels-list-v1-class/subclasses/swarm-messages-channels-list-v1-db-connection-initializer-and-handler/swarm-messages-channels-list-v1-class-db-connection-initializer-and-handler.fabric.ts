import assert from 'assert';
import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelDescriptionWithMetadata,
} from '../../../../../../types/swarm-messages-channel.types';
import { PromiseResolveType, IPromisePendingRejectable } from '../../../../../../../../types/promise.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  DBOFULL,
  ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric,
} from '../../../../../../types/swarm-messages-channels-list.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../../../types/swarm-messages-channels-validation.types';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../../../../types/swarm-messages-channels-list.types';
import { createImmutableObjectClone } from '../../../../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import { isNonNativeFunction } from '../../../../../../../../utils/common-utils/common-utils.functions';
import { IAdditionalUtils } from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { ISwarmMessagesChannelsListV1GrantAccessConstantArguments } from '../../types/swarm-messages-channels-list-v1-class.types';
import {
  ESwarmStoreConnectorOrbitDbDatabaseType,
  ESortFileds,
} from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from '../../types/swarm-messages-channels-list-v1-class-options-setup.types';
import { IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler } from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import {
  TSwarmMessageConstructorBodyMessage,
  ISwarmMessageBody,
} from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseIteratorMethodArgument } from '../../../../../../../swarm-store-class/swarm-store-class.types';
import { isDefined } from '../../../../../../../../utils/common-utils/common-utils-main';
import { SwarmMessagesChannelDescriptionWithMeta } from '../../../../../../swarm-messages-channels-subclasses/swarm-messages-channel-description-with-meta/swarm-messages-channel-description-with-meta';
import { createCancellablePromiseByNativePromise } from '../../../../../../../../utils/common-utils/commom-utils.promies';
import {
  ISwarmMessageStoreMessagingRequestWithMetaResult,
  ISwarmMessageStoreDeleteMessageArg,
} from '../../../../../../../swarm-message-store/types/swarm-message-store.types';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
} from '../../../../../../../swarm-store-class/swarm-store-class.types';
import { ESortingOrder } from 'classes/basic-classes/sorter-class';

export function getSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandlerClass<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
>(
  ClassSwarmMessagesChannelsListVersionOneOptionsSetUp: IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    CARGS
  >,
  additionalUtils: IAdditionalUtils<P, T, MD, CTX, DBO>
): IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<P, T, MD, CTX, DBO, CF, CARGS> {
  abstract class SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler extends ClassSwarmMessagesChannelsListVersionOneOptionsSetUp {
    private readonly __additionalUtils: Readonly<IAdditionalUtils<P, T, MD, CTX, DBO>>;

    private get _additionalUtils(): Readonly<IAdditionalUtils<P, T, MD, CTX, DBO>> {
      const additionalUtils = this.__additionalUtils;
      if (!additionalUtils) {
        throw new Error('Additional utilities for the instance are not exists');
      }
      return additionalUtils;
    }

    private _swarmMessagesKeyValueDatabaseConnectionPending: IPromisePendingRejectable<
      PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>,
      Error
    >;

    /**
     * Whether the channel's database has been opened.
     *
     * @private
     * @type {boolean}
     * @memberof SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler
     */
    private __isDatabaseOpened: boolean = false;

    /**
     * Whether the channels list have been closed.
     *
     * @private
     * @type {boolean}
     * @memberof SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler
     */
    private __isChannelsListClosed: boolean = false;

    protected get _isDatabaseOpened(): boolean {
      return this.__isDatabaseOpened && !this.__isChannelsListClosed;
    }

    constructor(constructorArguments: CARGS) {
      super(constructorArguments);
      this._validateAdditionalUtils(additionalUtils);
      this.__additionalUtils = createImmutableObjectClone(additionalUtils);
      this._swarmMessagesKeyValueDatabaseConnectionPending = createCancellablePromiseByNativePromise(
        this._createActiveConnectionToChannelsListDatabase()
      );
      this._waitTillDatabaseWillBeOpened();
    }

    private _waitTillDatabaseWillBeOpened(): void {
      void this._swarmMessagesKeyValueDatabaseConnectionPending.then(
        () => {
          this.__isDatabaseOpened = true;
        },
        () => {
          this.__isDatabaseOpened = false;
        }
      );
    }

    private _validateAdditionalUtils(additionalUtils: IAdditionalUtils<P, T, MD, CTX, DBO>): void {
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

    private async _getSwarmMessagesKeyValueDatabaseConnection(): Promise<
      PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>
    > {
      const swarmMessagesKeyValueDatabaseConnection = this._swarmMessagesKeyValueDatabaseConnectionPending;
      if (!swarmMessagesKeyValueDatabaseConnection) {
        throw new Error('There is no an active connection with the swarm messages databse');
      }
      return await swarmMessagesKeyValueDatabaseConnection;
    }

    private _createOptionsForCollectingDbKey(
      dbbKey: string
    ): TSwarmStoreDatabaseIteratorMethodArgument<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE> {
      if (this._connectorType === ESwarmStoreConnector.OrbitDB) {
        return {
          [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: dbbKey,
          [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 1,
        } as TSwarmStoreDatabaseIteratorMethodArgument<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>;
      }
      throw new Error('Swarm connector type is not supported');
    }

    private _createOptionsForCollectingAllDatabaseValues(): TSwarmStoreDatabaseIteratorMethodArgument<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    > {
      if (this._connectorType === ESwarmStoreConnector.OrbitDB) {
        return {
          [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: -1,
        } as TSwarmStoreDatabaseIteratorMethodArgument<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>;
      }
      throw new Error('Swarm connector type is not supported');
    }

    private async _getValidSwarmMessagesChannelDescriptionFromSwarmMessageBody(
      swarmMessageBody: ISwarmMessageBody
    ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any>> {
      const { pld, typ, iss } = swarmMessageBody;
      const swarmMessagesChannelDescriptionSerialized = pld;
      const swarmMessagesChannelDescriptionDeserialized = this._deserializeChannelDescriptionRaw(
        swarmMessagesChannelDescriptionSerialized
      );
      await this._validateChannelDescriptionFormat(swarmMessagesChannelDescriptionDeserialized);
      assert(
        this._createChannelDescriptionMessageIssuer() === iss,
        '"Issuer" of the swarm message with the swarm messages channel description is not valid'
      );
      assert(
        this._createChannelDescriptionMessageTyp() === typ,
        '"Typ" of the swarm message with the swarm messages channel description is not valid'
      );
      return swarmMessagesChannelDescriptionDeserialized;
    }

    private async _getSwarmChannelDescriptionRawBySwarmDbRequestResult(
      requestResult: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>
    ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any>> {
      const messageDecryptedOrError = requestResult.message;

      if (messageDecryptedOrError instanceof Error) {
        throw new Error(`${messageDecryptedOrError.message}`);
      }
      const swarmMessagesChannelDescriptionDeserialized = await this._getValidSwarmMessagesChannelDescriptionFromSwarmMessageBody(
        messageDecryptedOrError.bdy
      );
      return swarmMessagesChannelDescriptionDeserialized;
    }

    private _getSwarmChannelDescriptionRawOrErrorBySwarmDbRequestResult = async (
      requestResult: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>
    ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error> => {
      try {
        return await this._getSwarmChannelDescriptionRawBySwarmDbRequestResult(requestResult);
      } catch (err) {
        return err;
      }
    };

    private _getSwarmChannelDescriptionWithMetadataBySwarmDbRequestResultWithMetadata = async (
      requestResult: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>
    ): Promise<ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>> => {
      const channelDescriptionOrError = await this._getSwarmChannelDescriptionRawOrErrorBySwarmDbRequestResult(requestResult);
      return new SwarmMessagesChannelDescriptionWithMeta(requestResult, channelDescriptionOrError);
    };

    private _getRequestResultFromAllRequestResultsOnASingleDatabaseKeyRead(
      requestResults: (ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined)[]
    ): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined {
      if (Array.isArray(requestResults) && requestResults.length) {
        assert(requestResults.length === 1, 'Request result for one datbase key should be an array with the lenght of 1');
        return requestResults[0];
      }
      return undefined;
    }

    private async __requestDatabase(
      options: TSwarmStoreDatabaseIteratorMethodArgument<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
    ): Promise<(ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined)[]> {
      const dbConnection = await this._getSwarmMessagesKeyValueDatabaseConnection();
      return await dbConnection.collectWithMeta(options);
    }

    private async _requestDatabaseForDbKey(
      dbbKey: string,
      additionalRequestOptions?: Partial<
        TSwarmStoreDatabaseIteratorMethodArgument<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
      >
    ): Promise<(ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined)[]> {
      const optionsForReadingKeyValue = this._createOptionsForCollectingDbKey(dbbKey);
      const optionsWithAdditional = {
        ...optionsForReadingKeyValue,
        ...additionalRequestOptions,
      };
      return await this.__requestDatabase(optionsWithAdditional);
    }

    private async _readValueStoredInDatabaseByDbKey(
      dbbKey: string,
      additionalRequestOptions?: Partial<
        TSwarmStoreDatabaseIteratorMethodArgument<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
      >
    ): Promise<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined> {
      const requestResults = await this._requestDatabaseForDbKey(dbbKey, additionalRequestOptions);
      const requestResultForDbKey = this._getRequestResultFromAllRequestResultsOnASingleDatabaseKeyRead(requestResults);
      return requestResultForDbKey;
    }

    private _getArgumentForDeleteFromDbSwarmDbMethodByDbKey(
      dbKey: TSwarmStoreDatabaseEntityKey<P>
    ): ISwarmMessageStoreDeleteMessageArg<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE> {
      if (this._connectorType === ESwarmStoreConnector.OrbitDB) {
        return dbKey;
      }
      throw new Error('Swarm connector type is not supported');
    }

    protected async _readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(
      dbbKey: string,
      additionalRequestOptions?: Partial<
        TSwarmStoreDatabaseIteratorMethodArgument<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
      >
    ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined> {
      const requestResultForDbKey = await this._readValueStoredInDatabaseByDbKey(dbbKey, additionalRequestOptions);

      if (!requestResultForDbKey) {
        return undefined;
      }

      const messageForDbKey = await this._getSwarmChannelDescriptionRawBySwarmDbRequestResult(requestResultForDbKey);

      return messageForDbKey;
    }

    protected async _readAllChannelsDescriptionsWithMeta(): Promise<
      ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>[]
    > {
      const optionsForReadingAllValuesStored = this._createOptionsForCollectingAllDatabaseValues();
      const messagesReadFromDatabase = await this.__requestDatabase(optionsForReadingAllValuesStored);
      const swarmMessagesChannelsDescriptionsOrErrors = await this._convertDatabaseRequestResultIntoSwarmChannelsDescriptionsWithMeta(
        messagesReadFromDatabase
      );
      return swarmMessagesChannelsDescriptionsOrErrors;
    }

    protected async _addSwarmMessageBodyInDatabase(
      dbKey: TSwarmStoreDatabaseEntityKey<P>,
      messageBody: TSwarmMessageConstructorBodyMessage
    ): Promise<TSwarmStoreDatabaseEntityAddress<P>> {
      const dbConnection = await this._getSwarmMessagesKeyValueDatabaseConnection();
      const swarmMessageAddress = await dbConnection.addMessage(messageBody, dbKey);
      return swarmMessageAddress;
    }

    protected async _removeValueForDbKey(dbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<void> {
      const dbConnection = await this._getSwarmMessagesKeyValueDatabaseConnection();
      const argumentForDeleteValueForKeyFromDb = this._getArgumentForDeleteFromDbSwarmDbMethodByDbKey(dbKey);
      await dbConnection.deleteMessage(argumentForDeleteValueForKeyFromDb);
    }

    private _getChannelsListDatabaseName(): string {
      const channelListDescription = this._getChannelsListDescription();
      const { databaseNameGenerator } = this._getUtilities();

      return databaseNameGenerator(channelListDescription);
    }

    private _getConstantArgumentsForGrantAccessCallbackValidator(): ISwarmMessagesChannelsListV1GrantAccessConstantArguments<
      P,
      T,
      MD,
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
      const { swarmMessagesChannelDescriptionFormatValidator: swarmMessagesChannelDescriptionValidator } = this._getValidators();
      const getIsDatabaseOpened = (): boolean => this._isDatabaseOpened;
      return {
        get isDatabaseReady(): boolean {
          return getIsDatabaseOpened();
        },
        channelsListDescription,
        grandAccessCallbackFromDbOptions: grantAccess as NonNullable<DBO['grantAccess']>,
        getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription: getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription,
        getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription: getTypeForSwarmMessageWithChannelDescriptionByChannelDescription,
        getDatabaseKeyForChannelDescription,
        channelDescriptionFormatValidator: swarmMessagesChannelDescriptionValidator,
        parseChannelDescription: this._deserializeChannelDescriptionRaw.bind(this),
      };
    }

    private _getPreviousChannelDescriptionByMessageKeyAndAddedTime = async (
      dbbKey: string,
      addedTime: number
    ): Promise<IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>['channelExistingDescription']> => {
      const dbIteratorOptionsReadValueFromCache: Partial<TSwarmStoreDatabaseIteratorMethodArgument<
        ESwarmStoreConnector.OrbitDB,
        ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      >> = {
        fromCache: true,
        ltT: addedTime,
        limit: 1,
        sortBy: {
          [ESortFileds.TIME]: ESortingOrder.DESC,
        },
      };
      if (!this.__isDatabaseOpened) {
        // if database still not opened OrbitDB implementation
        // can't read existsing values, bacuse it causes halt.
        throw new Error('A database should be opened before read a value from it');
      }
      return await this._readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(
        dbbKey,
        // TODO - resolve this type cast
        dbIteratorOptionsReadValueFromCache as Partial<
          TSwarmStoreDatabaseIteratorMethodArgument<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
        >
      );
    };

    private _createGrantAccessCallbackForChannelsListDatabase(): DBO['grantAccess'] {
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
        getPreviousChannelDescriptionByMessageKeyAndAddedTime: this._getPreviousChannelDescriptionByMessageKeyAndAddedTime,
      };
      return createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator(params);
    }

    /**
     * Resposible for options creation of a connection to the database
     *
     * @private
     * @returns {TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>}
     * @memberof SwarmMessagesChannelsListVersionOne
     */
    private _getChannelsListDatabaseOptions(): DBOFULL<P, T, MD, CTX, DBO> {
      const databaseName = this._getChannelsListDatabaseName();
      const { dbOptions } = this._getConnectionOptions();
      const databaseGrantAccessCallback = this._createGrantAccessCallbackForChannelsListDatabase();
      // TOOD - remove the type cast to the "unknown" type
      return ({
        ...dbOptions,
        dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
        dbName: databaseName,
        grantAccess: databaseGrantAccessCallback,
        // we need to preload all values in cache to make it possible to read values
        // cached from grant access callback
        preloadCount: -1,
      } as unknown) as DBOFULL<P, T, MD, CTX, DBO>;
    }

    protected async _createActiveConnectionToChannelsListDatabase(): Promise<
      PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>
    > {
      const optionsForDatabase = this._getChannelsListDatabaseOptions();
      const { databaseConnectionFabric } = this._getUtilities();
      const connectionToDatabase = await databaseConnectionFabric(optionsForDatabase);
      return connectionToDatabase as PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>;
    }

    protected async _convertDatabaseRequestResultIntoSwarmChannelsDescriptionsWithMeta(
      swarmMessagesFromDatabase: (ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined)[]
    ): Promise<ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>[]> {
      const nonNullableSwarmMessagesFromDatabase = swarmMessagesFromDatabase.filter(isDefined);
      return await Promise.all(
        nonNullableSwarmMessagesFromDatabase.map(this._getSwarmChannelDescriptionWithMetadataBySwarmDbRequestResultWithMetadata)
      );
    }
  }
  // TODO - typescript issue https://github.com/microsoft/TypeScript/issues/22815
  // Abstract classes that implement interfaces shouldn't require method signatures
  return (SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler as unknown) as IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    CARGS
  >;
}
