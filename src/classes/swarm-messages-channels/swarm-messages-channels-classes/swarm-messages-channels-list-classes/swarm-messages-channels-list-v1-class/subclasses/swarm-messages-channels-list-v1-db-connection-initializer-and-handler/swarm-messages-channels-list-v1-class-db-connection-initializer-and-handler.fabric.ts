import assert from 'assert';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelDescriptionWithMetadata,
} from '../../../../../types/swarm-messages-channel-instance.types';
import { PromiseResolveType, IPromisePendingRejectable } from '../../../../../../../types/promise.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  DBOFULL,
  ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric,
} from '../../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../../types/swarm-messages-channels-validation.types';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../../../types/swarm-messages-channels-list-instance.types';
import { createImmutableObjectClone } from '../../../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import { isNonNativeFunction } from '../../../../../../../utils/common-utils/common-utils.functions';
import { IAdditionalUtils } from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { ISwarmMessagesChannelsListV1GrantAccessConstantArguments } from '../../types/swarm-messages-channels-list-v1-class.types';
import {
  ESwarmStoreConnectorOrbitDbDatabaseType,
  ESortFileds,
} from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from '../../types/swarm-messages-channels-list-v1-class-options-setup.types';
import { IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler } from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import {
  TSwarmMessageConstructorBodyMessage,
  ISwarmMessageBody,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseIteratorMethodArgument } from '../../../../../../swarm-store-class/swarm-store-class.types';
