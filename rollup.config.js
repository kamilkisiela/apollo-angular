export default {
  entry: 'build/src/index.js',
  dest: 'build/bundles/apollo.umd.js',
  format: 'umd',
  moduleName: 'ng.apollo',
  globals: {
    '@angular/core': 'ng.core',
    'rxjs/Observable': 'Rx',
    'rxjs/observable/from': 'Rx.Observable',
    'rxjs/observable/fromPromise': 'Rx.Observable',
    'apollo-client-rxjs': 'apollo.rxjs',
    'apollo-client': 'apollo',
  }
}
