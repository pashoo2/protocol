import { IOptionsSerializerValidatorValidators } from './options-serializer-validator-class.types';
import assert from 'assert';
import {
  IOptionsSerializerValidator,
  IOptionsSerializerValidatorSerializer,
  IOptionsSerializerValidatorConstructorParams,
} from './options-serializer-validator-class.types';

export class OptionsSerializerValidator<OPTS, OPTSSERIALIZED extends string>
  implements IOptionsSerializerValidator<OPTS, OPTSSERIALIZED> {
  get options(): OPTS {
    return this._getOptionsHandled();
  }

  protected _serializer: IOptionsSerializerValidatorSerializer<OPTS, OPTSSERIALIZED> | undefined;

  protected _validators: IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED> | undefined;

  protected _handledOptions: OPTS | undefined;

  constructor(options: IOptionsSerializerValidatorConstructorParams<OPTS, OPTSSERIALIZED>) {
    this._setSerializer(options.serializer);
    this._setValidators(options.validators);
    this._setOptions(options.options);
  }

  toString(): OPTSSERIALIZED {
    return this._getSerializer().stringify(this._getOptionsHandled());
  }

  protected _setSerializer(serializer: IOptionsSerializerValidatorSerializer<OPTS, OPTSSERIALIZED>): void {
    if (!serializer) {
      throw new Error('Serializer should be passed in constructor options');
    }
    this._serializer = serializer;
  }

  protected _validateValidatorsFunctions(validators: IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED>): void {
    assert(validators, 'Validators should be passed in constructor options');
    assert(typeof validators.isValidOptions === 'function', 'isValidOptions validator should be a function');
    assert(validators.isValidOptions.length > 0, 'isValidOptions validator should be a function with at least one argument');
    assert(typeof validators.isValidSerializedOptions === 'function', 'isValidSerializedOptions validator should be a function');
    assert(
      validators.isValidSerializedOptions.length > 0,
      'isValidSerializedOptions validator should be a function with at least one argument'
    );
  }

  protected _setValidators(validators: IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED>): void {
    this._validateValidatorsFunctions(validators);
    this._validators = validators;
  }

  protected _getOptionsHandled(): OPTS {
    if (!this._handledOptions) {
      throw new Error('Swarm store options not defined');
    }
    return this._handledOptions;
  }

  protected _getSerializer(): IOptionsSerializerValidatorSerializer<OPTS, OPTSSERIALIZED> {
    if (!this._serializer) {
      throw new Error('Serializer must be defined');
    }
    return this._serializer;
  }

  protected _getValidators(): IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED> {
    if (!this._validators) {
      throw new Error('Validators are not defined');
    }
    return this._validators;
  }

  protected _getValidatorSerializedOptions(): IOptionsSerializerValidatorValidators<
    OPTS,
    OPTSSERIALIZED
  >['isValidSerializedOptions'] {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const validatorIsValidSerializedOptions = this._getValidators().isValidSerializedOptions;

    if (!validatorIsValidSerializedOptions) {
      throw new Error('Validator isValidSerializedOptions not defined');
    }
    return validatorIsValidSerializedOptions;
  }

  protected _getValidatorOptions(): IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED>['isValidOptions'] {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const validatorIsValidOptions = this._getValidators().isValidOptions;

    if (!validatorIsValidOptions) {
      throw new Error('Validator isValidOptions not defined');
    }
    return validatorIsValidOptions;
  }

  protected _validateSerializedOptionsSilent(options: unknown): options is OPTSSERIALIZED {
    try {
      return this._getValidatorSerializedOptions()(options);
    } catch {
      return false;
    }
  }

  protected _validateAndSetOptionsUnserialized(options: OPTS): void {
    const isValidOptions = this._getValidatorOptions()(options);
    if (!isValidOptions) {
      throw new Error('The options are not valid');
    }
    this._handledOptions = options;
  }

  protected _parseOptions(options: OPTSSERIALIZED): OPTS {
    return this._getSerializer().parse(options);
  }

  protected _parseAndSetOptionsFromSerialized(options: OPTSSERIALIZED): void {
    const optionsParsed = this._parseOptions(options);
    this._validateAndSetOptionsUnserialized(optionsParsed);
  }

  protected _setOptions(options: OPTS | OPTSSERIALIZED): void {
    const isSerializedOptions = this._validateSerializedOptionsSilent(options);
    if (isSerializedOptions) {
      this._parseAndSetOptionsFromSerialized(options as OPTSSERIALIZED);
    } else {
      this._validateAndSetOptionsUnserialized(options as OPTS);
    }
  }
}
