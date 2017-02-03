export default {
  entry: 'build/src/index.js',
  dest: 'build/bundles/apollo.umd.js',
  format: 'umd',
  moduleName: 'ng.apollo',
  onwarn,
  globals: {
    '@angular/core': 'ng.core',
    'rxjs/Observable': 'Rx',
    'rxjs/observable/from': 'Rx.Observable',
    'rxjs/observable/fromPromise': 'Rx.Observable',
    'apollo-client-rxjs': 'apollo.rxjs',
    'apollo-client': 'apollo',
  }
}

function onwarn(message) {
  const suppressed = [
    'UNRESOLVED_IMPORT',
    'THIS_IS_UNDEFINED'
  ];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
