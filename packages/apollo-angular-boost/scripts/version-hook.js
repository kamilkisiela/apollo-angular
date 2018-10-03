const fs = require('fs');

module.exports = function(name, version, helpers) {
  switch (name) {
    case 'apollo-angular':
      helpers.bumpPackage('apollo-angular-boost', name, version);
      return;
    case 'apollo-angular-link-http':
      helpers.bumpPackage('apollo-angular-boost', name, version);
      return;
  }
};
