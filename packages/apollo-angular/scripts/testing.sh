#!/bin/sh -e

echo "[Deploy] Copying testing files"

cd ./build
cd ./testing && cp -r ./ ../../npm/testing
cd ../../testing

# Ensure a vanilla package.json before deploying so other tools do not interpret
# The built output as requiring any further transformation.
echo '[Deploy] Preparing a clean package.json for testing'
node -e "var package = require('./package.json'); \
  package.main = './bundle.umd.js'; \
  package.module = './index.js'; \
  package['jsnext:main'] = './index.js'; \
  package.typings = './index.d.ts'; \
  var fs = require('fs'); \
  fs.writeFileSync('../npm/testing/package.json', JSON.stringify(package, null, 2)); \
  "

echo '[Deploy] Preparing a testing.d.ts'
node -e "fs.writeFileSync('../npm/testing.d.ts', 'export * from \'./testing/index\';');"

cd ../
