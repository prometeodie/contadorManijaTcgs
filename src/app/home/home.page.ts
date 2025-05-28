import { Component, ViewChild } from '@angular/core';
import { CounterComponent } from '../components/counter/counter.component';
import { RoundTimerComponent } from '../components/round-timer/round-timer.component';
import { TurnTimerComponent } from '../components/turn-timer/turn-timer.component';
import { TimeoutComponent } from '../components/timeout/timeout.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CounterComponent,RoundTimerComponent,TurnTimerComponent, TimeoutComponent],
})
export class HomePage {
@ViewChild('timer1') timer1!: TurnTimerComponent;
@ViewChild('timer2') timer2!: TurnTimerComponent;

activeTimer: 1 | 2 | null = null; // Nadie activo al inicio

ngAfterViewInit() {
  this.timer1.finished.subscribe(() => this.onTimerFinished(1));
  this.timer2.finished.subscribe(() => this.onTimerFinished(2));
  this.timer1.clicked.subscribe(() => this.onTimerClicked(1));
  this.timer2.clicked.subscribe(() => this.onTimerClicked(2));
}

onTimerFinished(timerNumber: number) {
  if (timerNumber === 1) {
    this.timer2.stopAndReset();
    this.timer2.start();
    this.activeTimer = 2;
  } else {
    this.timer1.stopAndReset();
    this.timer1.start();
    this.activeTimer = 1;
  }
}

onTimerClicked(timerNumber: number) {
  if (this.activeTimer === null) {
    // Primera vez: comienza el juego con el que apretó
    if (timerNumber === 1) {
      this.timer1.start();
      this.activeTimer = 1;
    } else {
      this.timer2.start();
      this.activeTimer = 2;
    }
    return;
  }

  // Cambio de turno (solo si el que clickea es el activo)
  if (this.activeTimer !== timerNumber) return;

  if (timerNumber === 1) {
    this.timer1.stopAndReset();
    this.timer2.stopAndReset();
    this.timer2.start();
    this.activeTimer = 2;
  } else {
    this.timer2.stopAndReset();
    this.timer1.stopAndReset();
    this.timer1.start();
    this.activeTimer = 1;
  }
}
}
