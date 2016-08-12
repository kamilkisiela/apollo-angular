import 'reflect-metadata';
import 'rxjs';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './imports/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
