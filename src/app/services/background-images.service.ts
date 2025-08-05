import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class BackgroundImagesService {

  constructor() {}

  async selectImageFromGallery(player: 'imgplayer1' | 'imgplayer2'): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      const base64Data = `data:image/${image.format};base64,${image.base64String}`;

      const resizedImage = await this.resizeBase64Img(base64Data, 800, 800);

      localStorage.setItem(player, resizedImage);
      localStorage.setItem(`${player}_imgbg`, 'true');
    } catch (error) {
      const errMsg = (error as Error)?.message || '';

  if (errMsg.includes('cancel') || errMsg.includes('User cancelled')) {
    console.log('Selección cancelada por el usuario. No se modifica nada.');
    return;
  }

  console.error('Error seleccionando imagen:', error);
  localStorage.setItem(`${player}_imgbg`, 'false');
    }
  }

  getImage(player: 'imgplayer1' | 'imgplayer2'): string | null {
    return localStorage.getItem(player);
  }

  removeImage(player: 'imgplayer1' | 'imgplayer2'): void {
    localStorage.removeItem(player);
    localStorage.removeItem(`${player}_imgbg`);
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

        // Comprimir como JPEG (calidad 70%)
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };

      img.src = base64Str;
    });
  }
}
