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
import { tokenIcons } from 'src/assets/icons/icons-tokens';

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

allIcons: string[] = tokenIcons;

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
