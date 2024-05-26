import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

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
