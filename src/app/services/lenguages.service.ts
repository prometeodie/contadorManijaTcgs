import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {
  private defaultLang = 'en';
  private storageKey = 'app_language';

  private currentLangSubject = new BehaviorSubject<string>(this.defaultLang);
  currentLang$ = this.currentLangSubject.asObservable();

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
    this.currentLangSubject.next(lang);
  }

  /** Obtener idioma actual */
  getCurrentLang(): string {
    return this.translate.getCurrentLang() || this.defaultLang;
  }

  /** Lista de idiomas disponibles */
  getLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ];
  }
}
