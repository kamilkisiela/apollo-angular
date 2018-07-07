#!/usr/bin/env node
const shell = require('shelljs');

if (process.env.NODE_ENV !== 'development') {
  shell.exec(process.argv[2]);
} else {
  process.exit(0);
}
