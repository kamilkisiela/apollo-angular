import {
  bootstrap,
} from "angular2/platform/browser";

import {
  Component,
  Injectable,
} from "angular2/core";

import {
  Apollo,
} from 'angular2-apollo';

import ApolloClient, {
  createNetworkInterface,
} from 'apollo-client';

import {
  Observable,
} from 'rxjs/Rx';

const client = new ApolloClient({
  networkInterface: createNetworkInterface('/graphql'),
});

@Component({
  selector: 'app',
  templateUrl: 'client/main.html',
  pipes: [ApolloQueryPipe],
})
@Injectable()
@Apollo({
  client
})
class Main {
  users: Observable<any[]>;

  constructor() {    
  }
}

bootstrap(Main);
