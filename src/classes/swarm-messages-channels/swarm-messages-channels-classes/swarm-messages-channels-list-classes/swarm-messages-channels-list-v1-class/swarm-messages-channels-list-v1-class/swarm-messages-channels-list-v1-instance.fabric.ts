import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../../../types/swarm-messages-channels-list.types';
import { IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler } from './types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { ISwarmMessagesChannelsDescriptionsList } from '../../../../types/swarm-messages-channels-list.types';

import { getSwarmMessagesChannelsListVersionOneClass } from './swarm-messages-channels-list-v1-class.fabric';

export function getSwarmMessagesChannelsListVersionOneInstance<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO>
>(
  constructorArguments: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO>,
  ClassSwarmMessagesChannelsListVersionOneOptionsSetUp: IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
    P,
    T,
    MD,
    CTX,
    DBO,
    CARGS
  >
): ISwarmMessagesChannelsDescriptionsList<P, T, MD> {
  const Class = getSwarmMessagesChannelsListVersionOneClass<P, T, MD, CTX, DBO, CARGS>(
    ClassSwarmMessagesChannelsListVersionOneOptionsSetUp
  );
  return new Class(constructorArguments);
}
