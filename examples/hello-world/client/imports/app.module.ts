import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ApolloModule } from 'angular2-apollo';

import { AppComponent } from './app.component';
import { client } from './client';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    ApolloModule.withClient(client),
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
