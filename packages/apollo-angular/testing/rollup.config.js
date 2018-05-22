import build from '../../../rollup.config';

const config = build('core.testing');

config.input = 'build/testing/index.js';
config.output.file = 'build/testing/bundle.umd.js';

export default config;
