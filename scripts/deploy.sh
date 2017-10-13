#!/bin/sh -e

echo 'Start deploying'

echo $PWD

echo 'Clearing the built output'
rm -rf ./build

echo 'Compiling new files'
npm run build

echo 'Creating empty npm directory'
rm -rf ./npm
mkdir ./npm

echo 'Copying all files from ./build/src to /npm'
cd ./build/src && cp -r ./ ../../npm/

echo 'Copying umd bundle with source map file';
cd ../
cp bundle.umd.js ../npm/ && cp bundle.umd.js.map ../npm/

echo 'Copying LICENSE'
cp ./../LICENSE ../npm/

# Back to the root directory
cd ../

# Ensure a vanilla package.json before deploying so other tools do not interpret
# The built output as requiring any further transformation.
echo 'Preparing a clean package.json'
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

echo 'deploying to npm...'
cd npm # && npm publish --tag next && git push --tags
echo $PWD
