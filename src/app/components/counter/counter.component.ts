import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class CounterComponent implements OnInit {
  @Input() hp: number = 0;
  @Input() min: number = 0;
  @Input() turnsCounter: number = 0;
  @Input() isTurnsTimerActive!: boolean;
  @Input() max: number = Infinity;
  @Input() backgroundColor!: string;
  @Input() isChessTimerActive!: boolean;
  @Input() isSoundEnable!: boolean;
  @Output() valueChange = new EventEmitter<number>();

  public counter: number = 0;
  public showAnimation: boolean = false;
  public showVisible: boolean = false;
  public action: string = '';
  private animationTimeout: any;

  private clickSound = new Audio('assets/sounds/tap.ogg');

  ngOnInit() {
    this.clickSound.load(); // Precargar
  }

  incrementDecrement(value: number) {
    if (this.hp + value >= -999 && this.hp + value <= 999) {
      this.hp += value;
      this.valueChange.emit(this.hp);
      this.triggerAnimationDelay();
      this.counterNumber(value);
      this.action = this.counter > 0 ? 'increment' : 'decrement';
      this.playClickSound();
    }
  }

  private playClickSound() {
    if(!this.isSoundEnable) return;
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

  counterNumber(value: number) {
    this.counter += value;
  }

  resetHp(newHp: number) {
    this.hp = newHp;
  }
}
