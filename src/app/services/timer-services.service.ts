import { computed, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export type TimerCommand = 'start' | 'pause' | 'reset' | 'stop';

@Injectable({
  providedIn: 'root'
})
export class TimerServicesService {
  private _totalSeconds = signal(0);
  totalSeconds = computed(() => this._totalSeconds());

  private _isRunning = signal(false);
  isRunning = computed(() => this._isRunning());

  private intervalId: any;
  private finishedCallback: (() => void) | null = null;

  private commandSubject = new Subject<TimerCommand>();
  commands$ = this.commandSubject.asObservable();

  sendCommand(cmd: TimerCommand) {
    this.commandSubject.next(cmd);
    if(cmd === 'start') {
      this._isRunning.set(true);
    }
    if(cmd === 'pause'){
      this._isRunning.set(false);
    }
  }

  setInitialTime(seconds: number) {
    this._totalSeconds.set(seconds);
  }

  startCountdown(onFinish?: () => void) {
    this.stopCountdown();

    this.finishedCallback = onFinish ?? null;
    this._isRunning.set(true);

    this.intervalId = setInterval(() => {
      const current = this._totalSeconds();
      if (current > 0) {
        this._totalSeconds.set(current - 1);
      } else {
        this.stopCountdown();
        if (this.finishedCallback) this.finishedCallback();
      }
    }, 1000);
  }

  stopCountdown() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this._isRunning.set(false); // <- CAMBIO
  }

  resetCountdown() {
    this.stopCountdown();
    this._totalSeconds.set(0);
  }

  pause() {
    this.stopCountdown(); // <- usa stop pero deja el tiempo intacto
  }

  resume() {
    this.startCountdown(this.finishedCallback ?? undefined); // <- reinicia desde donde estaba
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
}
