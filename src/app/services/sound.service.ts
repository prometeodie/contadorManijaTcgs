import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private soundEnabled = false;

  enableSound() {
    this.soundEnabled = true;
    console.log('Sonido activado');
    // Aquí puedes poner la lógica real para activar sonido
  }

  disableSound() {
    this.soundEnabled = false;
    console.log('Sonido desactivado');
    // Aquí puedes poner la lógica real para pausar o mutear sonido
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }
}
