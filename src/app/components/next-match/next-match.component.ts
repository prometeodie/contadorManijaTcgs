import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'next-match',
  templateUrl: './next-match.component.html',
  styleUrls: ['./next-match.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class NextMatchComponent  {
  @Output() nextMatchEvent = new EventEmitter<void>();
  @Input()  BgImg!: boolean;

  nextMatch(){
    this.nextMatchEvent.emit();
  }
}
