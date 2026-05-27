import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export type TokenIcon = {
  id: string;
  icon: string;
};

@Injectable({
  providedIn: 'root',
})
export class TokenIconsService {

  private readonly PLAYER_1_KEY = 'player_1_icons';

  private readonly PLAYER_2_KEY = 'player_2_icons';

  async savePlayerIcons(
    player: 1 | 2,
    icons: TokenIcon[]
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
  ): Promise<TokenIcon[]> {

    const key =
      player === 1
        ? this.PLAYER_1_KEY
        : this.PLAYER_2_KEY;

    const { value } = await Preferences.get({ key });

    if(!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    // Compatibilidad con datos viejos guardados como string[]
    if(
      Array.isArray(parsed) &&
      typeof parsed[0] === 'string'
    ) {

      return parsed.map((icon: string) => ({
        id: crypto.randomUUID(),
        icon
      }));

    }

    return parsed;

  }

}
