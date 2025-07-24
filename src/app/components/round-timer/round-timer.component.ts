import { Component, Input, OnInit, SimpleChanges, OnChanges, inject } from '@angular/core';
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
export class RoundTimerComponent implements OnInit, OnChanges {
  @Input() time: string | undefined;

  private timerService = inject(TimerServicesService);
  public totalSeconds = this.timerService.totalSeconds;

  ngOnInit() {
    if (this.time) {
      const total = this.parseTimeToSeconds(this.time);
      this.timerService.setInitialTime(total);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['time'] && !changes['time'].firstChange) {
      const newTime = changes['time'].currentValue;
      const total = this.parseTimeToSeconds(newTime);
      this.timerService.stopCountdown();
      this.timerService.setInitialTime(total);
    }
  }

  formattedTime() {
    return this.timerService.formattedTime();
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

  resetTimer() {
    if (this.time) {
      const total = this.parseTimeToSeconds(this.time);
      this.timerService.stopCountdown();
      this.timerService.setInitialTime(total);
    }
  }
}
