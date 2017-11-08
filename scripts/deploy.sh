#!/bin/sh -e

echo '[Deploy] Start deploying'

echo '[Deploy] Clearing the built output'
rm -rf ./build

echo '[Deploy] Compiling new files'
npm run build

echo '[Deploy] Creating empty npm directory'
rm -rf ./npm
mkdir ./npm

echo '[Deploy] Copying the built output'
cd ./build/src && cp -r ./ ../../npm/

echo '[Deploy] Copying umd bundle with source map file';
cd ../
cp bundle.umd.js ../npm/ && cp bundle.umd.js.map ../npm/

echo '[Deploy] Copying LICENSE'
cp ./../LICENSE ../npm/

echo '[Deploy] Copying README'
cp ./../README.md ../npm/

# Back to the root directory
cd ../

# Ensure a vanilla package.json before deploying so other tools do not interpret
# The built output as requiring any further transformation.
echo '[Deploy] Preparing a clean package.json'
node -e "var package = require('./package.json'); \
  delete package.jest; \
  delete package.scripts; \
  delete package.devDependencies; \
  package.main = 'bundle.umd.js'; \
  package.module = 'index.js'; \
  package['jsnext:main'] = 'index.js'; \
  package.typings = 'index.d.ts'; \
  var fs = require('fs'); \
  fs.writeFileSync('./npm/package.json', JSON.stringify(package, null, 2)); \
  "

echo '[Deploy] Deploying to npm...'
cd npm && npm publish --tag beta && git push --tags
echo '[Deploy] Completed'
