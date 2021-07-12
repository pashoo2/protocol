import assert from 'assert';
export class OptionsSerializerValidator {
    constructor(options) {
        this._setSerializer(options.serializer);
        this._setValidators(options.validators);
        this._setOptions(options.options);
    }
    get options() {
        return this._getOptionsHandled();
    }
    toString() {
        return this._getSerializer().stringify(this._getOptionsHandled());
    }
    _setSerializer(serializer) {
        if (!serializer) {
            throw new Error('Serializer should be passed in constructor options');
        }
        this._serializer = serializer;
    }
    _validateValidatorsFunctions(validators) {
        assert(validators, 'Validators should be passed in constructor options');
        assert(typeof validators.isValidOptions === 'function', 'isValidOptions validator should be a function');
        assert(validators.isValidOptions.length > 0, 'isValidOptions validator should be a function with at least one argument');
        assert(typeof validators.isValidSerializedOptions === 'function', 'isValidSerializedOptions validator should be a function');
        assert(validators.isValidSerializedOptions.length > 0, 'isValidSerializedOptions validator should be a function with at least one argument');
    }
    _setValidators(validators) {
        this._validateValidatorsFunctions(validators);
        this._validators = validators;
    }
    _getOptionsHandled() {
        if (!this._handledOptions) {
            throw new Error('Swarm store options not defined');
        }
        return this._handledOptions;
    }
    _getSerializer() {
        if (!this._serializer) {
            throw new Error('Serializer must be defined');
        }
        return this._serializer;
    }
    _getValidators() {
        if (!this._validators) {
            throw new Error('Validators are not defined');
        }
        return this._validators;
    }
    _getValidatorSerializedOptions() {
        const validatorIsValidSerializedOptions = this._getValidators().isValidSerializedOptions;
        if (!validatorIsValidSerializedOptions) {
            throw new Error('Validator isValidSerializedOptions not defined');
        }
        return validatorIsValidSerializedOptions;
    }
    _getValidatorOptions() {
        const validatorIsValidOptions = this._getValidators().isValidOptions;
        if (!validatorIsValidOptions) {
            throw new Error('Validator isValidOptions not defined');
        }
        return validatorIsValidOptions;
    }
    _validateSerializedOptionsSilent(options) {
        try {
            return this._getValidatorSerializedOptions()(options);
        }
        catch (_a) {
            return false;
        }
    }
    _validateAndSetOptionsUnserialized(options) {
        const isValidOptions = this._getValidatorOptions()(options);
        if (!isValidOptions) {
            throw new Error('The options are not valid');
        }
        this._handledOptions = options;
    }
    _parseOptions(options) {
        return this._getSerializer().parse(options);
    }
    _parseAndSetOptionsFromSerialized(options) {
        const optionsParsed = this._parseOptions(options);
        this._validateAndSetOptionsUnserialized(optionsParsed);
    }
    _setOptions(options) {
        const isSerializedOptions = this._validateSerializedOptionsSilent(options);
        if (isSerializedOptions) {
            this._parseAndSetOptionsFromSerialized(options);
        }
        else {
            this._validateAndSetOptionsUnserialized(options);
        }
    }
}
//# sourceMappingURL=options-serializer-validator-class.js.map