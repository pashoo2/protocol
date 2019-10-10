export type TIPFSPubsubMessage = {
  from: String;
  seqno: Buffer;
  data: Buffer;
  topicIDs: Array<String>;
};
