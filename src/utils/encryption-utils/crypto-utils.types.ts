export type TCRYPTO_UTIL_KEY_EXPORT_FORMAT_TYPE = object;

export type TCRYPTO_UTIL_KEYPAIR_EXPORT_FORMAT_TYPE = {
  public: object;
  private: object;
};

export type TCRYPTO_UTIL_KEYPAIR_IMPORT_FORMAT_TYPE = {
  public: CryptoKey;
  private: CryptoKey;
};
