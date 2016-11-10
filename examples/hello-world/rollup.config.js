import rollup from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'dist/out-tsc/main.js',
  dest: 'dist/build.js', // output a single application bundle
  sourceMap: false,
  format: 'iife',
  plugins: [
      nodeResolve({jsnext: true, module: true}),
      commonjs({
        include: [
          'node_modules/rxjs/**',
          'node_modules/apollo-client-rxjs/**',
          'node_modules/graphql-tag/**',
          'node_modules/apollo-client/**'
        ]
      }),
      uglify()
  ]
};
