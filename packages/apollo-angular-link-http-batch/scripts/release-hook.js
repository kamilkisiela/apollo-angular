module.exports = function(name) {
  if (name !== 'apollo-angular-link-http-batch') {
    return;
  }

  helpers.compare(name, 'apollo-angular-link-http-common');
};
