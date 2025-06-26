import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TimerCommand, TimerServicesService } from 'src/app/services/timer-services.service';

@Component({
  selector: 'turn-timer',
  templateUrl: './turn-timer.component.html',
  styleUrls: ['./turn-timer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class TurnTimerComponent implements OnInit, OnDestroy {
  @Input() initialTime = '02:00';
  @Output() finished = new EventEmitter<void>();
  @Output() clicked = new EventEmitter<void>();

  private intervalId: any;
  private wasRunningBeforePause = false;
  private commandSub!: Subscription;
  private controlService = inject(TimerServicesService);

  totalSeconds: number = 0;
  running: boolean = false;
  showBubble = this.controlService.showBubble;

  ngOnInit() {
    this.totalSeconds = this.parseTimeToSeconds(this.initialTime);
    this.commandSub = this.controlService.commands$.subscribe((cmd: TimerCommand) => this.handleCommand(cmd));
  }

  ngOnDestroy() {
    this.clearTimer();
    this.commandSub?.unsubscribe();
  }

  parseTimeToSeconds(timeStr: string): number {
    const [mm, ss] = timeStr.split(':').map(Number);
    return (mm || 0) * 60 + (ss || 0);
  }

  formattedTime(): string {
    const mm = Math.floor(this.totalSeconds / 60);
    const ss = this.totalSeconds % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }

  startGame() {
    this.controlService.showBubblePopUp(false); // Oculta la burbuja desde el servicio central
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds -= 1;
      } else {
        this.clearTimer();
        this.finished.emit();
        this.wasRunningBeforePause = false;
      }
    }, 1000);
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.running = false;
  }

  reset() {
    this.totalSeconds = this.parseTimeToSeconds(this.initialTime);
    this.wasRunningBeforePause = false;
  }

  stopAndReset() {
    this.pause();
    this.reset();
  }

  clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.running = false;
  }

  onUserClick() {
    this.startGame();
    this.clicked.emit();
  }

  private handleCommand(cmd: TimerCommand) {
    switch (cmd) {
      case 'start':
        if (this.wasRunningBeforePause) {
          this.start();
        }
        break;
      case 'pause':
        this.wasRunningBeforePause = this.running;
        this.pause();
        break;
      case 'reset':
        this.reset();
        break;
      case 'stop':
        this.wasRunningBeforePause = false;
        this.stopAndReset();
        break;
    }
  }
}
