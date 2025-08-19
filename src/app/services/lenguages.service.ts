import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private defaultLang = 'en';
  private storageKey = 'app_language';

constructor(private translate: TranslateService) {
  this.translate.addLangs(['en', 'es']);
  this.translate.use(this.defaultLang);
}

  /** Inicializa el idioma al iniciar la app */
  async initLanguage() {
    const { value } = await Preferences.get({ key: this.storageKey });
    const lang = value || this.defaultLang;
    this.setLanguage(lang);
  }

  /** Cambiar idioma */
  async setLanguage(lang: string) {
    this.translate.use(lang);
    await Preferences.set({ key: this.storageKey, value: lang });
  }

  /** Obtener idioma actual */
  getCurrentLang(): string {
    return this.translate.currentLang || this.defaultLang;
  }

  /** Lista de idiomas disponibles */
  getLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ];
  }
}
