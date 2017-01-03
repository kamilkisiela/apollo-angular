import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ApolloModule } from 'angular2-apollo';

import { AppComponent } from './app.component';
import client from './client';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ApolloModule.withClient(client)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
