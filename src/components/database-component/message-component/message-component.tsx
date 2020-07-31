import React from 'react';
import { ISwarmMessageInstanceDecrypted } from '../../../classes/swarm-message/swarm-message-constructor.types';

export interface IMessageComponentProps {
  id: string;
  dbName: string;
  message: ISwarmMessageInstanceDecrypted;
}

export class MessageComponent extends React.PureComponent<
  IMessageComponentProps
> {
  get payload() {
    return this.props.message.bdy.pld;
  }

  get senderId() {
    return this.props.message.uid;
  }

  render() {
    const { id } = this.props;
    return (
      <div style={{ border: '1px solid black' }}>
        <span>
          {id}; From: {this.senderId}
        </span>
        <div>{this.payload}</div>
      </div>
    );
  }
}
