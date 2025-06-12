import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CounterComponent } from '../components/counter/counter.component';
import { RoundTimerComponent } from '../components/round-timer/round-timer.component';
import { TurnTimerComponent } from '../components/turn-timer/turn-timer.component';
import { TimeoutComponent } from '../components/timeout/timeout.component';
import { TimerServicesService } from '../services/timer-services.service';
import { MenuComponent } from '../components/menu/menu.component';
import { DataServicesService } from '../services/data-services.service';
import { ConfigurationData } from '../interfaces/configuration-data.interface';
import { CommonModule } from '@angular/common';
import { MatchCounterComponent } from "../components/match-counter/match-counter.component";
import { NextMatchComponent } from "../components/next-match/next-match.component";
import { Subscription } from 'rxjs';
import { TimersConfigurationComponent } from '../components/timers-configuration/timers-configuration.component';
import { LifeConfigurationComponent } from '../components/life-configuration/life-configuration.component';
import { GameModesComponent } from '../components/game-modes/game-modes.component';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CounterComponent, RoundTimerComponent, TurnTimerComponent, TimeoutComponent, MenuComponent, CommonModule,
    MatchCounterComponent, NextMatchComponent,TimersConfigurationComponent, LifeConfigurationComponent, GameModesComponent],
})
export class HomePage implements OnInit, OnDestroy {
@ViewChild('timer1') timer1!: TurnTimerComponent;
@ViewChild('timer2') timer2!: TurnTimerComponent;
@ViewChild('counter1') counter1!: CounterComponent;
@ViewChild('counter2') counter2!: CounterComponent;
@ViewChild('round1') round1!: RoundTimerComponent;
@ViewChild('round2') round2!: RoundTimerComponent;

private timerService = inject(TimerServicesService);
private dataServicesService = inject(DataServicesService);
private cd = inject(ChangeDetectorRef);
private subscriptions: Subscription[] = [];
public configuration!: ConfigurationData;
public isConfigurationLoaded: boolean = false;
public matchesCoutn:number = 1;
public turnsCounter: number = 0;
public fullTurnsCounter: number = 0;
public openCloseTimersConfig: boolean = false;
public openCloseLifeConfig: boolean = false;
public openCloseGameModeConfig: boolean = false;

activeTimer: 1 | 2 | null = null;

 ngOnInit() {
  this.loadConfiguration();
    this.timerService.startCountdown(() => {});
  }
    ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
  this.turnsCount();
}

onTimerClicked(timerNumber: number) {

  if (this.activeTimer === null) {
    this.timerService.startCountdown(() => {});
    if (timerNumber === 1) {
      this.timer1.start();
      this.activeTimer = 1;
    } else {
      this.timer2.start();
      this.activeTimer = 2;
    }
    return;
  }

  if (this.activeTimer !== timerNumber) {
    return;
  }

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

  this.turnsCount();
}

 async loadConfiguration(): Promise<void> {
  const config = await this.dataServicesService.get<ConfigurationData>('configuration');
  this.configuration = config ?? this.dataServicesService.defaultConfig;

  if (!config) {
    await this.dataServicesService.set('configuration', this.configuration);
  }
  this.cd.detectChanges();

  this.turnTimers()
}

 turnTimers() {
  this.subscriptions.forEach(sub => sub.unsubscribe());
  this.subscriptions = [];

  if(this.timer1?.clicked) {
    this.subscriptions.push(
      this.timer1.clicked.subscribe(() => this.onTimerClicked(1))
    );
  } else {
    console.warn('timer1 no está definido o no tiene clicked');
  }

  if(this.timer2?.clicked) {
    this.subscriptions.push(
      this.timer2.clicked.subscribe(() => this.onTimerClicked(2))
    );
  } else {
    console.warn('timer2 no está definido o no tiene clicked');
  }
}

  matchesCountIncrement() {
    if (this.matchesCoutn < 3){
    confirm('¿Desea pasar a la siguiente partida?')
      this.matchesCoutn++;
    }else{
      confirm('¿Desea reiniciar el contador de combates?') && this.resetGame();
    }
  }

  turnsCount(){
  this.turnsCounter++;
  if(!this.timerService.isRunning()) {
    this.timerService.resume();
  }
  const nuevosTurnos = Math.floor(this.turnsCounter / 2);
  if (nuevosTurnos > this.fullTurnsCounter) {
    this.fullTurnsCounter = nuevosTurnos;
  }
}

  resetGame() {
  this.prepareNextMatch();

  if(this.round1?.resetTimer) {
    this.round1.resetTimer();
  } else {
    console.warn('round1 no está listo');
  }

  if(this.round2?.resetTimer) {
    this.round2.resetTimer();
  } else {
    console.warn('round2 no está listo');
  }

  this.timerService.setInitialTime(this.timerService.totalSeconds());
  this.matchesCoutn = 1;
  this.activeTimer = null;
}

prepareNextMatch() {
  if(this.timer1?.stopAndReset) {
    this.timer1.stopAndReset();
  } else {
    console.warn('timer1 no está listo');
  }
  if(this.timer2?.stopAndReset) {
    this.timer2.stopAndReset();
  } else {
    console.warn('timer2 no está listo');
  }

  if(this.counter1?.resetHp) {
    this.counter1.resetHp(this.configuration.hpValue);
  }
  if(this.counter2?.resetHp) {
    this.counter2.resetHp(this.configuration.hpValue);
  }

  this.turnsCounter = 0;
  this.fullTurnsCounter = 0;
}

nextMatch(){
    this.matchesCountIncrement();
    this.prepareNextMatch();
}

async openCloseTimersWindow() {
  const wasOpen = this.openCloseTimersConfig;

  if (wasOpen) {
    this.openCloseTimersConfig = false;
    await this.resetLoadConfiguration(); // ya lo hacías al cerrar
  } else {
    await this.resetLoadConfiguration(); // asegurate de que la config esté lista antes de abrir
    this.openCloseTimersConfig = true;
  }
}

openCloseLifeWindow() {
  this.openCloseLifeConfig = !this.openCloseLifeConfig;
  this.resetLoadConfiguration();
}

async resetLoadConfiguration() {
  await this.loadConfiguration();
  this.resetGame();
}

openClosegameModeConfigWindow() {
  this.openCloseGameModeConfig = !this.openCloseGameModeConfig;
}

}
