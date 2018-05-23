const genName = name => `apollo.${name}`;

export const globals = {
  // Angular
  '@angular/core': 'ng.core',
  '@angular/common/http': 'ng.common.http',
  '@ngrx/store': 'ngrx.store',
  // Apollo
  'apollo-link': 'apolloLink.core',
  'apollo-client': 'apollo',
  'apollo-angular': genName('core'),
  'apollo-angular-link-http': genName('link.http'),
  'apollo-angular-link-http-common': genName('link.httpCommon'),
  'apollo-cache-inmemory': 'apollo.cache.inmemory',
  'apollo-link-state': 'apolloLink.state',
  'apollo-link-error': 'apolloLink.error',
  'apollo-link-context': 'apolloLink.context',
  'apollo-link-persisted-queries': 'persistedQueryLink',
  // RxJS
  rxjs: 'rxjs',
  'rxjs/operators': 'rxjs.operators',
};

export default name => ({
  input: 'build/src/index.js',
  output: {
    file: 'build/bundle.umd.js',
    format: 'umd',
  },
  name: genName(name),
  exports: 'named',
  sourcemap: true,
  external: Object.keys(globals),
  onwarn,
  globals,
});

function onwarn(message) {
  const suppressed = ['UNRESOLVED_IMPORT', 'THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
