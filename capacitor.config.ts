import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.franco.contador',
  appName: 'Time to Duel - Tcgs',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    StatusBar: {
      overlaysWebView: false,
      style: 'DEFAULT',
      backgroundColor: '#000000', // ← que matchee con tu app
    },
    Camera: {
      photoAlbumPermission: 'Necesitamos acceso a tus fotos para que puedas seleccionar imágenes de fondo',
      cameraPermission: 'Necesitamos acceso a tu cámara para tomar fotos',
      promptToSelectPhotos: true,
    },
    Permissions: {
      photos: {
        name: 'photos',
        include: ['read', 'write'],
        maxAge: 30
      },
      camera: {
        name: 'camera',
        include: ['camera'],
        maxAge: 30
      }
    }
  },
  android: {
    allowMixedContent: true,
    adjustMarginsForEdgeToEdge: 'auto',
} as any,
};

export default config;
