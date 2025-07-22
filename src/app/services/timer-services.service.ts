import { computed, Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { DataServicesService } from 'src/app/services/data-services.service';
import { ConfigurationData } from '../interfaces/configuration-data.interface';

export type TimerCommand = 'start' | 'pause' | 'reset' | 'stop';

@Injectable({
  providedIn: 'root'
})
export class TimerServicesService {
  private dataServices = inject(DataServicesService);

  private _totalSeconds = signal(0);
  public totalSeconds = computed(() => this._totalSeconds());

  private _isRunning = signal(false);
  public isRunning = computed(() => this._isRunning());

  private _showBubble = signal(true);
  public showBubble = computed(() => this._showBubble());

  // NUEVA signal que indica si el contador de ronda está activo
  private _isRoundTimerRunning = signal(false);
  public isRoundTimerRunning = computed(() => this._isRoundTimerRunning());

  private intervalId: any;
  private finishedCallback: (() => void) | null = null;

  private commandSubject = new Subject<TimerCommand>();
  public commands$ = this.commandSubject.asObservable();

  private roundEndSound = new Audio('assets/sounds/time-out.ogg');

  constructor() {
    this.roundEndSound.load();
  }

  sendCommand(cmd: TimerCommand) {
    this.commandSubject.next(cmd);
    if (cmd === 'start') {
      this._isRunning.set(true);
      this._isRoundTimerRunning.set(true);  // Se activa la señal al iniciar
    }
    if (cmd === 'pause') {
      this._isRunning.set(false);
      this._isRoundTimerRunning.set(false); // Se desactiva la señal al pausar
    }
  }

  showBubblePopUp(show: boolean): void {
    this._showBubble.set(show);
  }

  setInitialTime(seconds: number) {
    this._totalSeconds.set(seconds);
  }

 startCountdown(onFinish?: () => void) {
  if (this._totalSeconds() <= 0) {
    console.warn('⏳ No se inició el contador porque el tiempo es cero');
    return;
  }

  this.stopCountdown();
  this.finishedCallback = onFinish ?? null;
  this._isRunning.set(true);
  this._isRoundTimerRunning.set(true);

  this.intervalId = setInterval(() => {
    const current = this._totalSeconds();

    if (current > 0) {
      this._totalSeconds.set(current - 1);
    } else {
      this.stopCountdown();
      this.playEndSound();
      if (this.finishedCallback) this.finishedCallback();
    }
  }, 1000);
}

  private async playEndSound() {
    try {
      const soundEnabled = await this.dataServices.get<ConfigurationData>('configuration');
      if (!soundEnabled?.soundEnabled) return;

      this.roundEndSound.currentTime = 0;
      await this.roundEndSound.play();
    } catch (e) {
      console.warn('No se pudo reproducir el sonido de fin de ronda:', e);
    }
  }

  setIsRunningFalse(): void {
    this._isRunning.set(false);
    this._isRoundTimerRunning.set(false); // Parar también la señal
  }

  stopCountdown() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this._isRunning.set(false);
    this._isRoundTimerRunning.set(false); // Actualizo señal
  }

  resetCountdown() {
    this.stopCountdown();
    this._totalSeconds.set(0);
    this._isRoundTimerRunning.set(false); // Por las dudas la pongo en false
  }

  pause() {
    this.stopCountdown();
  }

  resume() {
    this.startCountdown(this.finishedCallback ?? undefined);
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
