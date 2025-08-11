import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class BackgroundImagesService {

  constructor() {}

  async selectImageFromGallery(player: 'imgplayer1' | 'imgplayer2'): Promise<boolean> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      if (!image || !image.base64String || !image.format) {
        return false;
      }

      const base64Data = `data:image/${image.format};base64,${image.base64String}`;
      const resizedImage = await this.resizeBase64Img(base64Data, 800, 800);

      const fileName = `${player}.jpg`;

      // Guardar imagen en almacenamiento interno
      await Filesystem.writeFile({
        path: fileName,
        data: resizedImage.split(',')[1], // quitamos el "data:image/jpeg;base64,"
        directory: Directory.Data
      });

      // Guardar referencia en localStorage para recuperación futura
      localStorage.setItem(`${player}`, fileName);
      localStorage.setItem(`${player}_imgbg`, 'true');

      return true;
    } catch (error) {
      const errMsg = (error as Error)?.message || '';

      if (errMsg.includes('cancel') || errMsg.includes('User cancelled')) {
        console.log('Selección cancelada por el usuario. No se modifica nada.');
        return false;
      }

      console.error('Error seleccionando imagen:', error);

      localStorage.setItem(`${player}_imgbg`, 'false');
      return false;
    }
  }

  // Lee la imagen actual desde el Filesystem (si existe)
  async getImage(player: 'imgplayer1' | 'imgplayer2'): Promise<string | null> {
    const savedPath = localStorage.getItem(`${player}`);
    if (!savedPath) return null;

    try {
      const file = await Filesystem.readFile({
        path: savedPath,
        directory: Directory.Data
      });
      return `data:image/jpeg;base64,${file.data}`;
    } catch {
      return null;
    }
  }

  // Carga la imagen si ya fue guardada previamente
  async loadSavedImage(player: 'imgplayer1' | 'imgplayer2'): Promise<string | null> {
    return this.getImage(player);
  }

  removeImage(player: 'imgplayer1' | 'imgplayer2'): void {
    localStorage.removeItem(`${player}`);
    localStorage.setItem(`${player}_imgbg`, 'false');

    // Eliminar también el archivo del almacenamiento interno
    Filesystem.deleteFile({
      path: `${player}.jpg`,
      directory: Directory.Data
    }).catch(() => {
      console.warn(`No se pudo eliminar el archivo de ${player}`);
    });
  }

  private async resizeBase64Img(base64Str: string, maxWidth = 800, maxHeight = 600): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };

      img.src = base64Str;
    });
  }
}
