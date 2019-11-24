export type TIPFSPubsubMessage = {
  from: string;
  seqno: Buffer;
  data: Buffer;
  topicIDs: Array<string>;
};
