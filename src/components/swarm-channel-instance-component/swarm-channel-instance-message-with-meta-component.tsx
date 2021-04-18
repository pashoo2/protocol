import React from 'react';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../classes/swarm-message-store/types/swarm-message-store.types';

type P = ESwarmStoreConnector.OrbitDB;

interface ISwarmChannelInstanceMessageComponentProps<MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted> {
  swarmMessageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector, MD>;
}

export function SwarmChannelInstanceMessageComponent<MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted>({
  swarmMessageWithMeta,
}: ISwarmChannelInstanceMessageComponentProps<MD>): React.ReactElement {
  const { messageAddress, key, message } = swarmMessageWithMeta;
  const messageMetaRenderResult = (
    <div>
      <p>Address: {messageAddress}</p>
      <p>Key: {key}</p>
    </div>
  );
  let messageDescriptionRenderResult: React.ReactElement;

  if (message instanceof Error) {
    messageDescriptionRenderResult = <p>Error: {message.message}</p>;
  } else {
    const { uid, bdy } = message;
    messageDescriptionRenderResult = (
      <div>
        <p>From {uid}</p>
        <p>Time: {bdy.ts}</p>
        <p>Text: {bdy.pld}</p>
        <details>
          <p>Receiver id: {bdy.receiverId}</p>
          <p>Issuer: {bdy.iss}</p>
          <p>Type: {bdy.typ}</p>
        </details>
      </div>
    );
  }
  // TODO - render messages
  debugger;
  return (
    <div>
      {messageMetaRenderResult}
      {messageDescriptionRenderResult}
      <hr />
    </div>
  );
}
