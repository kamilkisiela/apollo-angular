import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <header>
        <h1>Blog</h1>
      </header>
      <router-outlet></router-outlet>
    </main>
  `,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {}
