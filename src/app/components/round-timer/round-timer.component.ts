import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgClass } from '@angular/common';
import { TimerServicesService } from 'src/app/services/timer-services.service';

@Component({
  selector: 'round-timer',
  templateUrl: './round-timer.component.html',
  styleUrls: ['./round-timer.component.scss'],
  standalone: true,
  imports: [IonicModule, NgClass],
})
export class RoundTimerComponent implements OnInit {

  @Input() time = '00:01:00'; // Formato hh:mm:ss
  @Output() finished = new EventEmitter<void>();

  private timerService = inject(TimerServicesService);
  private intervalId: any;

  totalSeconds = this.timerService.totalSeconds; // ahora es una signal usable directamente

  ngOnInit() {
    const parsed = this.parseTimeToSeconds(this.time);
    this.timerService.timerTime(parsed);
    this.startCountdown();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      if (this.totalSeconds() > 0) {
        this.timerService.counter();
      } else {
        clearInterval(this.intervalId);
        this.finished.emit();
      }
    }, 1000);
  }

  parseTimeToSeconds(timeStr: string): number {
    const parts = timeStr.split(':').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      console.warn('Formato inválido. Se espera hh:mm:ss');
      return 0;
    }
    const [hh, mm, ss] = parts;
    return hh * 3600 + mm * 60 + ss;
  }

  formattedTime(): string {
    const total = this.totalSeconds();
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  }
}
