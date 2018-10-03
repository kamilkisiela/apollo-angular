module.exports = function(name, version, helpers) {
  if (name !== 'apollo-angular-boost') {
    return;
  }

  helpers.compare(name, 'apollo-angular');
  helpers.compare(name, 'apollo-angular-link-http');
};
