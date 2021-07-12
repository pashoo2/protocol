export function validateSwamChannelsListDatabaseOptions(dbOptions) {
    if (typeof dbOptions !== 'object') {
        throw new Error('Database options should be an object');
    }
    if (!dbOptions) {
        throw new Error('A database options should be defined');
    }
    const dbOptionsObj = dbOptions;
    if (dbOptionsObj.dbName) {
        console.warn('A database name should not be provided in the options');
    }
    if (dbOptionsObj.dbType) {
        console.warn('A database type should not be provided in the options');
    }
    return true;
}
export function getValidatorSwarmChannelsListDatabaseOptions(grantAccessCallbackValidator) {
    return (dbOptions) => {
        if (!validateSwamChannelsListDatabaseOptions(dbOptions)) {
            throw new Error('The database options is not valid');
        }
        if (!grantAccessCallbackValidator(dbOptions.grantAccess)) {
            throw new Error('The grant access callback is not valid');
        }
        return true;
    };
}
//# sourceMappingURL=swarm-messages-channels-list-dbo-validator-v1.js.map