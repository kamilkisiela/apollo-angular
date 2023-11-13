import 'reflect-metadata';
import 'zone.js';
import 'zone.js/testing';
import 'jest-zone-patch';
import 'jest-preset-angular';

import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

beforeAll(() => {
  TestBed.initTestEnvironment(
    [BrowserDynamicTestingModule, NoopAnimationsModule],
    platformBrowserDynamicTesting(),
  );
});
