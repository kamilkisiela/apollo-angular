module.exports = {
  'packages/**/{src,tests}/**/*.ts': ['prettier --write', 'git add'],
};
