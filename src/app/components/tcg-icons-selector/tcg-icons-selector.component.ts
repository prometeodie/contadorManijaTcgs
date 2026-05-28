import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,

} from '@angular/core';

import { TokenIconsService } from 'src/app/services/token-icons-service.service';

export type TokenIcon = {
  id: string;
  icon: string;
};

@Component({
  selector: 'icons-selector',
  templateUrl: './tcg-icons-selector.component.html',
  styleUrls: ['./tcg-icons-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class TcgIconsSelectorComponent implements OnInit {

  private tokenIconsService = inject(TokenIconsService);

  @Input({ required: true }) player!: 1 | 2;

  @Input() maxIcons = 8;

  @Output() closeSelector = new EventEmitter<1 | 2>();

  @Output() iconsChanged = new EventEmitter<void>();

allIcons: string[] = [
  'fa-bolt',
  'fa-fire',
  'fa-droplet',
  'fa-leaf',
  'fa-skull',
  'fa-shield',
  'fa-heart',
  'fa-dragon',
  'fa-gem',
  'fa-star',
  'fa-sun',
  'fa-moon',
  'fa-book',
  'fa-paw',
  'fa-feather',
  'fa-wand-sparkles',
  'fa-burst',
  'fa-crown',
  'fa-ghost',
  'fa-dice',
  'fa-biohazard',
  'fa-fish',
  'fa-frog',
  'fa-hurricane',
  'fa-meteor',
  'fa-spider',
  'fa-bug',
  'fa-cloud-bolt',
  'fa-snowflake',
  'fa-volcano',

  // --- expansión TCG ---
  'fa-crosshairs',
  'fa-hand-fist',
  'fa-hand-sparkles',
  'fa-bomb',
  'fa-shuffle',
  'fa-eye',
  'fa-eye-slash',
  'fa-lock',
  'fa-unlock',
  'fa-arrows-rotate',
  'fa-circle-notch',
  'fa-battery-full',
  'fa-battery-half',
  'fa-battery-quarter',
  'fa-trophy',
  'fa-medal',
  'fa-hourglass-half',
  'fa-flag',
  'fa-skull-crossbones',
  'fa-handshake',
  'fa-sword',
  'fa-shield-halved',
  'fa-fire-flame-curved',
  'fa-water',
  'fa-wind',
  'fa-mountain',
  'fa-tree',
  'fa-seedling',
  'fa-recycle',
  'fa-plug',
  'fa-magnet',
  'fa-cubes',
  'fa-cube',
  'fa-box',
  'fa-box-open',
  'fa-scroll',
  'fa-scroll-torah',
  'fa-ring',
  'fa-rocket',
  'fa-jet-fighter',
  'fa-robot',
  'fa-brain',
  'fa-heart-pulse',
  'fa-lungs',
  'fa-virus',
  'fa-virus-slash',
  'fa-poop',
  'fa-fire-flame-simple',
  'fa-water-ladder',
  'fa-icicles',
  'fa-sun-plant-wilt',
  'fa-moon-over-sun',
  'fa-cloud',
  'fa-cloud-rain',
  'fa-cloud-sun',
  'fa-cloud-moon',
  'fa-temperature-high',
  'fa-temperature-low',
  'fa-volcano',
  'fa-landmark',
  'fa-chess',
  'fa-chess-king',
  'fa-chess-queen',
  'fa-chess-rook',
  'fa-chess-bishop',
  'fa-chess-knight',
  'fa-chess-pawn',
  'fa-gavel',
  'fa-scale-balanced',
  'fa-hand',
  'fa-hand-peace',
  'fa-hand-pointer',
  'fa-hand-back-fist',
  'fa-ankh',
  'fa-yin-yang',
  'fa-dna',
  'fa-pills',
  'fa-syringe',
  'fa-mask',
  'fa-theater-masks',
  'fa-gift',
  'fa-bell',
  'fa-bell-slash',
  'fa-bullseye',
  'fa-compass',
  'fa-map',
  'fa-map-pin',
  'fa-location-dot'
];

  selectedIcons: TokenIcon[] = [];

  async ngOnInit(): Promise<void> {

    const savedIcons =
      await this.tokenIconsService.getPlayerIcons(this.player);

    this.selectedIcons = (savedIcons ?? []).map((item: any) => {

      // compat viejo string[]
      if (typeof item === 'string') {
        return {
          id: crypto.randomUUID(),
          icon: item
        };
      }

      return item;
    });

    await this.tokenIconsService.savePlayerIcons(
      this.player,
      this.selectedIcons
    );
  }

  async addIcon(icon: string): Promise<void> {

    if (this.selectedIcons.length >= this.maxIcons) {
      return;
    }

    this.selectedIcons = [
      ...this.selectedIcons,
      {
        id: crypto.randomUUID(),
        icon
      }
    ];

    await this.tokenIconsService.savePlayerIcons(
      this.player,
      this.selectedIcons
    );

    this.iconsChanged.emit();
  }

  async removeIcon(index: number): Promise<void> {

    this.selectedIcons = this.selectedIcons.filter(
      (_, i) => i !== index
    );

    await this.tokenIconsService.savePlayerIcons(
      this.player,
      this.selectedIcons
    );

    this.iconsChanged.emit();
  }

  close(): void {
    this.closeSelector.emit(this.player);
  }
}
