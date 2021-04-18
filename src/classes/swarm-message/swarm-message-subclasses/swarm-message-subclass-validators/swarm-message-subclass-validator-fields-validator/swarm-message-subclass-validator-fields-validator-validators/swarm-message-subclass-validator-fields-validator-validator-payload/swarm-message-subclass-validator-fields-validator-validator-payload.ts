import assert from 'assert';
import defaultsDeep from 'lodash.defaultsdeep';
import {
  TSwarmMessagePayloadSerialized,
  ISwarmMessagePayloadValidationOptions,
} from './swarm-message-subclass-validator-fields-validator-validator-payload.types';
import { SwarmMessagePayloadValidationOptionsDefault } from './swarm-message-subclass-validator-fields-validator-validator-payload.const';
import { commonUtilsArrayCalculateLengthOfIntegerArray } from 'utils/common-utils/common-utils-array';

/**
 * validates if the payload is an instance
 * of the Buffer-compatible types or a string.
 * And checks the length of the payload value
 * to be less than the max and greater than the
 * min
 *
 * @param {} pld
 * @throws
 */
function validatePayloadFunc(
  pld: TSwarmMessagePayloadSerialized,
  options: Required<ISwarmMessagePayloadValidationOptions>
): void {
  assert(pld != null, 'A payload must be specified');

  const { payloadMaxLengthBytes, payloadMinLengthBytes } = options;
  let len;

  if (pld instanceof Array) {
    len = commonUtilsArrayCalculateLengthOfIntegerArray(pld);
    if (len instanceof Error) {
      console.error(len);
      assert.fail('The value of the payload is not a valid array with byte-length integers');
    }
  } else if (typeof pld === 'string') {
    len = pld.length;
  } else if (pld instanceof Uint8Array) {
    len = pld.buffer.byteLength;
  } else if (pld instanceof ArrayBuffer) {
    len = pld.byteLength;
  } else if (pld instanceof SharedArrayBuffer) {
    len = pld.byteLength;
  } else {
    assert.fail(
      'The payload value must be a string, an instance of a byte-integers Array, Uint8Array, ArrayBuffer or SharedArrayBuffer'
    );
  }
  if (typeof len !== 'number') {
    assert.fail('Unknown error has occurred while calculating the lenght of the payload');
    return;
  }
  assert(Number.isFinite(len), 'The length of the payload must be a finite number');
  assert(len <= payloadMaxLengthBytes, 'The payload value is too big');
  assert(len >= payloadMinLengthBytes, 'The payload value is too small');
}

export const createValidatePayload = (opts?: ISwarmMessagePayloadValidationOptions) => (pld: TSwarmMessagePayloadSerialized) =>
  validatePayloadFunc(pld, defaultsDeep(opts, SwarmMessagePayloadValidationOptionsDefault));
