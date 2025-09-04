import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';
import { LanguagesService } from './services/lenguages.service';
import { AppUpdate } from '@capawesome/capacitor-app-update';

declare var window: any;
declare var AndroidFullScreen: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  defaultLang = 'en';

  constructor(
    private platform: Platform,
    private languages: LanguagesService,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // Inicializar idioma guardado
    await this.languages.initLanguage();

    try {
      await SplashScreen.hide();
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setStyle({ style: Style.Dark });

      await this.lockOrientation();
      this.keepScreenAwake();
      this.activateImmersiveMode();
      this.preloadTimeoutSound();

      // 🚀 Inicializamos AdMob (si corresponde)

      // 🔄 Chequear si hay actualización disponible
      await this.checkForUpdate();

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

  // ==========================
  // 🔄 In-App Updates
  // ==========================
  private async checkForUpdate() {
    try {
      const result = await AppUpdate.getAppUpdateInfo();

      // 2 significa que hay una actualización disponible
      if (result.updateAvailability === 2) {
        // ✅ Immediate Update (bloquea hasta actualizar)
        await AppUpdate.performImmediateUpdate();

        // 👇 Flexible Update (descarga en background)
        // await AppUpdate.startFlexibleUpdate();
      }
    } catch (err) {
      console.warn('❌ Error chequeando actualización:', err);
    }
  }
}
