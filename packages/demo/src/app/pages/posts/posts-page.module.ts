import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PostsPageComponent} from './posts-page.component';
import {UpvoterComponent} from './upvoter.component';

const routes: Routes = [
  {
    path: '',
    component: PostsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsPageRoutingModule {}

@NgModule({
  declarations: [PostsPageComponent, UpvoterComponent],
  imports: [CommonModule, PostsPageRoutingModule],
})
export class PostsPageModule {}
