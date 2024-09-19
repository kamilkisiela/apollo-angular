import { Routes } from '@angular/router';
import { MoviePageComponent } from './pages/movie/movie-page.component';
import { MoviesPageComponent } from './pages/movies/movies-page.component';

export const routes: Routes = [
  {
    path: 'movie',
    component: MoviesPageComponent,
  },
  {
    path: 'movie/:id',
    component: MoviePageComponent,
  },
  {
    path: '**',
    redirectTo: '/movie',
  },
];
