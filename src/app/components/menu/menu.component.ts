import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MenuComponent  implements OnInit {
  @Output() resetTimers = new EventEmitter<void>();

  public menuOpen: boolean = false;
  public playPauseTimers: boolean = false;

  ngOnInit() {}

  resetMatch() {
    this.resetTimers.emit();
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  playPause() {
    this.playPauseTimers = !this.playPauseTimers;
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen = false;
  }

}
