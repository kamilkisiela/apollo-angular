import { Component } from '@angular/core';

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
})
export class AppComponent {}
