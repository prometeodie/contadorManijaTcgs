import { Injectable } from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, RewardAdOptions } from '@capacitor-community/admob';
import { Preferences } from '@capacitor/preferences';
;

@Injectable({
  providedIn: 'root',
})
export class AdsService {

  private COUNTER_KEY = 'videoAdCounter';
  constructor() {
    this.initializeAdmob();
  }

  public async initializeAdmob() {
    await AdMob.initialize({
      initializeForTesting: true, // ⚠️ Cambiar a false en producción
    });
    console.log('✅ AdMob inicializado');
  }

  // -------------------
  // 🚀 Banner
  // -------------------
  async showBanner(adId: string) {
    const options: BannerAdOptions = {
      adId, // usa ID real o de prueba
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    };
    await AdMob.showBanner(options);
  }

  async hideBanner() {
    await AdMob.hideBanner();
  }

  // -------------------
  // 🚀 Interstitial
  // -------------------
  async showInterstitial(adId: string) {
  await AdMob.prepareInterstitial({ adId });
  await AdMob.showInterstitial();
}

  // -------------------
  // 🚀 Rewarded
  // -------------------
  async showRewarded(adId: string) {
    const options: RewardAdOptions = {
      adId,
    };
    await AdMob.prepareRewardVideoAd(options);
    await AdMob.showRewardVideoAd();
  }

    async saveCounter(value: number) {
    await Preferences.set({ key: this.COUNTER_KEY, value: value.toString() });
    console.log(`💾 Guardado contador con valor: ${value}`);
  }

  async increaseCounterAndCheck() {
    const adId = 'ca-app-pub-3940256099942544/5224354917';

    const { value } = await Preferences.get({ key: this.COUNTER_KEY });
    let counter = value ? parseInt(value, 10) : 0;

    counter++;

    if (counter >= 3) {
      await this.showRewarded(adId);
      counter = 0;
    }
    await this.saveCounter(counter);

    return counter;
  }

  async getCounter(): Promise<number> {
    const { value } = await Preferences.get({ key: this.COUNTER_KEY });
    return value ? parseInt(value, 10) : 0;
  }
}
