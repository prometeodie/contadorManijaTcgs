import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare var window: any;

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private soundEnabled = false;
  private loadedSounds = new Set<string>();
  private soundEnabledSubject = new BehaviorSubject<boolean>(this.soundEnabled);
  public soundEnabled$ = this.soundEnabledSubject.asObservable();

  constructor() {}

  enableSound() {
    this.soundEnabled = true;
    this.soundEnabledSubject.next(true);
  }

  disableSound() {
    this.soundEnabled = false;
    this.soundEnabledSubject.next(false);
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  preloadSimple(key: string, assetPath: string): void {
    if (!window.plugins?.NativeAudio) {
      console.warn('❌ NativeAudio plugin no disponible');
      return;
    }

    if (this.loadedSounds.has(key)) {
      return;
    }

    window.plugins.NativeAudio.preloadSimple(
      key,
      assetPath,
      () => {
        this.loadedSounds.add(key);
      },
      (err: any) => console.error(`❌ Error al precargar sonido '${key}':`, err)
    );
  }

  play(key: string): void {
    if (!this.soundEnabled) return;

    if (!window.plugins?.NativeAudio) {
      console.warn('❌ NativeAudio plugin no disponible');
      return;
    }

    window.plugins.NativeAudio.play(
      key,
      (err: any) => console.error(`❌ Error al reproducir '${key}':`, err)
    );
  }

  unload(key: string): void {
    if (!window.plugins?.NativeAudio) return;

    if (this.loadedSounds.has(key)) {
      window.plugins.NativeAudio.unload(
        key,
        () => {
          this.loadedSounds.delete(key);
        },
        (err: any) => console.error(`❌ Error al descargar sonido '${key}':`, err)
      );
    }
  }

  unloadAll(): void {
    this.loadedSounds.forEach(key => this.unload(key));
  }
}
