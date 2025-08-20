import { Injectable } from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize, RewardAdOptions } from '@capacitor-community/admob';
;

@Injectable({
  providedIn: 'root',
})
export class AdsService {
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
}
