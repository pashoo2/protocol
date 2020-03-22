import { validateBySchema } from 'utils/validation-utils/validation-utils';

export const runTest = () => {
  const schema = {
    title: 'test',
    type: 'object',
    $id: 'http://test.schema',
    description: 'schema for testing of the validation functionality',
    properties: {
      notRequired: {
        type: 'string',
      },
      required: {
        type: 'array',
        items: {
          oneOf: [
            {
              type: 'number',
            },
            {
              type: 'string',
            },
          ],
        },
      },
    },
    required: ['required'],
    additionalProperties: false,
  };

  const result = validateBySchema(schema, undefined);

  if (result !== false) {
    console.error('Wrong result for undefined');
  }

  const testData1 = {
    required: ['1', 1],
  };
  const result1 = validateBySchema(schema, testData1);

  if (result1 !== true) {
    console.error('Wrong result for requered field');
  }

  const testData2 = {
    notRequired: '1',
  };
  const result2 = validateBySchema(schema, testData2);

  if (result2 !== false) {
    console.error('Wrong result for data with no required field');
  }

  const testData3 = {
    notRequired: '1',
    required: ['1', 1],
  };
  const result3 = validateBySchema(schema, testData3);

  if (result3 !== true) {
    console.error('Wrong result for data with all fields');
  }

  const testData4 = {
    notRequired: '1',
    required: ['1', 1],
    additional: 1,
  };
  const result4 = validateBySchema(schema, testData4);

  if (result4 !== false) {
    console.error('Wrong result for data with additional fields');
  }
};
