module.exports = {
  ...require('@theguild/prettier-config'),
  overrides: [], // We don't want to remove semicolon in mdx files, see https://github.com/the-guild-org/shared-config/pull/11
};
