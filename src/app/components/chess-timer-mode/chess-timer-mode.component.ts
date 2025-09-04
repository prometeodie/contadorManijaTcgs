import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AdsService } from 'src/app/services/ads.service';
import { DataServicesService } from 'src/app/services/data-services.service';

@Component({
  selector: 'chess-timer-mode',
  templateUrl: './chess-timer-mode.component.html',
  styleUrls: ['./chess-timer-mode.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
})
export class ChessTimerModeComponent  implements OnInit {
  @Output() closeChessModeWindow = new EventEmitter<void>();
  @Output() chessConfigChanged = new EventEmitter<void>();

  private dataService = inject(DataServicesService);
  private adsService = inject(AdsService);

  constructor() { }

   ngOnInit() {
    this.ionViewWillEnter();
  }

  ngOnDestroy() {
    this.adsService.hideBanner();
  }
   async ionViewWillEnter() {
    await this.adsService.showBanner('ca-app-pub-3940256099942544/6300978111');
  }

  async ionViewWillLeave() {
    await this.adsService.hideBanner();
  }

   closeWindow() {
    this.closeChessModeWindow.emit();
  }

  async changeChessTimerConfig(duration: string, increment: string, chessTimerEnabled: boolean) {
  await this.dataService.updateChessTimerConfig({ duration, increment, chessTimerEnabled });
  this.chessConfigChanged.emit();
  this.closeWindow();
}
}
