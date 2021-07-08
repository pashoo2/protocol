// uuid v4 string
export type TUserIdentity = string;

// must be a JSON stringify object in jwk format
export type TUserPublicKey = string;

// must be a JSON stringify object in jwk format
export type TUserSignKey = string;

export interface IUserDescription {
  id: TUserIdentity;
  publicKey: TUserSignKey;
  signKey: TUserSignKey;
}
