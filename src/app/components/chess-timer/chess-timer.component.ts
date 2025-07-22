import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Signal,
  Output,
  EventEmitter,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ConfigurationData } from 'src/app/interfaces/configuration-data.interface';
import { ChessTimerService } from 'src/app/services/chess-timer.service';
import { DataServicesService } from 'src/app/services/data-services.service';

@Component({
  selector: 'chess-timer',
  templateUrl: './chess-timer.component.html',
  styleUrls: ['./chess-timer.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ChessTimerComponent implements OnInit {
  @Input() playerNumber!: 1 | 2;
  @Output() validClick = new EventEmitter<void>(); // 🚀 NUEVO OUTPUT

  private dataService = inject(DataServicesService);
  public chessTimerService = inject(ChessTimerService);

  private configLoaded = signal(false);
  private durationMs = 0;

  public timeDisplay: Signal<string> = computed(() => {
    const ms = this.chessTimerService.timeLeft(this.playerNumber)();
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const mil = Math.floor((ms % 1000) / 10);
    return `${this.pad(min)}:${this.pad(sec)}:${this.pad(mil)}`;
  });

  public isActive = computed(() => this.chessTimerService.activeTimer() === this.playerNumber);
  public isNoActiveAndHasActive = computed(() => {
    const active = this.chessTimerService.activeTimer();
    return active !== null && active !== this.playerNumber;
  });
  public isNoActiveAndNoActiveTimer = computed(() => this.chessTimerService.activeTimer() === null);

  async ngOnInit(): Promise<void> {
    const config = await this.dataService.get<ConfigurationData>('configuration');
    const finalConfig = config ?? this.dataService.defaultConfig;

    const timeStr = finalConfig.chessTimerConfig.duration;
    this.durationMs = this.chessTimerService.parseDurationToMs(timeStr);

    this.chessTimerService.initTimer(this.playerNumber, this.durationMs);
    this.configLoaded.set(true);
  }

  public reset(): void {
    if (!this.configLoaded()) return;
    this.chessTimerService.resetTimer(this.playerNumber, this.durationMs);
  }

  public onClick(): void {
    if (!this.configLoaded()) return;

    if (this.chessTimerService.isFinished(this.playerNumber)) return;
    if (this.chessTimerService.isGameOver()) {
      return;
    }

    const current = this.chessTimerService.activeTimer();
    if (current === null) {
      this.chessTimerService.setActiveTimer(this.playerNumber);
      this.validClick.emit(); // 🟢 Emitir el click válido
    } else if (current === this.playerNumber) {
      this.chessTimerService.switchTurn();
      this.validClick.emit(); // 🟢 Emitir el click válido
    }
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
