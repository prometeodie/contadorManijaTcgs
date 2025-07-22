import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataServicesService } from 'src/app/services/data-services.service';

@Component({
  selector: 'chess-timer-mode',
  templateUrl: './chess-timer-mode.component.html',
  styleUrls: ['./chess-timer-mode.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class ChessTimerModeComponent  implements OnInit {
  @Output() closeChessModeWindow = new EventEmitter<void>();
  @Output() chessConfigChanged = new EventEmitter<void>();

  private dataService = inject(DataServicesService);

  constructor() { }

  ngOnInit() {}

   closeWindow() {
    this.closeChessModeWindow.emit();
  }

  async changeChessTimerConfig(duration: string, increment: string, chessTimerEnabled: boolean) {
  await this.dataService.updateChessTimerConfig({ duration, increment, chessTimerEnabled });
  this.chessConfigChanged.emit();
}
}
