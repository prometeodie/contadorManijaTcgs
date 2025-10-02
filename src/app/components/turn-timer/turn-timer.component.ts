import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  Signal,
  computed,
  inject,
  effect,
  OnInit,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TurnTimerService } from 'src/app/services/turn-timer.service';
import { DataServicesService } from 'src/app/services/data-services.service';
import { TimerServicesService } from 'src/app/services/timer-services.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'turn-timer',
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
  templateUrl: './turn-timer.component.html',
  styleUrls: ['./turn-timer.component.scss'],
})
export class TurnTimerComponent implements OnInit {
  @Input() playerNumber!: 1 | 2;
  @Input() BgImg!: boolean;
  @Output() validClick = new EventEmitter<void>();

  private dataService = inject(DataServicesService);
  private timerService = inject(TurnTimerService);
  private timerServicesService = inject(TimerServicesService);

  private durationMs = 0;

  private holdThreshold = 1200;
  private holdStartTime = 0;
  private holdTimer: any;

  public isPaused: boolean = false;
  public isPressing = false;
  public progress = 0;
  public progressInterval: any;
  public isHolding: boolean = false;
  public progressDelayTimer: any;
  public showPopUp!: Signal<boolean>;
  readonly circumference = 2 * Math.PI * 16;

  get progressOffset() {
    return this.circumference - (this.progress / 100) * this.circumference;
  }

  public isActive = computed(
    () => this.timerService.activePlayer() === this.playerNumber
  );

  public timeLeft = computed(() =>
    this.playerNumber === 1
      ? this.timerService.timeLeft1()
      : this.timerService.timeLeft2()
  );

  public timeDisplay: Signal<string> = computed(() => {
    const ms = this.timeLeft();
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${this.pad(min)}:${this.pad(sec)}`;
  });

  constructor() {
    effect(() => {
      if (this.timerService.turnTimerWasModified()) {
        this.loadTimerConfig(true).catch(console.error);
        this.timerService.markTurnTimerAsModified(false);
      }
    });

    effect(() => {
      if (this.dataService.configChangedSignal()) {
        this.loadTimerConfig(true).catch(console.error);
      }
    });
  }

  async ngOnInit() {
    await this.loadTimerConfig(false);
    this.showPopUp = this.timerService.showPopUp;
  }

  async loadTimerConfig(forceReset: boolean = false) {
    const config = await this.dataService.get<any>('configuration');
    const durationStr =
      config?.turnTimerDuration ??
      this.dataService.defaultConfig.turnTimerDuration;
    const newDuration = this.timerService.parseDurationToMs(durationStr);

    if (forceReset || newDuration !== this.durationMs) {
      this.durationMs = newDuration;
      this.timerService.initTimers(this.durationMs);
    }
  }

  public async resetTimer() {
    await this.loadTimerConfig(true);
  }

  onClick() {
    const current = this.timerService.activePlayer();

    if (!this.timerServicesService.isRunning()) {
      this.timerServicesService.startCountdown();
    }

    if (current === this.playerNumber && this.timerService.isPaused(this.playerNumber)) {
      this.timerService.resumeTurnTimer(this.playerNumber);
      this.isPaused = this.timerService.isPaused(this.playerNumber);
      return;
    }

    if (current === null) {
      this.timerService.startTurn(this.playerNumber);
      this.validClick.emit();
    } else if (current === this.playerNumber) {
      this.timerService.switchTurn(this.playerNumber);
    }
  }

  startPress() {
    const current = this.timerService.activePlayer();
    if (current !== null && !this.isActive()) return;

    if(this.activePlayer === null){
      this.isPaused = false;
      this.timerService.setShowPopUp(true);
      setTimeout(() => {
        this.timerService.setShowPopUp(false);
      }, 7000);
    }

    clearTimeout(this.holdTimer);
    clearTimeout(this.progressDelayTimer);
    clearInterval(this.progressInterval);

    this.holdStartTime = Date.now();
    this.progress = 0;
    this.isPressing = false;
    this.isHolding = true;

    const delayBeforeProgress = 250;
    const totalHold = this.holdThreshold;

    this.progressDelayTimer = setTimeout(() => {
      if (!this.isHolding) return;

      this.isPressing = true;
      const progressStartTime = Date.now();

      this.progressInterval = setInterval(() => {
        const elapsed = Date.now() - progressStartTime;
        this.progress = Math.min(
          (elapsed / (totalHold - delayBeforeProgress)) * 100,
          100
        );
      }, 20);
    }, delayBeforeProgress);

        this.holdTimer = setTimeout(() => {
      if (this.isActive()) {
        this.pauseTimer();
      }
      this.timerService.setShowPopUp(false);
      // ⚡ No llamamos endPress(false) acá, solo marcamos que ya fue hold
      this.isHolding = false;
    }, totalHold);
  }

  endPress(triggerClick: boolean = true) {
  clearTimeout(this.holdTimer);
  clearTimeout(this.progressDelayTimer);
  clearInterval(this.progressInterval);

  this.isPressing = false;
  this.progress = 0;

  if (triggerClick) {
    const elapsed = Date.now() - this.holdStartTime;
    if (elapsed < this.holdThreshold) {
      this.onClick();   // click normal
    }
    // ⚡ si fue >= holdThreshold ya pausó en startPress, no hace falta llamar click
  }
}

  pauseTimer() {
    if (!this.isActive()) return;

    this.timerService.pauseTurnTimer(this.playerNumber);
    this.isPaused = this.timerService.isPaused(this.playerNumber);
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  get activePlayer() {
    return this.timerService.activePlayer();
  }
}
