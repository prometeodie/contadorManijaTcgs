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
    Camera: {
      photoAlbumPermission: 'Necesitamos acceso a tus fotos para que puedas seleccionar imágenes de fondo',
      cameraPermission: 'Necesitamos acceso a tu cámara para tomar fotos',
      promptToSelectPhotos: true,  // Android 13+ permite seleccionar fotos específicas
    },
    Permissions: {
      photos: {
        name: 'photos',
        include: ['read', 'write'],
        maxAge: 30  // Días antes de volver a pedir permiso si fue denegado
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
    buildOptions: {
      keystorePath: 'path/to/your/keystore.jks',
      keystoreAlias: 'your-alias',
    }
  }
};

export default config;
