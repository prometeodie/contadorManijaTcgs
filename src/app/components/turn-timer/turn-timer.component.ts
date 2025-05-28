import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'turn-timer',
  templateUrl: './turn-timer.component.html',
  styleUrls: ['./turn-timer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule ],
})
export class TurnTimerComponent  implements OnInit, OnDestroy {
  @Input() initialTime = '02:00';
@Output() finished = new EventEmitter<void>();
@Output() clicked = new EventEmitter<void>();

private intervalId: any;
totalSeconds = signal(0);
running = false;

ngOnInit() {
  this.totalSeconds.set(this.parseTimeToSeconds(this.initialTime));
}

ngOnDestroy() {
  this.clearTimer();
}

parseTimeToSeconds(timeStr: string): number {
  const [mm, ss] = timeStr.split(':').map(Number);
  return (mm || 0) * 60 + (ss || 0);
}

formattedTime(): string {
  const total = this.totalSeconds();
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
}

start() {
  if (this.running) return;
  this.running = true;
  this.intervalId = setInterval(() => {
    if (this.totalSeconds() > 0) {
      this.totalSeconds.update(s => s - 1);
    } else {
      this.clearTimer();
      this.finished.emit();
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
  this.totalSeconds.set(this.parseTimeToSeconds(this.initialTime));
}

stopAndReset() {
  this.pause();
  this.reset();
}

onUserClick() {
  this.clicked.emit();
}

clearTimer() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
  this.running = false;
}
}
