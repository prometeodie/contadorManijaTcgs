import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output, inject, computed } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TimerServicesService } from 'src/app/services/timer-services.service';
import { ChessTimerService } from '../../services/chess-timer.service';

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

  public menuOpen: boolean = false


  private timerService = inject(TimerServicesService);
  private chessTimerService = inject(ChessTimerService);
  public isTimerRunning = computed(() => this.timerService.isRunning());
  public ischessTimerRunning = computed(() => this.chessTimerService.isAnyTimerRunning());

  ngOnInit() {}

  resetMatch() {
    this.resetTimers.emit();
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  playPause() {
    if (this.timerService.isRunning()) {
      this.timerService.pause();
      this.pauseAll();
    } else {
      this.timerService.resume();
      this.startAll();
    }
    if(this.chessTimerService.isAnyTimerRunning()) {
      this.chessTimerService.stop(1);
      this.chessTimerService.stop(2);
    }else{
      this.chessTimerService.resumeActiveTimer()
    }
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen = false;
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

  pauseAll() {
    this.timerService.sendCommand('pause');
  }

  startAll() {
    this.timerService.sendCommand('start');
  }
}
