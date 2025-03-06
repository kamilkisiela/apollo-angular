import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

import { parseJSON } from '../utils/index.cjs';

it('support // comments', () => {
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
  ).toEqual({
    foo: {
      bar: true,
    },
  });
});

it('support /* */ comments', () => {
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
  ).toEqual({
    foo: {
      bar: true,
    },
  });
});
