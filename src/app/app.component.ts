import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';

declare var window: any;
declare var AndroidFullScreen: any;

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

      // Ocultar SplashScreen
      await SplashScreen.hide();

      // Configurar StatusBar
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setStyle({ style: Style.Dark });

      // Bloquear orientación vertical
      await this.lockOrientation();

      // Mantener pantalla encendida
      this.keepScreenAwake();

      // Activar modo inmersivo en Android
      this.activateImmersiveMode();

      // Precargar sonido sin latencia
      this.preloadTimeoutSound();

    } catch (err) {
      console.log('❌ Error configurando la app', err);
    }
  }

  private async lockOrientation() {
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch (error) {
      console.warn('❌ No se pudo bloquear la orientación:', error);
    }
  }

  private keepScreenAwake() {
    if (window.plugins && window.plugins.insomnia) {
      window.plugins.insomnia.keepAwake();
    } else {
      console.warn('❌ Plugin Insomnia no disponible');
    }
  }

  private activateImmersiveMode() {
    if (window.AndroidFullScreen) {
      AndroidFullScreen.immersiveMode(
        (error: any) => console.error('❌ Error al activar modo inmersivo', error)
      );
    } else {
      console.warn('❌ AndroidFullScreen plugin no disponible');
    }
  }

  private preloadTimeoutSound() {
    if (window.plugins && window.plugins.NativeAudio) {
      window.plugins.NativeAudio.preloadSimple(
        'timeout',
        'assets/sounds/time-out.ogg',
        (err: any) => console.error('❌ Error al precargar sonido', err)
      );
    } else {
      console.warn('❌ NativeAudio plugin no disponible');
    }
  }
}
