import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ConstructorType } from 'types/helper.types';
import { ISwarmMessageStoreDbOptionsGrandAccessCallbackContext } from '../../../../../../types/swarm-message-store-db-options.types';
import { ISwarmMessageConstructor } from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams } from './swarm-message-store-conector-db-options-grand-access-context-class.types';
export declare function getSwarmStoreConectorDbOptionsGrandAccessContextClass<SMC extends ISwarmMessageConstructor, BC extends ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext>>(BaseContext: BC, params: ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams<SMC>): BC & ConstructorType<ISwarmMessageStoreDbOptionsGrandAccessCallbackContext<SMC>>;
//# sourceMappingURL=swarm-message-store-conector-db-options-grand-access-context-class.d.ts.map