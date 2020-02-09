// import '@types/jest';
import validateTypeFormat from '../../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-type/swarm-message-subclass-validator-fields-validator-validator-type';

const typeAllowedString = 'type_allowed';
const typeAllowedNumber = 1;
const typeNotAllowedString = 'type_not_allowed';
const typeNotAllowedNumber = 2;
const typesAllowedList = [typeAllowedString, typeAllowedNumber];

describe('validateTypeFormat tests', () => {
  test('validateTypeFormat should not fail if the type string is allowed', () => {
    expect(() =>
      validateTypeFormat(typeAllowedString, typesAllowedList)
    ).not.toThrow();
  });
  test('validateTypeFormat should not fail if the type number is allowed', () => {
    expect(() =>
      validateTypeFormat(typeAllowedNumber, typesAllowedList)
    ).not.toThrow();
  });
  test('validateTypeFormat should fail if the type string is not allowed', () => {
    expect(() =>
      validateTypeFormat(typeNotAllowedString, typesAllowedList)
    ).toThrow();
  });
  test('validateTypeFormat should fail if the type number is not allowed', () => {
    expect(() =>
      validateTypeFormat(typeNotAllowedNumber, typesAllowedList)
    ).toThrow();
  });
  test('validateTypeFormat should fail if the string is empty', () => {
    expect(() => validateTypeFormat(0, typesAllowedList)).toThrow();
  });
  test('validateTypeFormat should fail if the number is zero', () => {
    expect(() => validateTypeFormat(0, typesAllowedList)).toThrow();
  });
});
