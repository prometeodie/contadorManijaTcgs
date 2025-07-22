import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, computed, inject } from '@angular/core';
import { TimerServicesService } from 'src/app/services/timer-services.service';
import { ChessTimerService } from '../../services/chess-timer.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DataServicesService } from 'src/app/services/data-services.service';
import { TurnTimerService } from 'src/app/services/turn-timer.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MenuComponent implements OnInit {
  @Output() resetTimers = new EventEmitter<void>();
  @Output() openTimersWindow = new EventEmitter<void>();
  @Output() openLifeWindow = new EventEmitter<void>();
  @Output() openCloseGameModeConfigWindow = new EventEmitter<void>();
  @Output() positionHasChanged = new EventEmitter<void>();
  @Input() positionRight!: boolean;

  public menuOpen: boolean = false;

  private timerService = inject(TimerServicesService);
  private chessTimerService = inject(ChessTimerService);
  private cd = inject(ChangeDetectorRef);
  private turnTimerService = inject(TurnTimerService);

  public isTimerRunning = computed(() => this.timerService.isRunning());
  public ischessTimerRunning = computed(() => this.chessTimerService.isAnyTimerRunning());
  public isAnyTimerRunning = computed(() => this.chessTimerService.isAnyTimerRunning());

  private ignoreNextClick: boolean = false;

  ngOnInit() {}

  resetMatch() {
    this.resetTimers.emit();
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      this.ignoreNextClick = true;
      // Ignorar clicks solo 300ms después de abrir menú
      setTimeout(() => {
        this.ignoreNextClick = false;
      }, 300);
    }
  }

 playPause() {
  if (this.timerService.isRunning()) {
    this.timerService.pause();
    this.pauseAll();

    // Pausar o reanudar turn timer del jugador activo según estado actual
    const current = this.turnTimerService.activePlayer();
    if (current) {
      if (this.turnTimerService.isRunning(current)) {
        this.turnTimerService.pauseTurnTimer(current);
      } else {
        this.turnTimerService.resumeTurnTimer(current);
      }
    }
  } else {
    this.timerService.resume();
    this.startAll();

    // Reanudar turn timer del jugador activo
    const current = this.turnTimerService.activePlayer();
    if (current) {
      this.turnTimerService.resumeTurnTimer(current);
    }
  }

  // Control de los timers de ajedrez también
  if (this.chessTimerService.isAnyTimerRunning()) {
    this.chessTimerService.stop(1);
    this.chessTimerService.stop(2);
  } else {
    this.chessTimerService.resumeActiveTimer();
  }
}



  @HostListener('document:click')
  closeMenu() {
    if (this.ignoreNextClick) {
      return; // Ignoramos clicks breves tras abrir menú
    }
    if (this.menuOpen) {
      this.menuOpen = false;
      this.cd.detectChanges(); // Forzamos actualizar la vista
    }
  }

  openTimersConfiguration() {
    this.openTimersWindow.emit();
  }

  openlifeConfiguration() {
    this.openLifeWindow.emit();
  }

  openGameConfigMode() {
    this.openCloseGameModeConfigWindow.emit();
  }

  positionChanged() {
    this.positionHasChanged.emit();
  }

  pauseAll() {
    this.timerService.sendCommand('pause');
  }

  startAll() {
    this.timerService.sendCommand('start');
  }
}
