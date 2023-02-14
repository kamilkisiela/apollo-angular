import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'posts',
    loadChildren: () => import('./pages/posts/posts-page.module').then(m => m.PostsPageModule),
  },
  {
    path: 'author/:id',
    loadChildren: () => import('./pages/author/author-page.module').then(m => m.AuthorPageModule),
  },
  {
    path: '**',
    redirectTo: '/posts',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
