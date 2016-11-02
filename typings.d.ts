/// <reference types="typed-graphql" />

declare module 'lodash.isequal' {
  import main = require('lodash');
  export = main.isEqual;
}

declare module 'lodash.forin' {
  import main = require('lodash');
  export = main.forIn;
}

declare module 'lodash.assign' {
  import main = require('lodash');
  export = main.assign;
}

declare module 'lodash.omit' {
  import main = require('lodash');
  export = main.omit;
}

declare module 'replace-constructor';
