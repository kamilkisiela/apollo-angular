import { parseJSON } from '../utils';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

test('support // comments', () => {
  expect(
    parseJSON(
      'file.json',
      `
    {
      "foo": {
        // "baz": true,
        "bar": true
      }
    }
  `,
    ),
  ).toMatchObject({
    foo: {
      bar: true,
    },
  });
});

test('support /* */ comments', () => {
  expect(
    parseJSON(
      'file.json',
      `
    {
      "foo": {
        /* "baz": true, */
        "bar": true
      }
    }
  `,
    ),
  ).toMatchObject({
    foo: {
      bar: true,
    },
  });
});
