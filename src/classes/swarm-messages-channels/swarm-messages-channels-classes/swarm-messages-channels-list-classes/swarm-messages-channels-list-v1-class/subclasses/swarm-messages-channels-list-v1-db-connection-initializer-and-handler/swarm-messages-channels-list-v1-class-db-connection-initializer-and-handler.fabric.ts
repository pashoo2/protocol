import assert from 'assert';
import {
  isNonNativeFunction,
  isDefined,
  mergeMaps,
  createRejectablePromiseByNativePromise,
  whetherTwoMapsSimilar,
} from 'utils/common-utils';

import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelDescriptionWithMetadata,
} from '../../../../../types/swarm-messages-channel-instance.types';
import { PromiseResolveType, IPromisePendingRejectable, IPromiseRejectable } from '../../../../../../../types/promise.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  DBOFULL,
  ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric,
} from '../../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../../../types/swarm-messages-channels-list-instance.types';
import { createImmutableObjectClone } from '../../../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import { IAdditionalUtils } from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { ISwarmMessagesChannelsListV1GrantAccessConstantArguments } from '../../types/swarm-messages-channels-list-v1-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from '../../types/swarm-messages-channels-list-v1-class-options-setup.types';
import { IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler } from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import {
  TSwarmMessageConstructorBodyMessage,
  ISwarmMessageBody,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseIteratorMethodArgument,
  TSwarmStoreDatabaseEntityUniqueIndex,
} from '../../../../../../swarm-store-class/swarm-store-class.types';
import { SwarmMessagesChannelDescriptionWithMeta } from '../../../../../swarm-messages-channels-subclasses/swarm-messages-channel-description-with-meta/swarm-messages-channel-description-with-meta';
import {
  ISwarmMessageStoreMessagingRequestWithMetaResult,
  ISwarmMessageStoreDeleteMessageArg,
} from '../../../../../../swarm-message-store/types/swarm-message-store.types';
import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
} from '../../../../../../swarm-store-class/swarm-store-class.types';
import { getEventEmitterInstance } from '../../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessageStoreEventNames } from '../../../../../../swarm-message-store/swarm-message-store.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import {
  ESwarmMessagesChannelsListEventName,
  ISwarmMessagesChannelsListEvents,
} from '../../../../../types/swarm-messages-channels-list-events.types';
import {
  EventEmitter,
  TTypedEmitter,
} from '../../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ISwarmMessagesChannelsListDatabaseEvents } from '../../../../../types/swarm-messages-channels-list-events.types';
import { TSwarmMessageDatabaseMessagesCached } from '../../../../../../swarm-messages-database/swarm-messages-database.types';
import { TSwarmMessagesChannelId } from '../../../../../types/swarm-messages-channel-instance.types';
import { ESwarmMessagesDatabaseCacheEventsNames } from '../../../../../../swarm-messages-database/swarm-messages-database.const';
import { debounce } from 'utils/throttling-utils';
import { EMIT_CHANNELS_DESCRIPTIONS_MAP_CACHE_UPDATE_EVENT_DEBOUNCE_MS } from './swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.fabric.const';
import { compareTwoSwarmMessageStoreMessagingRequestWithMetaResults } from '../../../../../../swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-cache/swarm-messages-database-cache.utils';
import { dataCachingUtilsCachingDecoratorGlobalCachePerClass } from '../../../../../../../utils/data-cache-utils/data-cache-utils-caching-decorator-global-cache-per-class/data-cache-utils-caching-decorator-global-cache-per-class';
import { getSwarmMessageUniqueHash } from '../../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
import {
  ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache,
  ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams,
} from '../../../../../types/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types';

