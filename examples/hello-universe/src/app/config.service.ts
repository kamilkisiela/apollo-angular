import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
url: string = 'http://localhost:4300/';

  constructor() { }
    getGraphQLUrl() {
      return this.url + 'graphql';
    }
}
