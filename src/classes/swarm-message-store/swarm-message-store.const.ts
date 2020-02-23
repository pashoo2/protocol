export enum ESwarmMessageStoreEventNames {
  /**
   * on new incoming message
   * arguments:
   * 1) string - database name where the message was added
   * 2) ISwarmMessage - swarm message instance
   * 3) string - the global unique address of the message in the swarm
   */
  NEW_MESSAGE = 'NEW_MESSAGE',
}
