import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, AlertController } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapacitorApp } from '@capacitor/app'; // 👈 Importar App

declare var window: any;
declare var AndroidFullScreen: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private expirationDate = new Date('2025-07-23'); // 🔒 Cambiá esta fecha cuando quieras

  constructor(
    private platform: Platform,
    private alertController: AlertController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    if (this.isExpired()) {
      this.showExpirationAlert();
      return;
    }

    try {
      await SplashScreen.hide();
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setStyle({ style: Style.Dark });

      await this.lockOrientation();
      this.keepScreenAwake();
      this.activateImmersiveMode();
      this.preloadTimeoutSound();

    } catch (err) {
      console.log('❌ Error configurando la app', err);
    }
  }

  private isExpired(): boolean {
    const now = new Date();
    return now > this.expirationDate;
  }

  private async showExpirationAlert() {
    const alert = await this.alertController.create({
      header: 'Actualización requerida',
      message: 'Esta versión ha vencido. Descargá la nueva versión para continuar, o verificá si la app ya cuenta con soporte en el Play Store.',
      buttons: [
        {
          text: 'Descargar',
          handler: async () => {
            window.open(
              'https://drive.google.com/drive/folders/1XfpjvcxcbtDYjjF0XED5Je0ewab8vUIZ?usp=sharing',
              '_system'
            );
            await CapacitorApp.exitApp(); // 👈 Cerrar la app después de abrir el link
          }
        }
      ],
      backdropDismiss: false,
      cssClass: 'alert-expired'
    });

    await alert.present();
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
