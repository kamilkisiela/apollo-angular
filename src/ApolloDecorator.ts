import { ApolloHandle, ApolloOptions } from './utils/ApolloHandle';
export { ApolloQuery } from './utils/ApolloHandle';

import forIn = require('lodash.forin');

export function Apollo({
  client,
  queries,
  mutations,
}: ApolloOptions) {
  const apolloProp = '__apolloHandle';

  return (sourceTarget: any) => {
    const target = sourceTarget;

    const oldHooks = {};
    const hooks = {
      /**
       * Initialize the component
       * after Angular initializes the data-bound input properties.
       */
      ngOnInit() {
        if (!this[apolloProp]) {
          this[apolloProp] = new ApolloHandle({
            component: this,
            client,
            queries,
            mutations,
          });
        }

        this[apolloProp].handleQueries();
        this[apolloProp].handleMutations();
      },
      /**
       * Detect and act upon changes that Angular can or won't detect on its own.
       * Called every change detection run.
       */
      ngDoCheck() {
        this[apolloProp].handleQueries();
        this[apolloProp].handleMutations();
      },
      /**
       * Stop all of watchQuery subscriptions
       */
      ngOnDestroy() {
        this[apolloProp].unsubscribe();
      },
    };

    // attach hooks
    forIn(hooks, (hook, name) => {
      wrapPrototype(name, hook);
    });

    /**
     * Creates a new prototype method which is a wrapper function
     * that calls new function before old one.
     *
     * @param  {string}   name
     * @param  {Function} func
     */
    function wrapPrototype(name: string, func: Function) {
      oldHooks[name] = sourceTarget.prototype[name];
      // create a wrapper
      target.prototype[name] = function(...args) {
        // to call a new prototype method
        func.apply(this, args);

        // call the old prototype method
        if (oldHooks[name]) {
          oldHooks[name].apply(this, args);
        }
      };
    }

    // return decorated target
    return target;
  };
}
