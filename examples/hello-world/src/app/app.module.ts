import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloModule } from 'apollo-angular';

import { AppComponent } from './app.component';
import { getClient } from './client';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // Define the default ApolloClient
    ApolloModule.withClient(getClient),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