import { isDefined } from '../../../../../../../utils/common-utils/common-utils-main';
import { SwarmMessagesChannelDescriptionWithMeta } from '../../../../../swarm-messages-channels-subclasses/swarm-messages-channel-description-with-meta/swarm-messages-channel-description-with-meta';
import { createRejectablePromiseByNativePromise } from '../../../../../../../utils/common-utils/commom-utils.promies';
import {
  ISwarmMessageStoreMessagingRequestWithMetaResult,
  ISwarmMessageStoreDeleteMessageArg,
} from '../../../../../../swarm-message-store/types/swarm-message-store.types';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
} from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ESortingOrder } from 'classes/basic-classes/sorter-class';
import {
  getEventEmitterInstance,
  EventEmitter,
} from '../../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from '../../../../../../swarm-message-store/swarm-message-store.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  ESwarmMessagesChannelsListEventName,
  ISwarmMessagesChannelsListEvents,
} from '../../../../../types/swarm-messages-channels-list-events.types';
import { TSwarmChannelId } from '../../../../../../../../.ignored/swarm-channel/swarm-channel.types';
import { TTypedEmitter } from '../../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ISwarmMessagesChannelsListDatabaseEvents } from '../../../../../types/swarm-messages-channels-list-events.types';

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
    protected get _emitterDatabaseHandler(): TTypedEmitter<ISwarmMessagesChannelsListDatabaseEvents<P, any>> {
      return this.__emitter;
    }

    protected get _databaseConnection(): PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>> {
      const databaseConnection = this.__databaseConnectionOrUndefined;

      if (!databaseConnection) {
        throw new Error('There is no active database connection instance');
      }
      return databaseConnection;
    }

    protected get _isDatabaseReady(): boolean {
      return Boolean(this.__databaseConnectionOrUndefined) && this._databaseConnection.isReady;
    }

    private readonly __additionalUtils: Readonly<IAdditionalUtils<P, T, MD, CTX, DBO>>;

    private get _additionalUtils(): Readonly<IAdditionalUtils<P, T, MD, CTX, DBO>> {
      const additionalUtils = this.__additionalUtils;
      if (!additionalUtils) {
        throw new Error('Additional utilities for the instance are not exists');
      }
      return additionalUtils;
    }

    private readonly __emitter: TTypedEmitter<ISwarmMessagesChannelsListDatabaseEvents<P, any>> = getEventEmitterInstance<
      ISwarmMessagesChannelsListEvents<P, any>
    >();

    private __swarmMessagesKeyValueDatabaseConnectionPending: IPromisePendingRejectable<
      PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>,
      Error
    >;

    /**
     * Connection to a swarm messages database related to the channel.
     *
     * @private
     * @type {(PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>> | undefined)}
     * @memberof SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler
     */
    private __databaseConnectionOrUndefined:
      | PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>
      | undefined;

    constructor(constructorArguments: CARGS) {
      super(constructorArguments);
      this._validateAdditionalUtils(additionalUtils);
      this.__additionalUtils = createImmutableObjectClone(additionalUtils);
      this.__swarmMessagesKeyValueDatabaseConnectionPending = createRejectablePromiseByNativePromise(
        this._createActiveConnectionToChannelsListDatabase()
      );
      this.__waitDatabaseWillBeOpenedSetListenersAndOpenedStatus();
    }

    protected async _closeDatabase(): Promise<void> {
      this.__unsetCurrentDatabaseConnectionListeners();
      this.__stopConnectionPendingToACurrentDatabase();

      const promiseCloseCurrentDatabaseConnection = this.__closeCurrentDatabaseConnection();

      this.__unsetDatabaseConnection();
      await promiseCloseCurrentDatabaseConnection;
    }

    protected async _dropDatabase(): Promise<void> {
      this.__unsetCurrentDatabaseConnectionListeners();

      const databaseConnection = await this._getSwarmMessagesKeyValueDatabaseConnection();

      this.__stopConnectionPendingToACurrentDatabase();
      this.__unsetDatabaseConnection();
      await databaseConnection.drop();
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

    protected _getErrorForRejectingSwarmMessagesKeyValueDatabaseConnectionPendingOnCloseInstance(): Error {
      return new Error('The instance has been closed');
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

    protected _restartDatabaseConnection(): void {
      this.__swarmMessagesKeyValueDatabaseConnectionPending = createRejectablePromiseByNativePromise(
        this._createActiveConnectionToChannelsListDatabase()
      );
      this.__waitDatabaseWillBeOpenedSetListenersAndOpenedStatus();
    }

    protected _emitEventDbHandler<E extends keyof ISwarmMessagesChannelsListDatabaseEvents<P, any>>(
      eventName: E,
      ...args: Parameters<ISwarmMessagesChannelsListDatabaseEvents<P, any>[E]>
    ): void {
      // TODO - resolve cast to any
      (this.__emitter as EventEmitter<ISwarmMessagesChannelsListDatabaseEvents<P, any>>).emit(eventName, ...args);
    }

    protected _getChannelIdByDatabaseKey(key: TSwarmStoreDatabaseEntityKey<P>): TSwarmChannelId {
      const { getChannelIdByDatabaseKey } = this._getUtilities();
      return getChannelIdByDatabaseKey(key);
    }

    private __waitDatabaseWillBeOpenedSetListenersAndOpenedStatus(): void {
      void this.__swarmMessagesKeyValueDatabaseConnectionPending.then(
        (swarmMessagesDatabaseConnector: PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>) => {
          this.__setDatabaseConnection(swarmMessagesDatabaseConnector);
          this.__setCurrentDatabaseConnectionListeners();
          this.__emitDatabaseIsOpenedIfCurrentDatabaseConnectorIsReady();
        }
      );
    }

    private __rejectWithErrorSwarmMessagesKeyValueDatabaseConnectionPending(error: Error): void {
      this.__swarmMessagesKeyValueDatabaseConnectionPending.reject(error);
    }

    private async __closeCurrentDatabaseConnection(): Promise<void> {
      await this._databaseConnection.close();
    }

    private __setDatabaseConnection(
      databaseConnection: PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>
    ): void {
      this.__databaseConnectionOrUndefined = databaseConnection;
    }

    private __unsetDatabaseConnection(): void {
      this.__databaseConnectionOrUndefined = undefined;
    }

    private __setCurrentDatabaseConnectionListeners(): void {
      this.__setOrUnsetDatabaseEventsListeners(this._databaseConnection, true);
    }

    private __unsetCurrentDatabaseConnectionListeners(): void {
      this.__setOrUnsetDatabaseEventsListeners(this._databaseConnection, false);
    }

    private __stopConnectionPendingToACurrentDatabase(): void {
      this.__rejectWithErrorSwarmMessagesKeyValueDatabaseConnectionPending(
        this._getErrorForRejectingSwarmMessagesKeyValueDatabaseConnectionPendingOnCloseInstance()
      );
    }

    private __emitDatabaseConnectorIsReady() {
      this._emitEventDbHandler(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_DATABASE_READY);
    }

    private __emitDatabaseIsOpenedIfCurrentDatabaseConnectorIsReady(): void {
      if (this.__databaseConnectionOrUndefined?.isReady) {
        this.__emitDatabaseConnectorIsReady();
      }
    }

    private async _getSwarmMessagesKeyValueDatabaseConnection(): Promise<
      PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>
    > {
      const swarmMessagesKeyValueDatabaseConnection = this.__swarmMessagesKeyValueDatabaseConnectionPending;
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
      const getIsDatabaseOpened = (): boolean => this._isDatabaseReady;
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
      if (!this._isDatabaseReady) {
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

    private __handleDatabaseReadyToUse = (): void => {
      this.__emitDatabaseConnectorIsReady();
    };
    private __handleDatabaseClosedUnexpected = (): void => {
      this.__unsetCurrentDatabaseConnectionListeners();
      this.__unsetDatabaseConnection();
      this._restartDatabaseConnection();
    };

    private __handleDatabaseDroppedUnexpected = (): void => {
      this.__handleDatabaseClosedUnexpected();
    };

    private __handleMessageAddedInDatabase = async (
      dbName: string,
      message: MD,
      // the global unique address (hash) of the message in the swarm
      messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
      // for key-value store it will be the key
      key?: TSwarmStoreDatabaseEntityKey<P>
    ): Promise<void> => {
      try {
        const channelDescription = await this._getValidSwarmMessagesChannelDescriptionFromSwarmMessageBody(message.bdy);
        this._emitEventDbHandler(ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE, channelDescription);
      } catch (err) {
        console.error(`__handleMessageAddedInDatabase`, err);
        throw err;
      }
    };

    private __handleMessageRemovedFromDatabase = (
      dbName: string,
      // the user who removed the message
      userId: TSwarmMessageUserIdentifierSerialized,
      // the global unique address (hash) of the DELETE message in the swarm
      messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
      // the global unique address (hash) of the DELETED message in the swarm
      messageDeletedAddress: TSwarmStoreDatabaseEntityAddress<P> | undefined,
      // for key-value store it will be the key for the value,
      // for feed store it will be hash of the message which deleted by this one.
      key: TSwarmStoreDatabaseEntityKey<P>
    ): void => {
      this._emitEventDbHandler(
        ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED,
        this._getChannelIdByDatabaseKey(key)
      );
    };

    private __setOrUnsetDatabaseEventsListeners(
      databaseConnection: PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>,
      isSetListeners: boolean
    ): void {
      const eventEmitterMethodName = isSetListeners ? 'addListener' : 'removeListener';

      databaseConnection.emitter[eventEmitterMethodName as 'addListener'](
        ESwarmStoreEventNames.READY,
        this.__handleDatabaseReadyToUse
      );
      databaseConnection.emitter[eventEmitterMethodName as 'addListener'](
        ESwarmStoreEventNames.CLOSE_DATABASE,
        this.__handleDatabaseClosedUnexpected
      );
      databaseConnection.emitter[eventEmitterMethodName as 'addListener'](
        ESwarmStoreEventNames.DROP_DATABASE,
        this.__handleDatabaseDroppedUnexpected
      );
      databaseConnection.emitter[eventEmitterMethodName as 'addListener'](
        ESwarmMessageStoreEventNames.DELETE_MESSAGE,
        this.__handleMessageRemovedFromDatabase
      );
      databaseConnection.emitter[eventEmitterMethodName as 'addListener'](
        ESwarmMessageStoreEventNames.NEW_MESSAGE,
        this.__handleMessageAddedInDatabase
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
