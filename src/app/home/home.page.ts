import { IonicModule } from '@ionic/angular';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChildren, QueryList, ViewChild, NgZone } from '@angular/core';
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
import { ChessTimerModeComponent } from '../components/chess-timer-mode/chess-timer-mode.component';
import { ChessTimerComponent } from '../components/chess-timer/chess-timer.component';
import { ChessTimerService } from '../services/chess-timer.service';
import { StartBtnComponent } from '../components/start-btn/start-btn.component';
import { PlayerColorChangerComponent } from '../components/player-color-changer/player-color-changer.component';
import { SoundService } from '../services/sound.service';
import { TurnTimerService } from '../services/turn-timer.service';
import { BackgroundImagesService } from '../services/background-images.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CounterComponent, RoundTimerComponent, TurnTimerComponent, TimeoutComponent, MenuComponent, CommonModule,
    MatchCounterComponent, NextMatchComponent,TimersConfigurationComponent, LifeConfigurationComponent, GameModesComponent,
    ChessTimerModeComponent, ChessTimerComponent, StartBtnComponent, PlayerColorChangerComponent],
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChildren(TurnTimerComponent) turnTimersList!: QueryList<TurnTimerComponent>;
  @ViewChild('counter1') counter1!: CounterComponent;
  @ViewChild('counter2') counter2!: CounterComponent;
  @ViewChild('round1') round1!: RoundTimerComponent;
  @ViewChild('round2') round2!: RoundTimerComponent;

  private timerService = inject(TimerServicesService);
  private dataServicesService = inject(DataServicesService);
  private chessTimerService = inject(ChessTimerService);
  private cd = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private soundService = inject(SoundService);
  private turnTimerService = inject(TurnTimerService);
  private backgroundImagesService = inject(BackgroundImagesService);

  private subscriptions: Subscription[] = [];

  public configuration!: ConfigurationData;
  public isConfigurationLoaded: boolean = false;
  public isTurnTimerEnable: boolean = false;
  public matchesCoutn:number = 1;
  public turnsCounter: number = 1;
  public fullTurnsCounter: number = 1;
  public isSoundEnable!: boolean;
  public openCloseTimersConfig: boolean = false;
  public openCloseLifeConfig: boolean = false;
  public openCloseGameModeConfig: boolean = false;
  public openCloseChessMode: boolean = false;
  public roundTimerIsRunning: boolean = false;
  public backgroundP1!:string;
  public backgroundP2!:string;
  public bgImgP1!:boolean;
  public bgImgP2!:boolean;

  activeTimer: 1 | 2 | null = null;

 ngOnInit() {
  this.loadConfiguration();

  this.soundService.soundEnabled$.subscribe(enabled => {
    this.isSoundEnable = enabled;
    this.cd.detectChanges();
  });

  this.turnTimerService.setAutoSwitchCallback(() => {
    this.turnsCount();
  });
}


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  stratRoundTimer(){
    this.timerService.startCountdown(() => {});
    this.roundTimerIsRunning = this.timerService.isRunning();
  }

