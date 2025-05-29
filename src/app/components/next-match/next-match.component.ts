import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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

  nextMatch(){
    this.nextMatchEvent.emit();
  }
}
