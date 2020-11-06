import React from 'react';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';

export interface IMessageComponentProps<P extends ESwarmStoreConnector> {
  id: TSwarmStoreDatabaseEntityKey<P>;
  k?: string;
  dbName: string;
  message: ISwarmMessageInstanceDecrypted;
  deleteMessage?(
    id: TSwarmStoreDatabaseEntityKey<P>,
    message: ISwarmMessageInstanceDecrypted,
    key: string | undefined
  ): Promise<void>;
}

export class MessageComponent<P extends ESwarmStoreConnector> extends React.PureComponent<IMessageComponentProps<P>> {
  get payload() {
    return this.props.message.bdy.pld;
  }

  get senderId() {
    return this.props.message.uid;
  }

  delete = () => {
    const { deleteMessage, id, message, k } = this.props;

    deleteMessage?.(id, message, k);
  };

  render() {
    const { id, k } = this.props;
    return (
      <div style={{ border: '1px solid black' }}>
        <span>
          {id}; {k && `Key: ${k}`}; From: {this.senderId}
        </span>
        <div>{this.payload}</div>
        <button onClick={this.delete}>Delete</button>
      </div>
    );
  }
}
