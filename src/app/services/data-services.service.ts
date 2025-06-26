import { Storage } from '@capacitor/storage';
import {Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataServicesService {

  constructor() { }

  defaultConfig = {
    hpValue: 20,
    roundTimerDuration: '00:01:00',
    turnTimerDuration: '00:10',
    chessTimerConfig:{duration: '00:01:00', increment: '00:10', chessTimerEnabled: false, mode:'bullet'},
    roundTimerEnabled: true,
    turnTimerEnabled: true,
    player1Color: '#ff004a',
    player2Color: '#4250fe',
    threeMatches: true,
    soundEnabled: true
  };

  async set(key: string, value: any): Promise<void> {
    await Storage.set({
      key,
      value: JSON.stringify(value),
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const { value } = await Storage.get({ key });
    return value ? (JSON.parse(value) as T) : null;
  }

  async remove(key: string): Promise<void> {
    await Storage.remove({ key });
  }

  async clear(): Promise<void> {
    await Storage.clear();
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
}
}
