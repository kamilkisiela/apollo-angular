import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloModule } from 'apollo-angular';

import { ConfigService } from './config.service';
import { AppComponent } from './app.component';
import { ConfiguredApolloModule } from './client';

@NgModule({
  declarations: [
    AppComponent,
  ],
  providers: [ConfigService],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // Define the default ApolloClient
    ConfiguredApolloModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
