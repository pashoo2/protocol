import { IOptionsSerializerValidatorValidators } from './options-serializer-validator-class.types';
import { IOptionsSerializerValidator, IOptionsSerializerValidatorSerializer, IOptionsSerializerValidatorConstructorParams } from './options-serializer-validator-class.types';
export declare class OptionsSerializerValidator<OPTS, OPTSSERIALIZED extends string> implements IOptionsSerializerValidator<OPTS, OPTSSERIALIZED> {
    get options(): OPTS;
    protected _serializer: IOptionsSerializerValidatorSerializer<OPTS, OPTSSERIALIZED> | undefined;
    protected _validators: IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED> | undefined;
    protected _handledOptions: OPTS | undefined;
    constructor(options: IOptionsSerializerValidatorConstructorParams<OPTS, OPTSSERIALIZED>);
    toString(): OPTSSERIALIZED;
    protected _setSerializer(serializer: IOptionsSerializerValidatorSerializer<OPTS, OPTSSERIALIZED>): void;
    protected _validateValidatorsFunctions(validators: IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED>): void;
    protected _setValidators(validators: IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED>): void;
    protected _getOptionsHandled(): OPTS;
    protected _getSerializer(): IOptionsSerializerValidatorSerializer<OPTS, OPTSSERIALIZED>;
    protected _getValidators(): IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED>;
    protected _getValidatorSerializedOptions(): IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED>['isValidSerializedOptions'];
    protected _getValidatorOptions(): IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED>['isValidOptions'];
    protected _validateSerializedOptionsSilent(options: unknown): options is OPTSSERIALIZED;
    protected _validateAndSetOptionsUnserialized(options: OPTS): void;
    protected _parseOptions(options: OPTSSERIALIZED): OPTS;
    protected _parseAndSetOptionsFromSerialized(options: OPTSSERIALIZED): void;
    protected _setOptions(options: OPTS | OPTSSERIALIZED): void;
}
//# sourceMappingURL=options-serializer-validator-class.d.ts.map