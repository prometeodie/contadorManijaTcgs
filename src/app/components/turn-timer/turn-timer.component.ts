import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  Signal,
  signal,
  computed,
  inject,
  effect,
  OnInit,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TurnTimerService } from 'src/app/services/turn-timer.service';
import { DataServicesService } from 'src/app/services/data-services.service';
import { TimerServicesService } from 'src/app/services/timer-services.service';

@Component({
  selector: 'turn-timer',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './turn-timer.component.html',
  styleUrls: ['./turn-timer.component.scss'],
})
export class TurnTimerComponent implements OnInit {
  @Input() playerNumber!: 1 | 2;
  @Output() clicked = new EventEmitter<void>();
  @Output() validClick = new EventEmitter<void>();

  private dataService = inject(DataServicesService);
  private timerService = inject(TurnTimerService);
  private timerServicesService = inject(TimerServicesService);

  private durationMs = 0;

  public isActive = computed(() => this.timerService.activePlayer() === this.playerNumber);

  public timeLeft = computed(() =>
    this.playerNumber === 1 ? this.timerService.timeLeft1() : this.timerService.timeLeft2()
  );

  public timeDisplay: Signal<string> = computed(() => {
    const ms = this.timeLeft();
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${this.pad(min)}:${this.pad(sec)}`;
  });

  constructor() {
    effect(() => {
      if (this.dataService.configChangedSignal()) {
        this.loadTimerConfig();
      }
    });
  }

  async ngOnInit() {
    await this.loadTimerConfig();
  }

  async loadTimerConfig() {
    const config = await this.dataService.get<any>('configuration');
    const durationStr = config?.turnTimerDuration ?? this.dataService.defaultConfig.turnTimerDuration;
    this.durationMs = this.timerService.parseDurationToMs(durationStr);
    this.timerService.initTimers(this.durationMs);
  }

  public resetTimer() {
  this.timerService.initTimers(this.durationMs);
}

  onClick() {
    const current = this.timerService.activePlayer();

    if (current === null) {
      this.timerService.startTurn(this.playerNumber);
      this.validClick.emit();
    } else if (current === this.playerNumber) {
      this.timerService.switchTurn(this.playerNumber);
      this.validClick.emit();
    }
    this.timerServicesService.startCountdown();

    this.clicked.emit();
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
  get activePlayer() {
    return this.timerService.activePlayer();
  }
}


