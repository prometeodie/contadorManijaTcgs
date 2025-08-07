import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataServicesService } from 'src/app/services/data-services.service';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CounterComponent implements OnInit {
  @Input() hp: number = 0;
  @Input() min: number = 0;
  @Input() turnsCounter: number = 0;
  @Input() isTurnsTimerActive!: boolean;
  @Input() max: number = Infinity;
  @Input() background!: string;
  @Input() isChessTimerActive!: boolean;
  @Input() isSoundEnable!: boolean;
  @Input() BgImg!: boolean;
  @Output() valueChange = new EventEmitter<number>();

  private dataService = inject(DataServicesService);

  public counter: number = 0;
  public showAnimation: boolean = false;
  public showVisible: boolean = false;
  public action: string = '';
  public isActiveMinus = false;
  public isActivePlus = false;
  private animationTimeout: any;
  private clickSound = new Audio('assets/sounds/tap.ogg');

  private dataServicesService = inject(DataServicesService)

  constructor() {}

  ngOnInit() {
    this.clickSound.load();
  }

  get isLifeAnimationActive() {
  return this.dataService.lifeAnimation();
  }

  incrementDecrement(value: number) {
    if (this.hp + value >= -999 && this.hp + value <= 999) {
      this.hp += value;
      this.valueChange.emit(this.hp);
      this.triggerAnimationDelay();
      this.counterNumber(value);
      this.action = this.counter > 0 ? 'increment' : 'decrement';
      this.playClickSound();

      // Activar clase 'active' según botón presionado
      if (value === -1) {
        this.isActiveMinus = true;
        setTimeout(() => (this.isActiveMinus = false), 150);
      } else if (value === 1) {
        this.isActivePlus = true;
        setTimeout(() => (this.isActivePlus = false), 150);
      }
    }
  }

  private playClickSound() {
    if (!this.isSoundEnable) return;
    try {
      this.clickSound.currentTime = 0;
      this.clickSound.play();
    } catch (e) {
      console.warn('No se pudo reproducir el sonido:', e);
    }
  }

  triggerAnimationDelay() {
    this.showAnimation = false;
    this.showVisible = true;

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    this.animationTimeout = setTimeout(() => {
      this.showVisible = false;
      this.showAnimation = true;

      setTimeout(() => {
        this.showAnimation = false;
      }, 2000);
    }, 2000);
  }

  onAnimationEnd() {
    this.counter = 0;
    this.action = '';
  }

  onchangeLifeAnimationEnd() {
     this.dataServicesService.setConfiglifeAnimation(false);
  }

  counterNumber(value: number) {
    this.counter += value;
  }

  resetHp(newHp: number) {
    this.hp = newHp;
  }

  getBackgroundStyle(): { [key: string]: string } {
  if (!this.background) return {};

  const isImage = (
    this.background.startsWith('http') ||
    this.background.startsWith('assets/') ||
    this.background.startsWith('data:image') || // <--- agregá esta línea
    /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(this.background)
  );

  if (isImage) {
    return { 'background-image': `url(${this.background})` };
  } else {
    return { 'background-color': this.background };
  }
}
}
