import { Injectable } from '@angular/core';
import {
  AdMob,
  BannerAdOptions,
  BannerAdPosition,
  BannerAdSize,
  RewardAdOptions,
} from '@capacitor-community/admob';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  private COUNTER_KEY = 'videoAdCounter';

  constructor() {
    this.initializeAdmob();
  }

  // -------------------
  // 🚀 Inicialización
  // -------------------
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
    await AdMob.removeBanner().catch(() => {});

    const options: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    };

    await AdMob.showBanner(options);
    console.log('📢 Banner mostrado');
  }

  async hideBanner() {
    await AdMob.hideBanner().catch(() => {});
    console.log('📢 Banner ocultado');
  }

  async removeBanner() {
    await AdMob.removeBanner().catch(() => {});
    console.log('🗑️ Banner destruido');
  }

  // -------------------
  // 🚀 Interstitial
  // -------------------
  async showInterstitial(adId: string) {
    await AdMob.prepareInterstitial({ adId });
    await AdMob.showInterstitial();
    console.log('🎬 Interstitial mostrado');
  }
  
  // -------------------
  // 🚀 Rewarded (Video con recompensa)
  // -------------------
  async showRewarded(adId: string) {
    const options: RewardAdOptions = { adId };
    await AdMob.prepareRewardVideoAd(options);
    await AdMob.showRewardVideoAd();
    console.log('🎁 Rewarded mostrado');
  }


  async saveCounter(value: number) {
    await Preferences.set({ key: this.COUNTER_KEY, value: value.toString() });
    console.log(`💾 Guardado contador con valor: ${value}`);
  }

  async increaseCounterAndCheck() {
    const adId = INTERSTITIAL;

    const { value } = await Preferences.get({ key: this.COUNTER_KEY });
    let counter = value ? parseInt(value, 10) : 0;

    counter++;

    if (counter > 3) {
      await this.showInterstitial(adId);
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
