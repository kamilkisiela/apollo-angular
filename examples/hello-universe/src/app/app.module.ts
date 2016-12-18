import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Angular2Apollo, APOLLO_DIRECTIVES, SelectPipe} from 'angular2-apollo';
import { AppComponent } from './app.component';
import { MyApolloModule } from './client';
import { ConfigService } from './config.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MyApolloModule
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent],
})
export class AppModule {}
