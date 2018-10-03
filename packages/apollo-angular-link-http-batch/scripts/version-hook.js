module.exports = function(name, version, helpers) {
  switch (name) {
    case 'apollo-angular-link-http-common':
      return helpers.bumpPackage('apollo-angular-link-http-batch', name, version);
  }
};
