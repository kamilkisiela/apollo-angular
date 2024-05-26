const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { parseJSON } from '../utils';

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
