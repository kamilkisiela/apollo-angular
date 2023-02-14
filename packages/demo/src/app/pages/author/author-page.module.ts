import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorPageComponent } from './author-page.component';

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
