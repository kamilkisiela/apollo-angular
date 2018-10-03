module.exports = function(name, version, helpers) {
  if (name !== 'apollo-angular-link-http') {
    return;
  }

  helpers.compare(name, 'apollo-angular-link-http-common');
};
