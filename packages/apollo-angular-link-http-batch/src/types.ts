import {Operation} from 'apollo-link';
import {Options} from 'apollo-angular-link-http-common';

export type BatchOptions = {
  batchMax?: number;
  batchInterval?: number;
  batchKey?: (operation: Operation) => string;
} & Options;
