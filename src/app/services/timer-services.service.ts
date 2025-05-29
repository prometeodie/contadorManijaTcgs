import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerServicesService {
  private _totalSeconds = signal(0);
  totalSeconds = computed(() => this._totalSeconds());
  private intervalId: any;
  private finishedCallback: (() => void) | null = null;

  setInitialTime(seconds: number) {
    this._totalSeconds.set(seconds);
  }

  startCountdown(onFinish?: () => void) {
    if (this.intervalId) clearInterval(this.intervalId); // evita duplicados
    this.finishedCallback = onFinish ?? null;

    this.intervalId = setInterval(() => {
      const current = this._totalSeconds();
      if (current > 0) {
        this._totalSeconds.set(current - 1);
      } else {
        clearInterval(this.intervalId);
        this.intervalId = null;
        if (this.finishedCallback) this.finishedCallback();
      }
    }, 1000);
  }

  formattedTime() {
    const total = this.totalSeconds();
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  }

  stopCountdown() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  resetCountdown() {
    this.stopCountdown();
    this._totalSeconds.set(0);
  }
}
