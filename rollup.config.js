import resolve from 'rollup-plugin-node-resolve';

const globals = {
  '@angular/core': 'ng.core',
  'rxjs/Observable': 'Rx',
  'rxjs/observable/from': 'Rx.Observable',
  'rxjs/observable/fromPromise': 'Rx.Observable',
  'rxjs/scheduler/queue': 'Rx.Scheduler',
  'rxjs/operator/observeOn': 'Rx.Observable.prototype',
  'apollo-client-rxjs': 'apollo.rxjs',
  'apollo-client': 'apollo',
};

export default {
  entry: 'build/src/index.js',
  dest: 'build/bundles/apollo.umd.js',
  format: 'umd',
  exports: 'named',
  sourceMap: true,
  moduleName: 'ng.apollo',
  plugins: [resolve()],
  external: Object.keys(globals),
  globals,
  onwarn,
};

function onwarn(message) {
  const suppressed = [
    'UNRESOLVED_IMPORT',
    'THIS_IS_UNDEFINED'
  ];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
