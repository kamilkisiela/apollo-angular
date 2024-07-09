const cpx = require('cpx2');

cpx.copySync('schematics/install/files/**/*', 'build/schematics/install/files');
cpx.copySync('schematics/README.md', 'build/schematics');
cpx.copySync('schematics/collection.json', 'build/schematics');
cpx.copySync('schematics/install/schema.json', 'build/schematics/install');
