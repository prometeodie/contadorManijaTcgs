import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class CounterComponent  implements OnInit {
  @Input() hp: number = 0;
  @Input() min: number = 0;
  @Input() turnsCounter: number = 0;
  @Input() isTurnsTimerActive!: boolean;
  @Input() max: number = Infinity;
  @Input() backgroundColor!: string;
  @Input() isChessTimerActive!: boolean;
  @Output() valueChange = new EventEmitter<number>();

  private animationTimeout: any;
  public counter: number = 0;
  public showAnimation: boolean = false;
  public showVisible: boolean = false;
  public action: string = '';

  ngOnInit() {}

  incrementDecrement(value: number) {
      if (this.hp + value >= -999 && this.hp + value <= 999) {
      this.hp += value;
      this.valueChange.emit(this.hp);
      this.triggerAnimationDelay();
      this.counterNumber(value);
      this.action = this.counter > 0 ? 'increment' : 'decrement';
    }
    return;
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

onAnimationEnd(){
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
