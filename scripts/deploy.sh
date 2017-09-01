#!/bin/sh -e

# Clear the built output
rm -rf ./build

# Compile new files
npm run build

# Make sure the ./npm directory is empty
rm -rf ./npm
mkdir ./npm

# Copy all files from ./build/src to /npm
cd ./build/src && cp -r ./ ../../npm/
# Copy also the umd bundle with the source map file
cd ../bundles/
cp apollo.umd.js ../../npm/ && cp apollo.umd.js.map ../../npm/

# Back to the root directory
cd ../../

# Ensure a vanilla package.json before deploying so other tools do not interpret
# The built output as requiring any further transformation.
node -e "var package = require('./package.json'); \
  delete package.jest; \
  delete package.scripts; \
  package.main = 'apollo.umd.js'; \
  package.module = 'index.js'; \
  package['jsnext:main'] = 'index.js'; \
  package.typings = 'index.d.ts'; \
  var fs = require('fs'); \
  fs.writeFileSync('./npm/package.json', JSON.stringify(package, null, 2)); \
  "


# Copy few more files to ./npm
cp README.md npm/
cp LICENSE npm/

echo 'deploying to npm...'
cd npm && npm publish --tag next && git push --tags
