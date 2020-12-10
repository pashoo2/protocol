import { ISerializer } from 'types/serialization.types';

export interface IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED extends string> {
  isValidSerializedOptions(optsSerialized: unknown): optsSerialized is OPTSSERIALIZED;
  isValidOptions(opts: unknown): opts is OPTS;
}

export interface IOptionsSerializerValidatorSerializer<OPTS, OPTSSERIALIZED extends string> extends ISerializer {
  parse(optsSerialized: OPTSSERIALIZED): OPTS;
  stringify(optis: OPTS): OPTSSERIALIZED;
}

export interface IOptionsSerializerValidatorConstructorParams<OPTS, OPTSSERIALIZED extends string> {
  validators: IOptionsSerializerValidatorValidators<OPTS, OPTSSERIALIZED>;
  serializer: IOptionsSerializerValidatorSerializer<OPTS, OPTSSERIALIZED>;
  options: OPTS | OPTSSERIALIZED;
}

export interface IOptionsSerializerValidator<OPTS, OPTSSERIALIZED extends string> {
  options: Readonly<OPTS>;
  toString(): OPTSSERIALIZED;
}

export interface IOptionsSerializerValidatorConstructor<OPTS, OPTSSERIALIZED extends string> {
  new (params: IOptionsSerializerValidatorConstructorParams<OPTS, OPTSSERIALIZED>): IOptionsSerializerValidator<
    OPTS,
    OPTSSERIALIZED
  >;
}
