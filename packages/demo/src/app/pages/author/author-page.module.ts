import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthorPageComponent} from './author-page.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AuthorPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorPageRoutingModule {}

@NgModule({
  declarations: [AuthorPageComponent],
  imports: [CommonModule, AuthorPageRoutingModule],
})
export class AuthorPageModule {}