async loadConfiguration(): Promise<void> {
  const config = await this.dataServicesService.get<ConfigurationData>('configuration');
  this.configuration = config ?? this.dataServicesService.defaultConfig;
  this.isTurnTimerEnable = this.configuration.turnTimerEnabled;
  this.isSoundEnable = this.configuration.soundEnabled;

  if (!config) {
    await this.dataServicesService.set('configuration', this.configuration);
  }

  const imgP1 = localStorage.getItem('imgplayer1_imgbg') === 'true';
  const imgP2 = localStorage.getItem('imgplayer2_imgbg') === 'true';

  this.bgImgP1 = imgP1;
  this.bgImgP2 = imgP2;

  if (imgP1) {
    const savedImg1 = await this.backgroundImagesService.getImage('imgplayer1');
    this.backgroundP1 = savedImg1 ?? this.configuration.player1Color;
  } else {
    this.backgroundP1 = this.configuration.player1Color;
  }

  if (imgP2) {
    const savedImg2 = await this.backgroundImagesService.getImage('imgplayer2');
    this.backgroundP2 = savedImg2 ?? this.configuration.player2Color;
  } else {
    this.backgroundP2 = this.configuration.player2Color;
  }

  this.cd.detectChanges();
  this.turnTimers();
}

  turnTimers() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

  }

  matchesCountIncrement() {
    if (this.matchesCoutn < 3){
      if (confirm('¿Desea pasar a la siguiente partida?')){
         this.matchesCoutn++;
         return true;
      } else{
        return false;
      }
    } else{
      if (confirm('¿Desea reiniciar el contador de combates?')){
        this.resetGame();
        return true;
      } else{
        return false;
      }
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

  async resetGame() {
    this.prepareNextMatch();

    this.resetTimers();
    this.turnTimerService.markTurnTimerAsModified(true);
    this.timerService.setInitialTime(this.timerService.totalSeconds());
    this.timerService.setIsRunningFalse();
    this.roundTimerIsRunning = this.timerService.isRunning();
    this.isTurnTimerEnable = this.configuration.turnTimerEnabled;
    this.matchesCoutn = 1;
    this.activeTimer = null;
    this.timerService.showBubblePopUp(true);
    await this.chessTimerService.resetAllTimersFromStorage();
    this.dataServicesService.setConfiglifeAnimation(true);
  }

  resetTimers() {
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
  }

  resetImgs(player:string){
      localStorage.setItem(player, 'false');
  }

  prepareNextMatch() {
    this.timer1?.resetTimer();
    this.timer2?.resetTimer();
    if(this.counter1?.resetHp) {
      this.counter1.resetHp(this.configuration.hpValue);
    }
    if(this.counter2?.resetHp) {
      this.counter2.resetHp(this.configuration.hpValue);
    }

    this.turnsCounter = 1;
    this.fullTurnsCounter = 1;
    this.activeTimer = null;
  }

  async changePlayerColor(event: { player: 1 | 2; color: string }) {
    const config = await this.dataServicesService.get<ConfigurationData>('configuration');
    if (!config) return;

    if (event.player === 1) {
      config.player1Color = event.color;
      this.backgroundP1 = event.color;
    } else {
      config.player2Color = event.color;
      this.backgroundP2 = event.color;
    }

    this.configuration = { ...config };
    (event.player === 1)? this.bgImgP1 = false : this.bgImgP2 = false;
     this.cd.detectChanges();
    await this.dataServicesService.set('configuration', this.configuration);
  }

 imgPlayerChange(event: { player: 'imgplayer1' | 'imgplayer2'; img: string }) {
  this.zone.run(() => {
    (event.player === 'imgplayer1')? this.backgroundP1 = event.img: this.backgroundP2 = event.img;
    (event.player === 'imgplayer1')? this.bgImgP1 = true : this.bgImgP2 = true;
    this.cd.detectChanges();
  });
}

  nextMatch(){
    if(this.matchesCountIncrement()){
      this.prepareNextMatch();
      this.chessTimerService.resetAllTimersFromStorage();
    }
  }

  async openCloseTimersWindow() {
    this.openCloseTimersConfig = !this.openCloseTimersConfig;
  }

  async isTimerConfigChange(){
    await this.resetLoadConfiguration();
  }


  openCloseLifeWindow() {
    this.openCloseLifeConfig = !this.openCloseLifeConfig;
    this.openCloseGameModeConfig = false;
    this.cd.detectChanges();
  }

  async resetLoadConfiguration() {
  const newConfig = await this.dataServicesService.get<ConfigurationData>('configuration');
  this.configuration = { ...(newConfig ?? this.dataServicesService.defaultConfig) };
  this.counter1?.resetHp(this.configuration.hpValue);
  this.counter2?.resetHp(this.configuration.hpValue);
  this.resetImgs('imgplayer1_imgbg');
  this.resetImgs('imgplayer2_imgbg');

  this.isTurnTimerEnable = this.configuration.turnTimerEnabled;
  this.isSoundEnable = this.configuration.soundEnabled;
  await this.resetGame();
  this.cd.detectChanges();

  this.dataServicesService.setConfiglifeAnimation(true);
}

  openClosegameModeConfigWindow() {
    this.openCloseGameModeConfig = !this.openCloseGameModeConfig;
    this.openCloseLifeConfig = false;
    this.cd.detectChanges();
  }

  changePosition() {
    this.configuration.positionRight = !this.configuration.positionRight;
    this.dataServicesService.set('configuration', this.configuration);
    this.cd.detectChanges();
  }

  openCloseChessModeWindow() {
    this.openCloseChessMode = !this.openCloseChessMode;
    this.openCloseGameModeConfig = false;
  }

  get timer1(): TurnTimerComponent | undefined {
    return this.turnTimersList?.get(0);
  }

  get timer2(): TurnTimerComponent | undefined {
    return this.turnTimersList?.get(1);
  }
}
