export const CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT = 2;

export const CA_USER_IDENTITY_VERSIONS = {
  '01': '01',
  '02': '02',
};

export const CA_USER_IDENTITY_PARSER_VERSIONS_SUPPORTED = Object.values(
  CA_USER_IDENTITY_VERSIONS
);

/**
 * for now the auth provider url is used as the
 * unique identifier provider of an authority
 * provider
 */
export const CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME =
  'authorityProviderURI';

/**
 * this is the user unique identifier(may be a login) on the auth
 * provider. In version 1 of the identifier a guid value is used
 * to identify the user on the auth provider service.
 */
export const CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME =
  'userUniqueIdentifier';

export const CA_USER_IDENTITY_VERSION_PROP_NAME = 'version';

export const CA_USER_IDENTITY_VERSION_CURRENT = CA_USER_IDENTITY_VERSIONS['02'];

export const CA_USER_IDENTITY_AUTH_PROVIDER_URL_DELIMETER = '|';
