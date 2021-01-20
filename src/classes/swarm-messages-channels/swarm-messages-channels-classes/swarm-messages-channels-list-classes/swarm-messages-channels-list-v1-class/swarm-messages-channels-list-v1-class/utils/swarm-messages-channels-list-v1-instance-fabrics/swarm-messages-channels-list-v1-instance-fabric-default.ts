import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../../../../../swarm-message';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../../../../../types/swarm-messages-channels-list.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric } from '../../../../../../types/swarm-messages-channels-list.types';
import { getSwarmMessagesChannelsListVersionOneInstance } from '../../swarm-messages-channels-list-v1-instance.fabric';
import {
  IAdditionalUtils,
  IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator,
} from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { getSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandlerClass } from '../../subclasses/swarm-messages-channels-list-v1-db-connection-initializer-and-handler/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.fabric';
import { getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault } from '../swarm-messages-channels-list-v1-constructor-arguments-fabrics/swarm-messages-channels-list-v1-constructor-arguments-fabric';
import { getIConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from '../../subclasses/swarm-messages-channels-list-v1-class-options-setup/swarm-messages-channels-list-v1-class-options-setup';
import {
  getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
  getArgumentsForSwarmMessageWithChannelDescriptionValidator,
  createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator,
} from '../../subclasses/swarm-messages-channels-list-v1-db-connection-initializer-and-handler/utils/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.utils';

/**
 * Constructs instance of swarm messages channels list v1 instance
 *
 * @export
 * @template P
 * @template T
 * @template MD
 * @template CTX
 * @template DBO
 * @template CF
 * @param {(Pick<
 *     ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>,
 *     'description' | 'serializer'
 *   > &
 *     Pick<
 *       ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>,
 *       'description' | 'serializer' | 'connectionOptions'
 *     >)} optionsConstructorArgumentsFabric
 * @param {CF} connectionFabtic
 * @returns {{}}
 */
export function getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>
>(
  optionsConstructorArgumentsFabric: Pick<
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>,
    'description' | 'serializer'
  > &
    Pick<
      ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>,
      'description' | 'serializer' | 'connectionOptions'
    >,
  // This one can be used for creation of the datbaase conneciton fabric
  // src/classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-class/swarm-messages-channels-list-v1-class/utils/swarm-messages-channels-list-v1-constructor-arguments-fabrics/swarm-messages-channels-list-v1-database-connection-fabric.ts
  databaseConnectionFabric: CF
) {
  const additionalUtils: IAdditionalUtils<P, T, MD, CTX, DBO> = {
    getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator: getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator as IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<
      P,
      T,
      MD,
      CTX,
      DBO
    >,
    getArgumentsForSwarmMessageWithChannelDescriptionValidator: getArgumentsForSwarmMessageWithChannelDescriptionValidator,
    createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator,
  };
  const SwarmMessagesChannelsListVersionOneOptionsSetUp = getIConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
  >();
  const SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler = getSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandlerClass<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
  >(SwarmMessagesChannelsListVersionOneOptionsSetUp, additionalUtils);
  const options = {
    ...optionsConstructorArgumentsFabric,
    databaseConnectionFabric,
  };
  const constructorArguments = getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault<P, T, MD, CTX, DBO, CF>(options);
  return getSwarmMessagesChannelsListVersionOneInstance<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
  >(constructorArguments, SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler);
}
