#!/usr/bin/env node
const shell = require('shelljs');

console.log('env', process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'development') {
  shell.exec(process.argv[2]);
} else {
  process.exit(0);
}
