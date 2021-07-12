import { ESwarmStoreConnector, TSwarmStoreDatabaseEntryOperation } from '../../../../../swarm-store-class/index';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized, TSwarmMessageUserIdentifierSerialized } from '../../../../../swarm-message/index';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess, ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../../types/swarm-messages-channels-list-instance.types';
import { AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from './swarm-messages-channels-list-v1-class-options-setup.types';
import { ISwarmMessageChannelDescriptionRaw, ISwarmMessagesChannelDescriptionWithMetadata } from '../../../../types/swarm-messages-channel-instance.types';
import { TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseEntityAddress } from '../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageConstructorBodyMessage } from '../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric } from '../../../../types/swarm-messages-channels-list-instance.types';
import { TTypedEmitter } from '../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { ISwarmMessagesChannelsListDatabaseEvents } from '../../../../types/swarm-messages-channels-list-events.types';
import { TSwarmMessagesChannelId } from '../../../../types/swarm-messages-channel-instance.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache } from '../../../../types/swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types';
import { TSwarmStoreDatabaseOptions } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesChannelsListV1GrantAccessConstantArguments, ISwarmMessagesChannelsListV1GrantAccessVariableArguments } from './swarm-messages-channels-list-v1-class.types';
import { IValidatorOfSwarmMessageWithChannelDescription, IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../types/swarm-messages-channels-validation.types';
export interface IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> {
    ({ payload, userId, key, operation, time, }: {
        payload: T | MD;
        userId: TSwarmMessageUserIdentifierSerialized;
        key: string | undefined;
        operation?: TSwarmStoreDatabaseEntryOperation<P> | undefined;
        time: number;
    }): Omit<Required<ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, MD, CTX, DBO>>, 'channelExistingDescription'>;
}
export interface IGetArgumentsForSwarmMessageWithChannelDescriptionValidator<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> {
    (constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, MD, CTX, DBO>, variableArguments: Omit<Required<ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, MD, CTX, DBO>>, 'channelExistingDescription'>, channelExistingDescription: IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>['channelExistingDescription']): IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>;
}
export interface ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> {
    (params: ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments<P, T, MD, CTX, DBO>): DBO['grantAccess'];
}
export interface IAdditionalUtils<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> {
    createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator: ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator<P, T, MD, CTX, DBO>;
    getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator: IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<P, T, MD, CTX, DBO>;
    getArgumentsForSwarmMessageWithChannelDescriptionValidator: IGetArgumentsForSwarmMessageWithChannelDescriptionValidator<P, T, MD, CTX, DBO>;
}
export interface ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>> {
    constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, MD, CTX, DBO>;
    swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE> & DBO, MD>;
    channelDescriptionSwarmMessageValidator: IValidatorOfSwarmMessageWithChannelDescription<P, T, MD, CTX, DBO>;
    getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator: IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<P, T, MD, CTX, DBO>;
    getArgumentsForSwarmMessageWithChannelDescriptionValidator: IGetArgumentsForSwarmMessageWithChannelDescriptionValidator<P, T, MD, CTX, DBO>;
}
export declare abstract class AbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>, CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>> extends AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, MD, CTX, DBO, CF, CARGS> {
    protected abstract readonly _emitterDatabaseHandler: TTypedEmitter<ISwarmMessagesChannelsListDatabaseEvents<P, T, any>>;
    protected abstract readonly _isDatabaseReady: boolean;
    protected abstract readonly _swarmChannelsDescriptionsCachedMap: Readonly<Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>>;
    protected abstract _readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(dbbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined>;
    protected abstract _removeValueForDbKey(dbbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<void>;
    protected abstract _addSwarmMessageBodyInDatabase(dbKey: TSwarmStoreDatabaseEntityKey<P>, messageBody: TSwarmMessageConstructorBodyMessage): Promise<TSwarmStoreDatabaseEntityAddress<P>>;
    protected abstract _readAllChannelsDescriptionsWithMeta(): Promise<ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>[]>;
    protected abstract _closeDatabase(): Promise<void>;
    protected abstract _dropDatabase(): Promise<void>;
}
export interface IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>, CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>> {
    new (args: CARGS): AbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<P, T, MD, CTX, DBO, CF, CARGS>;
}
//# sourceMappingURL=swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types.d.ts.map