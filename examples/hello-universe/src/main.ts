import './polyfills';

// import { platformBrowser } from '@angular/platform-browser';
// import { AppModuleNgFactory } from './aot/app/app.module.ngfactory';

// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

// if (environment.production) {
//   enableProdMode();
// }

platformBrowserDynamic().bootstrapModule(AppModule);
