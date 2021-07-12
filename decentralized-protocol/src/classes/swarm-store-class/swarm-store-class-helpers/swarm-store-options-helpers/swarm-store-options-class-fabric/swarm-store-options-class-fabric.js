import { extend } from "../../../../../utils";
import { SwarmStoreOptions } from '../swarm-store-options-class/swarm-store-options-class';
import { validateSwarmStoreOptions, validateSwarmStoreOptionsSerialized, } from '../swarm-store-options-utils/swarm-store-options-utils';
export function swarmStoreOptionsClassFabric(defaults) {
    const getDefaultOptionsValidators = () => {
        var _a, _b;
        const optionsValidatorsPartial = defaults === null || defaults === void 0 ? void 0 : defaults.optionsValidators;
        return {
            isValidOptions: (_a = optionsValidatorsPartial === null || optionsValidatorsPartial === void 0 ? void 0 : optionsValidatorsPartial.isValidOptions) !== null && _a !== void 0 ? _a : ((opts) => validateSwarmStoreOptions(opts)),
            isValidSerializedOptions: (_b = optionsValidatorsPartial === null || optionsValidatorsPartial === void 0 ? void 0 : optionsValidatorsPartial.isValidSerializedOptions) !== null && _b !== void 0 ? _b : validateSwarmStoreOptionsSerialized,
        };
    };
    const getDefaultSerializer = () => {
        var _a;
        return (_a = defaults === null || defaults === void 0 ? void 0 : defaults.optionsSerializer) !== null && _a !== void 0 ? _a : JSON;
    };
    const extendOptionsWithDefaults = (options) => {
        const defaultSwarmStoreOptions = defaults === null || defaults === void 0 ? void 0 : defaults.swarmStoreOptions;
        if (!defaultSwarmStoreOptions || typeof defaultSwarmStoreOptions !== 'object') {
            return options || defaultSwarmStoreOptions;
        }
        if (typeof options !== 'object') {
            return options;
        }
        return extend(options, defaultSwarmStoreOptions);
    };
    class SwarmStoreOptionsClass extends SwarmStoreOptions {
        constructor(options) {
            super({
                options: extendOptionsWithDefaults(options.swarmStoreOptions),
                serializer: options.optionsSerializer || getDefaultSerializer(),
                validators: options.optionsValidators || getDefaultOptionsValidators(),
            });
        }
    }
    return SwarmStoreOptionsClass;
}
//# sourceMappingURL=swarm-store-options-class-fabric.js.map