import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/index';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../../../../swarm-message/index';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess, ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric, ISwarmMessagesChannelsDescriptionsList } from '../../../../../types/swarm-messages-channels-list-instance.types';
export declare function getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>, CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>, OFCAF extends Pick<ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>, 'description' | 'connectionOptions'> & {
    utilities: {
        serializer: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['utilities']['serializer'];
    };
    validators: {
        jsonSchemaValidator: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['validators']['jsonSchemaValidator'];
    };
}>(databaseConnectionFabric: CF, optionsForConstructorArgumentsFabric: OFCAF): ISwarmMessagesChannelsDescriptionsList<ESwarmStoreConnector, T, MD>;
//# sourceMappingURL=swarm-messages-channels-list-v1-instance-fabric-default.d.ts.map