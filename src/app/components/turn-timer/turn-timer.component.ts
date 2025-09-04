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
  private holdInterval: any; // 🔹 para manejar el mantener presionado

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

    // Reacciona a cambios de configuración general
    effect(() => {
      if (this.dataService.configChangedSignal()) {
        this.loadTimerConfig(true).catch(console.error);
      }
    });
  }

  async ngOnInit() {
    await this.loadTimerConfig(false); // primera carga
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

  // 🔹 Acción normal de click/turno
  onClick() {
    const current = this.timerService.activePlayer();

    if (!this.timerServicesService.isRunning()) {
      this.timerServicesService.startCountdown();
    }

    if (current === null) {
      this.timerService.startTurn(this.playerNumber);
      this.validClick.emit();
    } else if (current === this.playerNumber) {
      this.timerService.switchTurn(this.playerNumber);
    }
  }

  // 🔹 Empieza a ejecutar onClick de forma repetida
  startPress() {
    this.onClick(); // se ejecuta al toque
    this.holdInterval = setInterval(() => {
      this.onClick();
    }, 300); // cada 300ms (puedes ajustar)
  }

  // 🔹 Detiene la ejecución repetida
  endPress() {
    clearInterval(this.holdInterval);
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  get activePlayer() {
    return this.timerService.activePlayer();
  }
}
