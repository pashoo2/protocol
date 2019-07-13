// uuid v4 string
export type TUesrIdentity = string;

// must be a JSON stringify object in jwk format
export type TUserPublicKey = string;

// must be a JSON stringify object in jwk format
export type TUserSignKey = string;

export interface IUserDescription {
  id: TUesrIdentity;
  publicKey: TUserSignKey;
  signKey: TUserSignKey;
}
