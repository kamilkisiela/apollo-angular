import './_setup';

import {NgModule} from '@angular/core';

import {ApolloModule} from '../src/ApolloModule';
import {Apollo} from '../src/Apollo';
import {SelectPipe} from '../src/SelectPipe';

describe('ApolloModule', () => {
  const metadata: NgModule = Reflect.getMetadata(
    'annotations',
    ApolloModule,
  )[0];

  test('should be defined', () => {
    expect(ApolloModule).toBeDefined();
  });

  test('should provide Apollo', () => {
    expect(metadata.providers).toContain(Apollo);
  });

  test('should declare SelectPipe', () => {
    expect(metadata.declarations).toContain(SelectPipe);
  });

  test('should export SelectPipe', () => {
    expect(metadata.exports).toContain(SelectPipe);
  });
});
