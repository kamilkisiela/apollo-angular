export default {
  entry: 'build/src/index.js',
  dest: 'build/bundles/apollo.umd.js',
  format: 'umd',
  moduleName: 'ng.apollo',
  globals: {
    '@angular/core': 'ng.core',
    'rxjs/Observable': 'Rx'
  },
  external: [
    'replace-constructor'
  ]
};
