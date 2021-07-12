import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments, TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric } from '../../../../../types/swarm-messages-channels-list-instance.types';
export declare function getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>, OFCAF extends Pick<ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>, 'description' | 'connectionOptions'> & {
    utilities: {
        serializer: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['utilities']['serializer'];
    };
    validators: {
        jsonSchemaValidator: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['validators']['jsonSchemaValidator'];
    };
}>(optionsPartial: OFCAF & Pick<ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['utilities'], 'databaseConnectionFabric'>): ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>;
//# sourceMappingURL=swarm-messages-channels-list-v1-constructor-arguments-fabric.d.ts.map