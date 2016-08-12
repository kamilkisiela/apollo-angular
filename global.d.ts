declare module 'lodash.isequal' {
  import main = require('~lodash/index');
  export = main.isEqual;
}

declare module 'lodash.forin' {
  import main = require('~lodash/index');
  export = main.forIn;
}

declare module 'lodash.assign' {
  import main = require('~lodash/index');
  export = main.assign;
}

declare module 'lodash.omit' {
  import main = require('~lodash/index');
  export = main.omit;
}
