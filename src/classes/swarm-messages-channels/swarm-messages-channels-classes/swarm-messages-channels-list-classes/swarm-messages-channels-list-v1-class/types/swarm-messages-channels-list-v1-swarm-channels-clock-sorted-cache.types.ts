export interface ILatestMessageDescription<MD> {
  /**
   * Swarm messages or undefiened if DELETE operation
   */
  message: MD;
  latestTime: number;
}

// const messagesCachedForDatabaseKey: Record<string, Map<number, ILatestMessageDescription>> = {};

// function getHashForDatabaseKey(databaseName: string, key: string): string {
//   return `${databaseName}_${key}`;
// }

// function getMessagesCachedForDatabaseKeyOrUndefined(
//   databaseName: string,
//   key: string
// ): Map<number, ILatestMessageDescription> | undefined {
//   const hash = getHashForDatabaseKey(databaseName, key);
//   return messagesCachedForDatabaseKey[hash];
// }

// function getPreviousMessageCachedFromDatabaseKeyAndTime(
//   databaseName: string,
//   // key of the value
//   key: string,
//   handledMessageTime: number
// ): MD | undefined {
//   const messagesCachedMapWithTimeKeys = getMessagesCachedForDatabaseKeyOrUndefined(databaseName, key);

//   if (messagesCachedMapWithTimeKeys) {
//     const messagesAddTimes = messagesCachedMapWithTimeKeys;
//     let messageCachedAddTime: number;
//     let previousMessageTime: number = -1;

//     for (messageCachedAddTime of messagesAddTimes.keys()) {
//       if (messageCachedAddTime < handledMessageTime) {
//         if (previousMessageTime < messageCachedAddTime) {
//           previousMessageTime = messageCachedAddTime;
//         }
//       }
//     }
//     if (previousMessageTime !== -1) {
//       const previousMessageDescription = messagesCachedMapWithTimeKeys.get(previousMessageTime);
//       if (!previousMessageDescription) {
//         throw new Error(`Previous message can't be gotten by the time key ${previousMessageTime}`);
//       }
//       return previousMessageDescription.message;
//     }
//   }
// }

// function addMessageToDatabaseKeysCache(
//   swarmMessage: MD,
//   databaseName: string,
//   // key of the value
//   key: string,
//   time: number
// ): void {
//   let messagesCachedMapWithTimeKeys = getMessagesCachedForDatabaseKeyOrUndefined(databaseName, key);

//   if (!messagesCachedMapWithTimeKeys) {
//     const hashForKeyAndDatabaseName = getHashForDatabaseKey(databaseName, key);

//     messagesCachedMapWithTimeKeys = new Map<number, ILatestMessageDescription>();
//     messagesCachedForDatabaseKey[hashForKeyAndDatabaseName] = messagesCachedMapWithTimeKeys;
//   }
//   messagesCachedMapWithTimeKeys.set(time, {
//     latestTime: time,
//     message: swarmMessage,
//   });
// }

export interface ISwarmMessagesChannelsListV1ClockSortedCache {
  addMessageToCacheByDatabaseNameAndKey(): void;
  getFromCacheByDatabaseNameAndKey(): void;
}