export function getRequestResultMessageUniqueIdOrUndefined(
  requestResult: ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector, ISwarmMessageInstanceDecrypted>
) {
  if (requestResult.message instanceof Error) {
    return undefined;
  }
  return getSwarmMessageUniqueHash(requestResult.message);
}

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
    protected get _emitterDatabaseHandler(): TTypedEmitter<ISwarmMessagesChannelsListDatabaseEvents<P, T, any>> {
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
      return Boolean(this.__databaseConnectionOrUndefined?.isReady);
    }

    protected get _swarmChannelsDescriptionsCachedMap(): Readonly<
      Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
    > {
      return this.__swarmChannelsDescriptionsCachedMap;
    }

    /**
     * This is list of swarm messages for current
     * swarm channels descriptions cached map.
     *
     * @private
     * @type {TSwarmMessageDatabaseMessagesCached<
     *       P,
     *       ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
     *       MD
     *     >}
     * @memberof SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler
     */
    private __swarmMessagesForCurrentUpdateOfDescriptionsCachedMap?: TSwarmMessageDatabaseMessagesCached<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
      MD
    >;

    private readonly __additionalUtils: Readonly<IAdditionalUtils<P, T, MD, CTX, DBO>>;

    private get _additionalUtils(): Readonly<IAdditionalUtils<P, T, MD, CTX, DBO>> {
      const additionalUtils = this.__additionalUtils;
      if (!additionalUtils) {
        throw new Error('Additional utilities for the instance are not exists');
      }
      return additionalUtils;
    }

    private readonly __emitter: TTypedEmitter<ISwarmMessagesChannelsListDatabaseEvents<P, T, any>> =
      getEventEmitterInstance<ISwarmMessagesChannelsListEvents<P, T, any>>();

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

    /**
     * Immutable cache of swarm messages channels list.
     * Is updated in realtime by removing/adding event
     * of a channel's list database.
     *
     * Cache must be updated before events aboout adding/removing channel description
     * will be emitted because of a consistency reasons.
     *
     * @private
     * @type {Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any>>}
     * @memberof SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler
     */
    private __swarmChannelsDescriptionsCachedMap: Readonly<
      Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
    > = new Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>();

    private readonly __fabricSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache: CARGS['utilities']['getSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache'];

    /**
     * If an active swarm channels descriptions cached map
     * update process is in progress then this property will
     * be set to a promise that is responsible to this update
     * process.
     * Before add any description to the cached descriptions map
     * method must wait for this promise. If this promise will be
     * cancelled, then adding of the channel description must
     * be cancelled too, because it means that a newer descriptions
     * will be set into the cached map.
     *
     * @private
     * @type {(Promise<void> | undefined)}
     * @memberof SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler
     */
    private __swarmChannelsDescriptionsCachedMapActiveUpdatePromise: IPromiseRejectable<unknown, Error> | undefined;

    constructor(constructorArguments: CARGS) {
      super(constructorArguments);
      this._validateAdditionalUtils(additionalUtils);
      this.__fabricSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache =
        constructorArguments.utilities.getSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache;
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

      this.__resetInstanceOnDatabaseClosedExpectedly();
      await promiseCloseCurrentDatabaseConnection;
    }

    protected async _dropDatabase(): Promise<void> {
      this.__unsetCurrentDatabaseConnectionListeners();

      const databaseConnection = await this._getSwarmMessagesKeyValueDatabaseConnection();

      this.__stopConnectionPendingToACurrentDatabase();
      this.__resetInstanceOnDatabaseClosedExpectedly();
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
      const swarmMessagesChannelsDescriptionsOrErrors =
        await this._convertDatabaseRequestResultIntoSwarmChannelsDescriptionsWithMeta(messagesReadFromDatabase);
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

    protected _emitEventDbHandler<E extends keyof ISwarmMessagesChannelsListDatabaseEvents<P, T, any>>(
      eventName: E,
      ...args: Parameters<ISwarmMessagesChannelsListDatabaseEvents<P, T, any>[E]>
    ): void {
      (this.__emitter as EventEmitter<ISwarmMessagesChannelsListDatabaseEvents<P, T, any>>).emit(eventName, ...args);
    }

    protected _getChannelIdByDatabaseKey(key: TSwarmStoreDatabaseEntityKey<P>): TSwarmMessagesChannelId {
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

    private __setSwarmMessagesForCurrentUpdateOfDescriptionsCachedMap(
      cachedMessages: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>
    ): void {
      this.__swarmMessagesForCurrentUpdateOfDescriptionsCachedMap = cachedMessages;
    }

    private __unsetSwarmMessagesForCurrentUpdateOfDescriptionsCachedMap(): void {
      this.__swarmMessagesForCurrentUpdateOfDescriptionsCachedMap = undefined;
    }

    private __whetherCurrentSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(
      cachedMessages: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>
    ): boolean {
      const swarmMessagesForCurrentUpdateOfDescriptionsCachedMapCurrentList =
        this.__swarmMessagesForCurrentUpdateOfDescriptionsCachedMap;
      if (!swarmMessagesForCurrentUpdateOfDescriptionsCachedMapCurrentList) {
        return false;
      }
      return whetherTwoMapsSimilar<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>>(
        swarmMessagesForCurrentUpdateOfDescriptionsCachedMapCurrentList,
        cachedMessages,
        compareTwoSwarmMessageStoreMessagingRequestWithMetaResults
      );
    }

    private __unsetSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(
      cachedMessages: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>
    ): void {
      if (this.__whetherCurrentSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(cachedMessages)) {
        this.__unsetSwarmMessagesForCurrentUpdateOfDescriptionsCachedMap();
      }
    }

    private __setCurrentSwarmMessagesChannelsDescriptiopnsCachedMap(
      swarmChannelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
    ): void {
      this.__swarmChannelsDescriptionsCachedMap = swarmChannelsDescriptionsMap;
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private __emitChannelsDescriptionsMapCacheUpdateEvent = debounce((): void => {
      this._emitEventDbHandler(
        ESwarmMessagesChannelsListEventName.CHANNELS_CACHE_UPDATED,
        this.__swarmChannelsDescriptionsCachedMap
      );
    }, EMIT_CHANNELS_DESCRIPTIONS_MAP_CACHE_UPDATE_EVENT_DEBOUNCE_MS);

    private __setCurrentSwarmMessagesChannelsDescriptiopnsCachedMapAndEmitCacheUpdateEvent = (
      swarmChannelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
    ): void => {
      this.__setCurrentSwarmMessagesChannelsDescriptiopnsCachedMap(swarmChannelsDescriptionsMap);
      this.__emitChannelsDescriptionsMapCacheUpdateEvent();
    };

    private __clearCurrentSwarmMessagesChannelsDescriptiopnsCachedMap(): void {
      this.__swarmChannelsDescriptionsCachedMap.clear();
    }

    private __mergeAndSetSwarmMessagesChannelsDescriptiopnsCachedMap(
      swarmChannelsDescriptionsMapToMerge: Map<
        TSwarmMessagesChannelId,
        ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error
      >
    ): void {
      const copyCachedMerged = mergeMaps(
        this.__getCopyCurrentSwarmMessagesChannelsDescriptionsCachedMap(),
        swarmChannelsDescriptionsMapToMerge
      );
      this.__setCurrentSwarmMessagesChannelsDescriptiopnsCachedMap(copyCachedMerged);
    }

    private __mergeSetAndEmitSwarmMessagesChannelsDescriptionsCachedMapUpdateEvent(
      swarmChannelsDescriptionsMapToMerge: Map<
        TSwarmMessagesChannelId,
        ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error
      >
    ): void {
      this.__mergeAndSetSwarmMessagesChannelsDescriptiopnsCachedMap(swarmChannelsDescriptionsMapToMerge);
      this.__emitChannelsDescriptionsMapCacheUpdateEvent();
    }

    private __setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseAndReturnCancellable<T>(
      promiseChannelsDescriptionsMapUpdate: Promise<T>
    ): IPromiseRejectable<T, Error> {
      const promisePendingRejectable = createRejectablePromiseByNativePromise<T, Error>(promiseChannelsDescriptionsMapUpdate);
      this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise = promisePendingRejectable;
      return promisePendingRejectable;
    }

    private __unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise(): void {
      this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise = undefined;
    }

    private __unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseIfEqualsTo(
      promiseCancellableWaitingFor: IPromiseRejectable<unknown, Error>
    ): void {
      if (this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise === promiseCancellableWaitingFor) {
        this.__unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise();
      }
    }

    private __setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseReturnItAndUnsetOnFinish<T>(
      promiseChannelsDescriptionsMapUpdate: Promise<T>
    ): IPromiseRejectable<T, Error> {
      const promiseCancellableWaitingFor =
        this.__setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseAndReturnCancellable(
          promiseChannelsDescriptionsMapUpdate
        );
      promiseCancellableWaitingFor.finally(() => {
        this.__unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseIfEqualsTo(promiseCancellableWaitingFor);
      });
      return promiseCancellableWaitingFor;
    }

    private __rejectCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise(error?: Error): void {
      const swarmChannelsDescriptionsCachedMapActiveUpdatePromise = this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise;
      if (swarmChannelsDescriptionsCachedMapActiveUpdatePromise) {
        swarmChannelsDescriptionsCachedMapActiveUpdatePromise.reject(error || new Error('Rejected by unknown reason'));
      }
      this.__unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise();
    }

    /**
     * Helps only only without if a queue of a pending promises
     * is not neccessary.
     *
     * Really queue can be achived only with usage of the pattern into a function
     * which set the this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise in the
     * current event loop, right when the  this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise
     * unset.
     * while (this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise) {
     *    await this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise;
     *  }
     *
     * @private
     * @returns {Promise<void>}
     * @memberof SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler
     */
    private async __waitTillCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdating(): Promise<void> {
      await this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise;
    }

    private __resetInstanceOnDatabaseClosedExpectedly(): void {
      this.__unsetDatabaseConnection();
      this.__clearCurrentSwarmMessagesChannelsDescriptiopnsCachedMap();
      this.__rejectWithErrorSwarmMessagesKeyValueDatabaseConnectionPending(new Error('Database connection is closed'));
      this.__unsetCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise();
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

    private __getChannelDescriptionBySwarmMessageDecrypted = async (
      swarmMessageDecrypted: MD
    ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any>> => {
      return await this._getValidSwarmMessagesChannelDescriptionFromSwarmMessageBody(swarmMessageDecrypted.bdy);
    };

    @dataCachingUtilsCachingDecoratorGlobalCachePerClass(
      2, // TODO - after checking GET_SWARM_CHANNEL_DESCRIPTION_RAW_BY_SWARM_DB_REQUEST_RESULT_CACHED_ITEMS_COUNT_LIMIT,
      getRequestResultMessageUniqueIdOrUndefined
    )
    private async _getSwarmChannelDescriptionRawBySwarmDbRequestResult(
      requestResult: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>
    ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any>> {
      const messageDecryptedOrError = requestResult.message;

      if (messageDecryptedOrError instanceof Error) {
        throw new Error(`${messageDecryptedOrError.message}`);
      }
      const swarmMessagesChannelDescriptionDeserialized = await this.__getChannelDescriptionBySwarmMessageDecrypted(
        messageDecryptedOrError
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
        getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription:
          getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription,
        getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription:
          getTypeForSwarmMessageWithChannelDescriptionByChannelDescription,
        getDatabaseKeyForChannelDescription,
        channelDescriptionFormatValidator: swarmMessagesChannelDescriptionValidator,
        parseChannelDescription: this._deserializeChannelDescriptionRaw.bind(this),
      };
    }

    private __getArgumentsForFabricSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache(): ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<
      P,
      T,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
      DBOFULL<P, T, MD, CTX, DBO>,
      MD
    > {
      return {
        getChannelDescriptionBySwarmMessage: this.__getChannelDescriptionBySwarmMessageDecrypted,
      };
    }

    private __createSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache(): ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<
      P,
      T,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
      DBOFULL<P, T, MD, CTX, DBO>,
      MD
    > {
      const swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache =
        this.__fabricSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache(
          this.__getArgumentsForFabricSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache()
        );
      return swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache;
    }

    private _createGrantAccessCallbackForChannelsListDatabase(): DBO['grantAccess'] {
      const argumentsConstant = this._getConstantArgumentsForGrantAccessCallbackValidator();
      const { channelDescriptionSwarmMessageValidator } = this._getValidators();
      const {
        createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator,
        getArgumentsForSwarmMessageWithChannelDescriptionValidator,
        getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
      } = this._additionalUtils;
      const swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache =
        this.__createSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache();
      const params = {
        constantArguments: argumentsConstant,
        swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache,
        channelDescriptionSwarmMessageValidator,
        getArgumentsForSwarmMessageWithChannelDescriptionValidator,
        getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
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
      return {
        ...dbOptions,
        dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
        dbName: databaseName,
        grantAccess: databaseGrantAccessCallback,
        // we need to preload all values in cache to make it possible to read values
        // cached from grant access callback
        preloadCount: -1,
      } as unknown as DBOFULL<P, T, MD, CTX, DBO>;
    }

    private __getNewSwarmMessagesChannelsDescriptiopnsCachedMap(): Map<
      TSwarmMessagesChannelId,
      ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error
    > {
      return new Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>();
    }

    private __getCopyCurrentSwarmMessagesChannelsDescriptionsCachedMap(): Map<
      TSwarmMessagesChannelId,
      ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error
    > {
      return new Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>(
        this.__swarmChannelsDescriptionsCachedMap as Map<
          TSwarmMessagesChannelId,
          ISwarmMessageChannelDescriptionRaw<P, T, any, any>
        >
      );
    }

    private async __addSwarmChannelDescriptionToSwarmChannelsDescriptionsMapBySwarmMessage(
      swarmChannelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>,
      swarmMessage: MD,
      swarmMessageDatabaseKey: TSwarmStoreDatabaseEntityUniqueIndex<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
    ): Promise<void> {
      const swarmChannelDescription = await this.__getChannelDescriptionBySwarmMessageDecrypted(swarmMessage);
      const swarmChannelId = this._getChannelIdByDatabaseKey(swarmMessageDatabaseKey);

      swarmChannelsDescriptionsMap.set(swarmChannelId, swarmChannelDescription);
    }

    private __addErrorToSwarmChannelsDescriptionsMap(
      swarmChannelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>,
      error: Error,
      swarmMessageDatabaseKey: TSwarmStoreDatabaseEntityUniqueIndex<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
    ) {
      const swarmChannelId = this._getChannelIdByDatabaseKey(swarmMessageDatabaseKey);

      swarmChannelsDescriptionsMap.set(swarmChannelId, error);
    }

    private async __addSwarmChannelDescriptionOrErrorIfRejectedToSwarmChannelsDescriptionsMapBySwarmMessage(
      swarmChannelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>,
      swarmMessage: MD,
      swarmMessageDatabaseKey: TSwarmStoreDatabaseEntityUniqueIndex<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
    ): Promise<void> {
      return await this.__addSwarmChannelDescriptionToSwarmChannelsDescriptionsMapBySwarmMessage(
        swarmChannelsDescriptionsMap,
        swarmMessage,
        swarmMessageDatabaseKey
      ).catch((errorOccurred) =>
        this.__addErrorToSwarmChannelsDescriptionsMap(swarmChannelsDescriptionsMap, errorOccurred, swarmMessageDatabaseKey)
      );
    }

    private __deleteSwarmChannelDescriptionFromSwarmChannelsDescriptionsMapCachedBySwarmMessage(
      swarmChannelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>,
      swarmMessageDatabaseKey: TSwarmStoreDatabaseEntityUniqueIndex<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
    ) {
      const swarmChannelId = this._getChannelIdByDatabaseKey(swarmMessageDatabaseKey);

      swarmChannelsDescriptionsMap.delete(swarmChannelId);
    }

    private async __updateCachedChannelsListByCachedMessages(
      cachedMessages: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>
    ): Promise<Map<string, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>> {
      const updatedChannelsListDescriptionsCached = this.__getNewSwarmMessagesChannelsDescriptiopnsCachedMap();
      const swarmMessagesConvertationsToChannelsDescriptionsAndAddingToCachePending: Promise<void>[] = [];

      cachedMessages.forEach((swarmMessageWithDescription, swarmMessageKeyInKVDatabase) => {
        const swarmMessageOrError = swarmMessageWithDescription.message;

        if (swarmMessageOrError instanceof Error) {
          this.__addErrorToSwarmChannelsDescriptionsMap(
            updatedChannelsListDescriptionsCached,
            swarmMessageOrError,
            swarmMessageKeyInKVDatabase
          );
          return;
        }

        const pendingAddChannelDescription =
          this.__addSwarmChannelDescriptionOrErrorIfRejectedToSwarmChannelsDescriptionsMapBySwarmMessage(
            updatedChannelsListDescriptionsCached,
            swarmMessageOrError,
            swarmMessageKeyInKVDatabase
          );

        swarmMessagesConvertationsToChannelsDescriptionsAndAddingToCachePending.push(pendingAddChannelDescription);
      });
      await Promise.all(swarmMessagesConvertationsToChannelsDescriptionsAndAddingToCachePending);
      return updatedChannelsListDescriptionsCached;
    }

    private __updateChannelsMapCachedByPromisePendingResultOrHandleRejection(
      cachedMessages: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>,
      promisePendingRejectable: IPromiseRejectable<Map<string, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>, Error>
    ): void {
      void promisePendingRejectable
        .then(this.__setCurrentSwarmMessagesChannelsDescriptiopnsCachedMapAndEmitCacheUpdateEvent)
        .catch(
          ((instance, cachedMessagesClosure) =>
            function __updateChannelsMapCachedByPromiseHandleRejection() {
              instance.__unsetSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(cachedMessagesClosure);
            })(this, cachedMessages)
        );
    }

    private __updateChannelsMapCachedByCachedMessages(
      cachedMessages: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD>
    ): void {
      if (this.__whetherCurrentSwarmMessagesForCurrentUpdateOfDescriptionsCachedMapIfEqualsTo(cachedMessages)) {
        // TODO verify it works
        return;
      }
      this.__rejectCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromise(new Error('Rejected by new inconming update'));

      const updateChannelsDescriptionPromiseNative = this.__updateCachedChannelsListByCachedMessages(cachedMessages);
      const promisePendingRejectable =
        this.__setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseReturnItAndUnsetOnFinish(
          updateChannelsDescriptionPromiseNative
        );

      this.__updateChannelsMapCachedByPromisePendingResultOrHandleRejection(cachedMessages, promisePendingRejectable);
      this.__setSwarmMessagesForCurrentUpdateOfDescriptionsCachedMap(cachedMessages);
    }

    private __updateChannelsDescriptionsMapCachedByCurrentDatabaseConnection(): void {
      const cachedMessages = this.__databaseConnectionOrUndefined?.cachedMessages;

      if (cachedMessages) {
        this.__updateChannelsMapCachedByCachedMessages(cachedMessages);
      }
    }

    private async __addSwarmChannelDescriptionToTheChannelsDescriptionsMapCached(
      message: MD,
      key: TSwarmStoreDatabaseEntityKey<P>
    ): Promise<void> {
      while (this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise) {
        await this.__swarmChannelsDescriptionsCachedMapActiveUpdatePromise;
      }

      const temporaryMap = new Map();
      const cahceUpdatingPromise = this.__addSwarmChannelDescriptionOrErrorIfRejectedToSwarmChannelsDescriptionsMapBySwarmMessage(
        temporaryMap,
        message,
        key
      );

      const cahceUpdatingPromisePendingCancellable =
        this.__setCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdatingPromiseReturnItAndUnsetOnFinish(cahceUpdatingPromise);

      await cahceUpdatingPromisePendingCancellable;
      this.__mergeSetAndEmitSwarmMessagesChannelsDescriptionsCachedMapUpdateEvent(temporaryMap);
    }

    private async __deleteSwarmChannelDescriptionFromTheChannelsDescriptionsMapCached(
      key: TSwarmStoreDatabaseEntityKey<P>
    ): Promise<void> {
      await this.__waitTillCurrentSwarmMessagesChannelDescriptionsMapCahcedUpdating();

      const copyChannelsDescriptionsCachedMap = this.__getCopyCurrentSwarmMessagesChannelsDescriptionsCachedMap();

      this.__deleteSwarmChannelDescriptionFromSwarmChannelsDescriptionsMapCachedBySwarmMessage(
        copyChannelsDescriptionsCachedMap,
        key
      );
      this.__setCurrentSwarmMessagesChannelsDescriptiopnsCachedMapAndEmitCacheUpdateEvent(copyChannelsDescriptionsCachedMap);
    }

    private __handleDatabaseReadyToUse = (): void => {
      this.__emitDatabaseConnectorIsReady();
      this.__updateChannelsDescriptionsMapCachedByCurrentDatabaseConnection();
    };

    private __handleDatabaseCachedListUpdated = (
      messagesCached: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, MD> | undefined
    ): void => {
      if (messagesCached) {
        this.__updateChannelsMapCachedByCachedMessages(messagesCached);
      }
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
      if (!key) {
        throw new Error('A database key must be defined for a message with swarm channel description');
      }
      // for consistensy not wrapped in try catch, because if there if no channel in the cahce it should not be emitted.
      await this.__addSwarmChannelDescriptionToTheChannelsDescriptionsMapCached(message, key);
      try {
        const channelDescription = await this.__getChannelDescriptionBySwarmMessageDecrypted(message);
        this._emitEventDbHandler(ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE, channelDescription);
      } catch (err) {
        console.error(`__handleMessageAddedInDatabase`, err);
        throw err;
      }
    };

    private __handleMessageRemovedFromDatabase = async (
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
    ): Promise<void> => {
      // for consistensy not wrapped in try catch, because if there if no channel in the cahce it should not be emitted.
      await this.__deleteSwarmChannelDescriptionFromTheChannelsDescriptionsMapCached(key);
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
      databaseConnection.emitter[eventEmitterMethodName as 'addListener'](
        ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED,
        this.__handleDatabaseCachedListUpdated
      );
    }
  }
  // TODO - typescript issue https://github.com/microsoft/TypeScript/issues/22815
  // Abstract classes that implement interfaces shouldn't require method signatures
  return SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler as unknown as IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    CARGS
  >;
}
