import assert from 'assert';
export function validateSwarmStoreOptionsSerialized(optsSerialized) {
    return typeof optsSerialized === 'string';
}
export function validateSwarmStoreOptions(opts) {
    assert(opts, 'Swarm store options should be defined');
    const optionsToValidate = opts;
    assert(optionsToValidate.userId, 'User id should be defined in the options');
    assert(optionsToValidate.credentials, 'User credentials should be defined in the options');
    assert(optionsToValidate.databases, 'Databases list should be defined in the options');
    assert(optionsToValidate.provider, 'Connector to the swarm provider should be defined in the options');
    assert(optionsToValidate.directory, 'A directory for all databases should be defined in the options');
    assert(optionsToValidate.providerConnectionOptions, 'A swarm connection provider options should be defined in the options');
    return true;
}
//# sourceMappingURL=swarm-store-options-utils.js.map