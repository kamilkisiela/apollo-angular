import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloModule } from 'angular2-apollo';

import { AppComponent } from './app.component';
import { client } from './client';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // Define the default ApolloClient
    ApolloModule.withClient(client),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
