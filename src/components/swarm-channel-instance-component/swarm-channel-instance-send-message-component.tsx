import React, { useCallback, useEffect, useState } from 'react';
import { ISwarmMessagesChannel } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/types/connection-bridge.types';
import {
  TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric,
  TConnectionBridgeOptionsSwarmMessageStoreInstance,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric,
  TConnectionBridgeOptionsAccessControlOptions,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsConnectorFabricOptions,
  TConnectionBridgeOptionsGrandAccessCallback,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsProviderOptions,
  TConnectionBridgeOptionsConnectorMain,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsConnectorBasic,
  TConnectionBridgeOptionsConnectorConnectionOptions,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { timeout } from 'utils';

type P = ESwarmStoreConnector.OrbitDB;

interface SwarmChannelInstanceSendMessageComponentProps<
  DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<
    P,
    T,
    DbType,
    CD,
    DBO,
    MD,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  CD extends boolean = boolean,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized
> {
  swarmMessagesChannelInstance: ISwarmMessagesChannel<
    P,
    T,
    DbType,
    DBO,
    TConnectionBridgeOptionsConnectorBasic<CBO>,
    TConnectionBridgeOptionsConnectorConnectionOptions<CBO>,
    TConnectionBridgeOptionsProviderOptions<CBO>,
    TConnectionBridgeOptionsConnectorMain<CBO>,
    TConnectionBridgeOptionsConnectorFabricOptions<CBO>,
    TConnectionBridgeOptionsGrandAccessCallback<CBO>,
    TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric<CBO>,
    TConnectionBridgeOptionsAccessControlOptions<CBO>,
    TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric<CBO>,
    TConnectionBridgeOptionsSwarmMessageStoreInstance<CBO>,
    MD
  >;
}

export function SwarmChannelInstanceSendMessageComponent<
  DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<
    P,
    T,
    DbType,
    CD,
    DBO,
    MD,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  CD extends boolean = boolean,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized
>({
  swarmMessagesChannelInstance,
}: SwarmChannelInstanceSendMessageComponentProps<DbType, DBO, CBO, CD, MD, T>): React.ReactElement {
  const { dbType } = swarmMessagesChannelInstance;
  const isChannelKeyValue = dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
  const [whetherMessagePending, setWhetherMessageIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageKey, setMessageKey] = useState('');
  const [messageText, setMessageText] = useState('');
  const handleSendMessage = useCallback(async (): Promise<void> => {
    try {
      setErrorMessage('');

      const message = {
        pld: messageText,
        typ: 'test',
        ts: Date.now(),
      } as Omit<MD['bdy'], 'iss'>;
      const messageAddPendingPromise: Promise<void> = swarmMessagesChannelInstance.addMessage(
        message,
        (isChannelKeyValue ? messageKey : undefined) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
          ? string
          : never
      );

      setWhetherMessageIsPending(true);
      await Promise.race([messageAddPendingPromise, timeout(2000)]);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setWhetherMessageIsPending(false);
    }
  }, [swarmMessagesChannelInstance]);
  const handleMessageKeyChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>): void => setMessageKey(ev.target.value), [
    setMessageKey,
  ]);
  const handleMessageTextChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>): void => setMessageText(ev.target.value),
    [setMessageText]
  );
  const handleResetError = useCallback(() => {
    setErrorMessage('');
  }, []);
  return (
    <div>
      <h3>Message</h3>
      {isChannelKeyValue && (
        <label>
          Key: <input onChange={handleMessageKeyChange} value={messageKey} />
        </label>
      )}
      <label>
        Text: <input onChange={handleMessageTextChange} value={messageText} />
      </label>
      <button disabled={whetherMessagePending} onClick={handleSendMessage}>
        {whetherMessagePending ? 'Sending...' : 'Send message'}
      </button>
      {errorMessage && <b onClick={handleResetError}>{errorMessage}</b>}
    </div>
  );
}
