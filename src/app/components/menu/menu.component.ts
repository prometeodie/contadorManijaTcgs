import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, computed, inject } from '@angular/core';
import { TimerServicesService } from 'src/app/services/timer-services.service';
import { ChessTimerService } from '../../services/chess-timer.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DataServicesService } from 'src/app/services/data-services.service';

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
    } else {
      this.timerService.resume();
      this.startAll();
    }
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
