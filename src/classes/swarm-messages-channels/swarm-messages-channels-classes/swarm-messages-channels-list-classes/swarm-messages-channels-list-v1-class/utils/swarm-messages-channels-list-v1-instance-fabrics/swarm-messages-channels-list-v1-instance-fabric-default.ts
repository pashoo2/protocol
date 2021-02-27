import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/index';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../../../../swarm-message/index';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../../../../types/swarm-messages-channels-list-instance.types';
import {
  ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric,
  ISwarmMessagesChannelsDescriptionsList,
} from '../../../../../types/swarm-messages-channels-list-instance.types';
import { getSwarmMessagesChannelsListVersionOneInstance } from '../../swarm-messages-channels-list-v1-instance.fabric';
import {
  IAdditionalUtils,
  IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator,
} from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { getSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandlerClass } from '../../subclasses/swarm-messages-channels-list-v1-db-connection-initializer-and-handler/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.fabric';
import { getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault } from '../swarm-messages-channels-list-v1-constructor-arguments-fabrics/swarm-messages-channels-list-v1-constructor-arguments-fabric';
import { getIConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp as getConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from '../../subclasses/swarm-messages-channels-list-v1-class-options-setup/swarm-messages-channels-list-v1-class-options-setup';
import { ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator } from '../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
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
 *     >)} optionsForConstructorArgumentsFabric
 * @param {CF} connectionFabtic
 * @returns {{}}
 */
export function getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>,
  OFCAF extends Pick<
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>,
    'description' | 'connectionOptions'
  > & {
    utilities: {
      serializer: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>['utilities']['serializer'];
    };
    validators: {
      jsonSchemaValidator: ISwarmMessagesChannelsDescriptionsListConstructorArguments<
        P,
        T,
        MD,
        CTX,
        DBO,
        CF
      >['validators']['jsonSchemaValidator'];
    };
  }
>(
  // This one can be used for creation of the datbaase conneciton fabric
  // src/classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-classes/swarm-messages-channels-list-v1-classes/utils/swarm-messages-channels-list-v1-constructor-arguments-fabrics/swarm-messages-channels-list-v1-database-connection-fabric.ts
  databaseConnectionFabric: CF,
  optionsForConstructorArgumentsFabric: OFCAF
): ISwarmMessagesChannelsDescriptionsList<ESwarmStoreConnector, T, MD> {
  // this constant is added to have the reference to it's type
  const createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorUtil = createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator as ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator<
    P,
    T,
    MD,
    CTX,
    DBO
  >;
  const additionalUtils: IAdditionalUtils<P, T, MD, CTX, DBO> = {
    getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator: getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator as IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<
      P,
      T,
      MD,
      CTX,
      DBO
    >,
    getArgumentsForSwarmMessageWithChannelDescriptionValidator: getArgumentsForSwarmMessageWithChannelDescriptionValidator,
    createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator: createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorUtil,
  };
  const SwarmMessagesChannelsListVersionOneOptionsSetUp = getConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<
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
    ...optionsForConstructorArgumentsFabric,
    databaseConnectionFabric,
  };
  const constructorArguments = getSwarmMessagesChannelsListVersionOneConstructorOptionsDefault<P, T, MD, CTX, DBO, CF, OFCAF>(
    options
  );
  const swarmMessagesChannelsListV1Instance = getSwarmMessagesChannelsListVersionOneInstance<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
  >(constructorArguments, SwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler);
  return swarmMessagesChannelsListV1Instance;
}
