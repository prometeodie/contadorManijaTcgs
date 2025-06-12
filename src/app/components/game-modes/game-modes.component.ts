import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'game-modes',
  templateUrl: './game-modes.component.html',
  styleUrls: ['./game-modes.component.scss'],
  standalone  : true,
  imports: [CommonModule, IonicModule]
})
export class GameModesComponent  implements OnInit {

  @Output() closeGameModeConfigWindow = new EventEmitter<void>();

  ngOnInit() {}

  @HostListener('document:click')
  closeMenu() {
    this.closeGameModeConfigWindow.emit();
  }

}
