import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject
} from '@angular/core';
import { TokenIconsService } from 'src/app/services/token-icons-service.service';


@Component({
  selector: 'icons-selector',
  templateUrl: './tcg-icons-selector.component.html',
  styleUrls: ['./tcg-icons-selector.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TcgIconsSelectorComponent implements OnInit {

  private tokenIconsService = inject(TokenIconsService);

  @Input({ required: true }) player!: 1 | 2;

  @Input() maxIcons = 6;

  @Output() closeSelector = new EventEmitter<1 | 2>();

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
  ];

  selectedIcons: string[] = [];

  async ngOnInit(): Promise<void> {

    this.selectedIcons =
      await this.tokenIconsService.getPlayerIcons(this.player);

  }

  async addIcon(icon: string): Promise<void> {

    if(this.selectedIcons.length >= this.maxIcons) {
      return;
    }

    this.selectedIcons = [
      ...this.selectedIcons,
      icon
    ];

    await this.tokenIconsService.savePlayerIcons(
      this.player,
      this.selectedIcons
    );

  }

  async removeIcon(index: number): Promise<void> {

    this.selectedIcons.splice(index, 1);

    this.selectedIcons = [
      ...this.selectedIcons
    ];

    await this.tokenIconsService.savePlayerIcons(
      this.player,
      this.selectedIcons
    );

  }

  close(): void {
    this.closeSelector.emit(this.player);
  }

}
