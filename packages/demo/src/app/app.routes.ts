import { Routes } from '@angular/router';
import { AuthorPageComponent } from './pages/author/author-page.component';
import { PostsPageComponent } from './pages/posts/posts-page.component';

export const routes: Routes = [
  {
    path: 'posts',
    component: PostsPageComponent,
  },
  {
    path: 'author/:id',
    component: AuthorPageComponent,
  },
  {
    path: '**',
    redirectTo: '/posts',
  },
];
