import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  inject,
  OnInit,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ConfigurationData } from 'src/app/interfaces/configuration-data.interface';
import { DataServicesService } from 'src/app/services/data-services.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'game-modes',
  templateUrl: './game-modes.component.html',
  styleUrls: ['./game-modes.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class GameModesComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() closeGameModeConfigWindow = new EventEmitter<void>();
  @Output() openCloseChessMode = new EventEmitter<void>();
  @Output() timersChanged = new EventEmitter<void>();

  private dataService = inject(DataServicesService);
  private renderer = inject(Renderer2);
  private elRef = inject(ElementRef);
  private translateService = inject(TranslateService);
  private removeClickListener!: () => void;
  private removeTouchListener!: () => void;

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.removeClickListener = this.renderer.listen('document', 'mousedown', this.onOutsideClick.bind(this));
    this.removeTouchListener = this.renderer.listen('document', 'touchstart', this.onOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    this.removeClickListener?.();
    this.removeTouchListener?.();
  }

  private onOutsideClick(event: Event): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeGameModeConfigWindow.emit();
    }
  }

  async showTimers(show: boolean) {
    const text = show
      ? this.translateService.instant('ENABLE_TIMERS')
      : this.translateService.instant('DISABLE_TIMERS');

    if (confirm(text)) {
      const config = await this.dataService.get<ConfigurationData>('configuration');
      if (config) {
        config.roundTimerEnabled = show;
        config.turnTimerEnabled = show;
        if (config.chessTimerConfig) {
          config.chessTimerConfig.chessTimerEnabled = false;
        }
        await this.dataService.set('configuration', config);
      } else {
        const newConfig = {
          ...this.dataService.defaultConfig,
          roundTimerEnabled: show,
          turnTimerEnabled: show,
          chessTimerConfig: {
            duration: '00:10:00',
            increment: '00:05',
            chessTimerEnabled: false,
          },
        };
        await this.dataService.set('configuration', newConfig);
      }

      this.timersChanged.emit();
    }
    this.closeGameModeConfigWindow.emit();
  }

  chessMode() {
    this.openCloseChessMode.emit();
  }
}
