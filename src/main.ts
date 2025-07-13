import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';


// 🔧 APLICAR TEMA (modificá según prefieras 'dark' o 'light')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Podés forzar manualmente:
document.body.classList.add('dark'); // O 'light'

// O usar el modo automático:
if (prefersDark) {
  document.body.classList.add('dark');
} else {
  document.body.classList.add('light');
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
