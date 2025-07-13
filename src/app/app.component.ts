import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    try {
      // Ocultar splash después de que la plataforma esté lista
      console.log('✅ Splash screen oculto');

      // Configurar StatusBar
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Dark });

      // Bloquear orientación
      await this.lockOrientation();

      // Mantener pantalla encendida
      this.keepScreenAwake();
      await SplashScreen.hide();
    } catch (err) {
      console.log('❌ Error configurando la app', err);
    }
  }

  private async lockOrientation() {
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
      console.log('✅ Orientación bloqueada a portrait');
    } catch (error) {
      console.warn('❌ No se pudo bloquear la orientación:', error);
    }
  }

  private keepScreenAwake() {
    if (window.plugins && window.plugins.insomnia) {
      window.plugins.insomnia.keepAwake();
      console.log('✅ Pantalla bloqueada para que no se apague');
    } else {
      console.warn('❌ Plugin Insomnia no disponible');
    }
  }
}
