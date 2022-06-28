import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'jest-zone-patch';
import 'jest-preset-angular/setup-jest.mjs';

import {TestBed} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

beforeAll(() => {
  TestBed.initTestEnvironment(
    [BrowserDynamicTestingModule, NoopAnimationsModule],
    platformBrowserDynamicTesting(),
  );
});
