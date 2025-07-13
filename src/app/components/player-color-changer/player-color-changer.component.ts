import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DataServicesService } from 'src/app/services/data-services.service'; // Ajustá el path según tu proyecto

@Component({
  selector: 'player-color-changer',
  templateUrl: './player-color-changer.component.html',
  styleUrls: ['./player-color-changer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PlayerColorChangerComponent implements OnInit {
  @Input() playerNumber: 1 | 2 = 1;
  @Input() position!: boolean;
  @Output() colorChanged = new EventEmitter<{ player: 1 | 2; color: string }>();

  public isColorSelectionOpen: boolean = false;
  public colors = ['#ff004a','#4250fe','#f8605d','#ffae72', '#66d19e', '#4a7dcc', '#a27ac4' , '#ff5ca3', '#57c1eb', '#9b72d4'];
  public currentColor: string = '';
  private cd = inject(ChangeDetectorRef);

  constructor(private dataService: DataServicesService, private elRef: ElementRef) {}

  async ngOnInit() {
    const config = await this.dataService.get<typeof this.dataService.defaultConfig>('configuration');
    if (config) {
      this.currentColor = this.playerNumber === 1 ? config.player1Color : config.player2Color;
    }
  }

  openColorSelection() {
    this.isColorSelectionOpen = !this.isColorSelectionOpen;
  }

  async selectColor(color: string): Promise<void> {
    const config = await this.dataService.get<typeof this.dataService.defaultConfig>('configuration');
    if (!config) return;

    const updatedConfig = {
      ...config,
      ...(this.playerNumber === 1
        ? { player1Color: color }
        : { player2Color: color }),
    };

    await this.dataService.set('configuration', updatedConfig);
    this.currentColor = color;
    this.colorChanged.emit({ player: this.playerNumber, color });
  }

  getCircleItemStyle(index: number, total: number): { [key: string]: string } {
    const angleDeg = (360 / total) * index;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const radius = 80 - 16;

    const x = 80 + radius * Math.cos(angleRad);
    const y = 80 + radius * Math.sin(angleRad);

    return {
      position: 'absolute',
      top: `${y}px`,
      left: `${x}px`,
      transform: 'translate(-50%, -50%)',
    };
  }

  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const clickedInside = this.elRef.nativeElement.contains(event.target);
  if (!clickedInside) {
    this.isColorSelectionOpen = false;
    this.cd.detectChanges();
  }
}
}
