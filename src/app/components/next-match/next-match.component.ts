import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AdsService } from '../../services/ads.service';

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

  private adsService = inject(AdsService);

  nextMatch(){
    this.adsService.increaseCounterAndCheck()
    this.nextMatchEvent.emit();
  }
}
