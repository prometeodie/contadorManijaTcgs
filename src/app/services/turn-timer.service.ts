import { Injectable, signal, computed } from '@angular/core';

interface TurnTimerState {
  timeLeft: number;
  running: boolean;
  rafId: number;
  lastTimestamp: number;
}

@Injectable({ providedIn: 'root' })
export class TurnTimerService {
  private timers: Record<1 | 2, TurnTimerState> = {
    1: { timeLeft: 0, running: false, rafId: 0, lastTimestamp: 0 },
    2: { timeLeft: 0, running: false, rafId: 0, lastTimestamp: 0 },
  };

  private originalDurationMs = 0;

  private _timeLeft1 = signal(0);
  private _timeLeft2 = signal(0);
  private _activePlayer = signal<1 | 2 | null>(null);
  private _turnTimerWasModified = signal<boolean>(false);

  private onAutoSwitchCallback?: () => void; // ✅ Nuevo callback

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

  switchTurn(currentPlayer: 1 | 2) {
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    this.startTurn(nextPlayer);

    // ✅ Llamamos al callback cuando el turno cambia automáticamente
    if (this.onAutoSwitchCallback) {
      this.onAutoSwitchCallback();
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

      // ✅ Llamamos a switchTurn y disparamos el callback
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
    }
  }

  resumeTurnTimer(player: 1 | 2) {
    const timer = this.timers[player];
    if (!timer.running && timer.timeLeft > 0) {
      timer.running = true;
      timer.lastTimestamp = performance.now();
      this.tick(player);
    }
  }

  private updateSignal(player: 1 | 2, value: number) {
    if (player === 1) {
      this._timeLeft1.set(value);
    } else {
      this._timeLeft2.set(value);
    }
  }

  // ✅ Nuevo método público para setear el callback externo
  setAutoSwitchCallback(callback: () => void) {
    this.onAutoSwitchCallback = callback;
  }
}
