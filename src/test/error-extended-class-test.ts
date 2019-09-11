import { ErrorExtendedBaseClass } from 'classes/basic-classes/error-extended-class-base/error-extended-class-base';

export const runTestErrorExtended = () => {
  console.warn('test ErrorExtendedBaseClass was started');
  const errExtendedEmpty = new ErrorExtendedBaseClass();

  if (!(errExtendedEmpty instanceof Error)) {
    console.error('ErrorExtended must be an instance of the Error');
    return;
  }

  const errorMessageEmpty = errExtendedEmpty.toString();

  if (typeof errorMessageEmpty !== 'string') {
    console.error('Error message must be a string');
    return;
  }

  const errorMessageTest = 'Test error message';
  const errorStringNoCode = new ErrorExtendedBaseClass(errorMessageTest);

  if (!(errorStringNoCode instanceof Error)) {
    console.error('errorMessageStringNoCode must be an instance of Error');
    return;
  }

  const errorMessageStringNoCode = errorStringNoCode.toString();

  if (errorMessageStringNoCode !== errorMessageTest) {
    console.error(
      'The error stringified with no code must be equal to the string passed as argument'
    );
    return;
  }

  const errorWithMessageAndCodeMessage = 'Test error with code';
  const errorWithMessageAndCodeCode = 100;
  const errorWithMessageAndCode = new ErrorExtendedBaseClass(
    errorWithMessageAndCodeMessage,
    errorWithMessageAndCodeCode
  );

  if (!(errorWithMessageAndCode instanceof Error)) {
    console.error('errorWithMessageAndCode must be an instance of Error');
    return;
  }

  const { code: errorWithMessageAndCodeCodeResult } = errorWithMessageAndCode;

  if (errorWithMessageAndCodeCodeResult !== errorWithMessageAndCodeCode) {
    console.error('The error code must be equal to the passed');
    return;
  }

  const {
    message: errorWithMessageAndCodeMessageResult,
  } = errorWithMessageAndCode;

  if (
    !errorWithMessageAndCodeMessageResult.includes(
      errorWithMessageAndCodeMessage
    )
  ) {
    console.error(
      'The error message must includes the string passed as argument'
    );
    return;
  }

  const errorWithMessageAndCodeStringified = String(errorWithMessageAndCode);

  if (
    !errorWithMessageAndCodeStringified.includes(
      `Error code: ${errorWithMessageAndCodeCode}`
    )
  ) {
    console.error(
      'The error stringified must includes the code passed as argument'
    );
    return;
  }
  if (
    !errorWithMessageAndCodeStringified.includes(errorWithMessageAndCodeMessage)
  ) {
    console.error(
      'The error stringified must includes the string message passed as argument'
    );
    return;
  }

  const errorMessageByErrorExtendedBaseClass = new ErrorExtendedBaseClass(
    errorWithMessageAndCode
  );

  if (errorMessageByErrorExtendedBaseClass !== errorWithMessageAndCode) {
    console.error(
      'Error extended created depending on an instance of ErrorExtendedBaseClass must be equal to the argument passeds'
    );
    return;
  }
  console.warn('test ErrorExtendedBaseClass was succeed');
};
