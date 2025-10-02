import { Injectable, signal, computed} from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ConfigurationData } from '../interfaces/configuration-data.interface';

interface TurnTimerState {
  timeLeft: number;
  running: boolean;
  rafId: number;
  lastTimestamp: number;
  paused:boolean;
}

@Injectable({ providedIn: 'root' })
export class TurnTimerService {


  constructor() {
    this.clickSound.load();
  }

 private timers: Record<1 | 2, TurnTimerState> = {
  1: {
    timeLeft: 0,
    running: false,
    rafId: 0,
    lastTimestamp: 0,
    paused: false
  },
  2: {
    timeLeft: 0,
    running: false,
    rafId: 0,
    lastTimestamp: 0,
    paused: false
  }
};

  private clickSound = new Audio('assets/sounds/next.ogg');

  private originalDurationMs = 0;

  private _timeLeft1 = signal(0);
  private _timeLeft2 = signal(0);
  private _activePlayer = signal<1 | 2 | null>(null);
  private _turnTimerWasModified = signal<boolean>(false);

  private onAutoSwitchCallback?: () => void;

  private _showPopUp = signal(false);

  public showPopUp = computed(() => this._showPopUp());
  public activePlayer = computed(() => this._activePlayer());
  public turnTimerWasModified = computed(() => this._turnTimerWasModified());

  private autoSwitchedTurn = signal(false);

  public setAutoSwitchedTurn(value: boolean) {
    this.autoSwitchedTurn.set(value);
  }

  public wasAutoSwitchedTurn() {
    return this.autoSwitchedTurn();
  }

  get timeLeft1() {
    return this._timeLeft1.asReadonly();
  }

  get timeLeft2() {
    return this._timeLeft2.asReadonly();
  }

  async getStoreData<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    return value ? (JSON.parse(value) as T) : null;
  }

  setShowPopUp(value: boolean) {
  this._showPopUp.set(value);
  }

  parseDurationToMs(duration: string): number {
    const [mm, ss] = duration.split(':').map(Number);
    return (mm || 0) * 60000 + (ss || 0) * 1000;
  }

  markTurnTimerAsModified(value: boolean) {
    this._turnTimerWasModified.set(value);
  }

  initTimers(ms: number) {
    this.originalDurationMs = ms;

    this.timers[1].timeLeft = ms;
    this.timers[2].timeLeft = ms;

    this._timeLeft1.set(ms);
    this._timeLeft2.set(ms);

    this._activePlayer.set(null);

    this.stopAll();
  }

  startTurn(player: 1 | 2) {
    if (player !== 1 && player !== 2) {
      console.error(`startTurn: player inválido '${player}'. Debe ser 1 o 2.`);
      return;
    }

    this.stopAll();

    this.timers[player].timeLeft = this.originalDurationMs;
    this.updateSignal(player, this.originalDurationMs);

    this._activePlayer.set(player);

    const timer = this.timers[player];
    timer.running = true;
    timer.lastTimestamp = performance.now();
    this.tick(player);
  }

  async switchTurn(currentPlayer: 1 | 2) {
    const config = await this.getStoreData<ConfigurationData>('configuration');
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    this.startTurn(nextPlayer);

    if (this.onAutoSwitchCallback) {
      this.onAutoSwitchCallback();
    }
    if(config?.soundEnabled){
      this.clickSound.play();
    }
  }

  private tick(player: 1 | 2) {
  const timer = this.timers[player];
  if (!timer.running) return;

  const now = performance.now();
  const elapsed = now - timer.lastTimestamp;
  timer.lastTimestamp = now;

  timer.timeLeft -= elapsed;

  if (timer.timeLeft <= 0) {
    timer.timeLeft = 0;
    timer.running = false;
    this.updateSignal(player, 0);

    this.switchTurn(player);

    return;
  }


  this.updateSignal(player, timer.timeLeft);
  timer.rafId = requestAnimationFrame(() => this.tick(player));
}

  public isRunning(player: 1 | 2): boolean {
    return this.timers[player]?.running ?? false;
  }

  private stopAll() {
    [1, 2].forEach((p) => {
      const t = this.timers[p as 1 | 2];
      cancelAnimationFrame(t.rafId);
      t.running = false;
    });
  }

 pauseTurnTimer(player: 1 | 2) {
  const timer = this.timers[player];
  if (timer.running) {
    cancelAnimationFrame(timer.rafId);
    timer.running = false;
    this.timers[player].paused = true;
  }
}

resumeTurnTimer(player: 1 | 2) {
  const timer = this.timers[player];1
  if (!timer.running && timer.timeLeft > 0 && timer.paused) {
    timer.running = true;
    timer.lastTimestamp = performance.now();
    this.tick(player);
  }
}

isPaused(player: 1 | 2): boolean {
  return this.timers[player].paused === true;
}

unpauseAll(): void {
  this.timers[1].paused = false;
  this.timers[2].paused = false;
}

  private updateSignal(player: 1 | 2, value: number) {
    if (player === 1) {
      this._timeLeft1.set(value);
    } else {
      this._timeLeft2.set(value);
    }
  }


  setAutoSwitchCallback(callback: () => void) {
    this.onAutoSwitchCallback = callback;
  }
}
