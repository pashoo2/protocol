import React from 'react';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
export interface IMessageComponentProps<P extends ESwarmStoreConnector> {
    id: TSwarmStoreDatabaseEntityKey<P>;
    k?: string;
    dbName: string;
    message: ISwarmMessageInstanceDecrypted;
    deleteMessage?(id: TSwarmStoreDatabaseEntityKey<P>, message: ISwarmMessageInstanceDecrypted, key: string | undefined): Promise<void>;
}
export declare class MessageComponent<P extends ESwarmStoreConnector> extends React.PureComponent<IMessageComponentProps<P>> {
    get payload(): string;
    get senderId(): string;
    delete: () => void;
    render(): JSX.Element;
}
//# sourceMappingURL=message-component.d.ts.map