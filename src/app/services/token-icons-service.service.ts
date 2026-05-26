import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class TokenIconsService {

  private readonly PLAYER_1_KEY = 'player_1_icons';
  private readonly PLAYER_2_KEY = 'player_2_icons';

  async savePlayerIcons(
    player: 1 | 2,
    icons: string[]
  ): Promise<void> {

    const key =
      player === 1
        ? this.PLAYER_1_KEY
        : this.PLAYER_2_KEY;

    await Preferences.set({
      key,
      value: JSON.stringify(icons),
    });
  }

  async getPlayerIcons(
    player: 1 | 2
  ): Promise<string[]> {

    const key =
      player === 1
        ? this.PLAYER_1_KEY
        : this.PLAYER_2_KEY;

    const { value } = await Preferences.get({ key });

    if (!value) {
      return [];
    }

    return JSON.parse(value);
  }

}
