import { Injectable, signal, computed, inject } from '@angular/core';
import { DataServicesService } from 'src/app/services/data-services.service';

interface TimerState {
  running: boolean;
  finished: boolean;
  timeLeft: number;
  rafId: number;
  lastTimestamp: number;
}

@Injectable({ providedIn: 'root' })
export class ChessTimerService {
  private timers: Record<1 | 2, TimerState> = {
    1: { running: false, finished: false, timeLeft: 0, rafId: 0, lastTimestamp: 0 },
    2: { running: false, finished: false, timeLeft: 0, rafId: 0, lastTimestamp: 0 },
  };

  private _activeTimer = signal<1 | 2 | null>(null);
  private gameOver = signal(false);
  private anyTimerRunning = signal(false);

  activeTimer = computed(() => this._activeTimer());
  isGameOver = computed(() => this.gameOver());
  isAnyTimerRunning = computed(() => this.anyTimerRunning());

  private _timeLeft1 = signal(0);
  private _timeLeft2 = signal(0);

  private dataService = inject(DataServicesService);

  private incrementMs = 0;

  timeLeft(player: 1 | 2) {
    return player === 1 ? this._timeLeft1 : this._timeLeft2;
  }

  initTimer(player: 1 | 2, ms: number) {
    const t = this.timers[player];
    t.timeLeft = ms;
    t.finished = false;
    t.running = false;
    cancelAnimationFrame(t.rafId);
    this.updateSignal(player, ms);
    this.updateAnyTimerRunning();
  }

  resetTimer(player: 1 | 2, ms: number) {
    this.initTimer(player, ms);
    if (this._activeTimer() === player) {
      this.clearTurn();
    }
    this.gameOver.set(false);
    this.updateAnyTimerRunning();
  }

  stop(player: 1 | 2) {
    const t = this.timers[player];
    t.running = false;
    cancelAnimationFrame(t.rafId);
    this.updateAnyTimerRunning();
  }

  setActiveTimer(player: 1 | 2) {
    if (this.gameOver()) return;

    this._activeTimer.set(player);
    this.start(player);
  }

  switchTurn() {
    if (this.gameOver()) return;

    const current = this._activeTimer();
    if (current !== null) {
      this.stop(current);
      this.addIncrementToPlayer(current);

      const next = current === 1 ? 2 : 1;
      this._activeTimer.set(next);
      this.start(next);
    }
  }

  clearTurn() {
    this._activeTimer.set(null);
  }

  isRunning(player: 1 | 2): boolean {
    return this.timers[player].running;
  }

  isFinished(player: 1 | 2): boolean {
    return this.timers[player].finished;
  }

  private start(player: 1 | 2) {
    const t = this.timers[player];
    if (this.gameOver() || t.running || t.finished || t.timeLeft <= 0) return;

    t.running = true;
    t.lastTimestamp = performance.now();
    this.updateAnyTimerRunning();
    this.tick(player);
  }

  private tick(player: 1 | 2) {
    const t = this.timers[player];
    if (!t.running || t.finished) return;

    const now = performance.now();
    const elapsed = now - t.lastTimestamp;
    t.lastTimestamp = now;

    const newTime = t.timeLeft - elapsed;
    if (newTime <= 0) {
      t.timeLeft = 0;
      t.finished = true;
      t.running = false;
      this.updateSignal(player, 0);
      this._activeTimer.set(null);

      this.stop(1);
      this.stop(2);
      this.gameOver.set(true);
      this.updateAnyTimerRunning();
      return;
    }

    t.timeLeft = newTime;
    this.updateSignal(player, newTime);
    t.rafId = requestAnimationFrame(() => this.tick(player));
  }

  private updateSignal(player: 1 | 2, value: number) {
    if (player === 1) {
      this._timeLeft1.set(value);
    } else {
      this._timeLeft2.set(value);
    }
  }

  private updateAnyTimerRunning() {
    const isAnyRunning = this.timers[1].running || this.timers[2].running;
    this.anyTimerRunning.set(isAnyRunning);
  }

  private addIncrementToPlayer(player: 1 | 2) {
    const t = this.timers[player];
    if (t.finished) return;

    t.timeLeft += this.incrementMs;
    this.updateSignal(player, t.timeLeft);
  }

  addIncrementToActivePlayer() {
    const player = this._activeTimer();
    if (player) this.addIncrementToPlayer(player);
  }

  resumeActiveTimer() {
    const player = this._activeTimer();
    if (player === null) return;

    const t = this.timers[player];
    if (t.running || t.finished || t.timeLeft <= 0) return;

    t.running = true;
    t.lastTimestamp = performance.now();
    this.updateAnyTimerRunning();

    this.tick(player);
  }

  async resetTimerFromStorage(player: 1 | 2) {
    const config = await this.dataService.get<typeof this.dataService.defaultConfig>('configuration');
    const durationStr = config?.chessTimerConfig.duration || '00:01:00';
    const incrementStr = config?.chessTimerConfig.increment || '00:00';

    const durationMs = this.parseDurationToMs(durationStr);
    this.incrementMs = this.parseDurationToMs(incrementStr);

    this.resetTimer(player, durationMs);
  }

  async resetAllTimersFromStorage() {
    await this.resetTimerFromStorage(1);
    await this.resetTimerFromStorage(2);
  }

  // ✅ Ahora es un método privado de la clase
  public parseDurationToMs(duration: string): number {
    const parts = duration.split(':').map(Number);
    let ms = 0;

    if (parts.length === 3) {
      ms = parts[0] * 3600000 + parts[1] * 60000 + parts[2] * 1000;
    } else if (parts.length === 2) {
      ms = parts[0] * 60000 + parts[1] * 1000;
    } else if (parts.length === 1) {
      ms = parts[0] * 1000;
    }

    return ms;
  }
}
