import assert from 'assert';
export function validateIssuerDesirizlizedFormat(issuer) {
    assert(issuer != null, 'The issuer must be defined');
    assert(typeof issuer === 'string', 'The issuer must be a string');
    assert(!!issuer.length, 'The issuer string must not be empty');
}
//# sourceMappingURL=swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied.js.map