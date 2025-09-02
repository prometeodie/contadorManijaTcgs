import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ConfirmDialogComponent {

  @Input() message: string = '¿Estás seguro?';
  @Input() confirmText: string = 'Ok';
  @Input() cancelText: string = 'Cancel';
  @Input() isPopupFlipped: boolean = false;

  @Output() confirmed = new EventEmitter<boolean>();

  confirm() {
    this.confirmed.emit(true);
  }

  cancel() {
    this.confirmed.emit(false);
  }

}
