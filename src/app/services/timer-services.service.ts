import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerServicesService {
  public totalSeconds = signal<number>(0);

  counter() {
    const newValue = this.totalSeconds() - 1;
    this.totalSeconds.set(newValue >= 0 ? newValue : 0);
  }

  timerTime(time: number) {
    this.totalSeconds.set(time);
  }
}
