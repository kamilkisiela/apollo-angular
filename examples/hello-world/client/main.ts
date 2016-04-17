import {bootstrap} from "angular2/platform/browser";
import {Component, Injectable} from "angular2/core";
import {ApolloQueryPipe, APOLLO_ANGULAR2_PROVIDERS, ApolloAngular2} from "angular2-apollo";

@Component({
  selector: 'app',
  templateUrl: 'client/main.html',
  pipes: [ApolloQueryPipe]
})
@Injectable()
class Main {
  obs : any;

  constructor(private angularApollo : ApolloAngular2) {
    const client = angularApollo.createNetworkInterface('http://localhost:8080');

    this.obs = client.watchQuery({
      query: `
        query getPosts($tag: String) {
          posts(tag: $tag) {
            title
          }
        }
      `,
      variables: {
        tag: "1234"
      }
    });
  }
}

bootstrap(Main, [APOLLO_ANGULAR2_PROVIDERS]);