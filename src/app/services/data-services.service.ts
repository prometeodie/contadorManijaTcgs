import { Preferences } from '@capacitor/preferences';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataServicesService {

  constructor() {
    this.loadInitialConfig();
  }

  defaultConfig = {
    hpValue: 20,
    roundTimerDuration: '00:45:00',
    turnTimerDuration: '01:00',
    chessTimerConfig:{duration: '00:30:00', increment: '00:00', chessTimerEnabled: false, mode:'bullet'},
    roundTimerEnabled: true,
    turnTimerEnabled: true,
    player1Color: '#ff004a',
    player2Color: '#4250fe',
    threeMatches: true,
    soundEnabled: true,
    positionRight: true
  };

  private _configChangedSignal = signal<boolean>(false);
  public configChangedSignal = this._configChangedSignal.asReadonly();

  private _lifeAnimation = signal<boolean>(false);
  public lifeAnimation = this._lifeAnimation.asReadonly();

  private async loadInitialConfig() {
    const savedConfig = await this.get<typeof this.defaultConfig>('configuration');
    if (savedConfig) {
    }
  }

  async set(key: string, value: any): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    return value ? (JSON.parse(value) as T) : null;
  }

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  async clear(): Promise<void> {
    await Preferences.clear();
  }

  // Método para setear la signal boolean por parámetro
  public setConfigChanged(value: boolean) {
    this._configChangedSignal.set(value);
  }

  public setConfiglifeAnimation(value: boolean) {
    this._lifeAnimation.set(value);
  }

  async updateChessTimerConfig(newConfig: {
    duration: string;
    increment: string;
    chessTimerEnabled: boolean;
  }): Promise<void> {
    const key = 'configuration';
    const currentConfig = await this.get<typeof this.defaultConfig>(key);

    const updatedConfig = {
      ...this.defaultConfig,
      ...currentConfig,
      roundTimerEnabled:false,
      turnTimerEnabled:false,
      chessTimerConfig: {
        ...(currentConfig?.chessTimerConfig || this.defaultConfig.chessTimerConfig),
        ...newConfig,
      },
    };

    await this.set(key, updatedConfig);

    // Disparo el booleano a true para indicar cambio y luego vuelve a false
    this.setConfigChanged(true);
    setTimeout(() => {
      this.setConfigChanged(false);
    }, 200);
  }
}
