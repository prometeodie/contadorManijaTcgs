import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigurationData } from 'src/app/interfaces/configuration-data.interface';
import { DataServicesService } from 'src/app/services/data-services.service';
import { SoundService } from 'src/app/services/sound.service';
import { LanguagesComponent } from '../languages-component/lenguages.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagesService } from 'src/app/services/lenguages.service';
import { AdsService } from 'src/app/services/ads.service';

@Component({
  selector: 'timers-configuration',
  templateUrl: './timers-configuration.component.html',
  styleUrls: ['./timers-configuration.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LanguagesComponent, TranslateModule],
})
export class TimersConfigurationComponent implements OnInit, OnDestroy{
  @Output() closeConfigWindow = new EventEmitter<void>();
  @Output() isConfigChange = new EventEmitter<void>();
  @Output() resetConfigChange = new EventEmitter<void>();

  private dataService = inject(DataServicesService);
  private soundService = inject(SoundService);
  private languagesService = inject(LanguagesService);
  private adsService = inject(AdsService);

  public timerConfig!: ConfigurationData;

  hourOptions = Array.from({ length: 24 }, (_, i) => i);
  minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  secondOptions = Array.from({ length: 60 }, (_, i) => i);

  roundTimerEnabled = false;
  turnTimerEnabled = false;
  threeMatches = false;
  sound = false;

  roundHours = 0;
  roundMinutes = 0;
  roundSeconds = 0;

  turnMinutes = 0;
  turnSeconds = 0;

  ngOnInit() {
    this.getData();
    this.ionViewWillEnter();
  }

  ngOnDestroy() {
    this.adsService.hideBanner(); // seguridad extra
  }
   async ionViewWillEnter() {
    // 👇 Mostrar banner solo cuando se entra a esta página
    await this.adsService.showBanner('ca-app-pub-3940256099942544/6300978111'); // ID de prueba
  }

  async ionViewWillLeave() {
    // 👇 Ocultar el banner al salir de la página
    await this.adsService.hideBanner();
  }


  async getData() {
    const config = await this.dataService.get<ConfigurationData>('configuration');
    this.timerConfig = config ?? this.dataService.defaultConfig;
    this.loadConfiguration(this.timerConfig);
  }

  closeWindow() {
    this.closeConfigWindow.emit();
  }

  loadConfiguration(data: ConfigurationData) {
    this.roundTimerEnabled = data.roundTimerEnabled;
    this.turnTimerEnabled = data.turnTimerEnabled;
    this.threeMatches = data.threeMatches;
    this.sound = data.soundEnabled;

    const [rh, rm, rs] = data.roundTimerDuration.split(':').map(Number);
    this.roundHours = rh || 0;
    this.roundMinutes = rm || 0;
    this.roundSeconds = rs || 0;

    const [tm, ts] = data.turnTimerDuration.split(':').map(Number);
    this.turnMinutes = tm || 0;
    this.turnSeconds = ts || 0;

    this.updateSoundState();
  }

  async saveConfigToLocalStorage() {
    const updatedConfig: ConfigurationData = {
      ...this.timerConfig,
      roundTimerEnabled: this.roundTimerEnabled,
      turnTimerEnabled: this.turnTimerEnabled,
      threeMatches: this.threeMatches,
      soundEnabled: this.sound,
      roundTimerDuration: `${this.pad(this.roundHours)}:${this.pad(this.roundMinutes)}:${this.pad(this.roundSeconds)}`,
      turnTimerDuration: `${this.pad(this.turnMinutes)}:${this.pad(this.turnSeconds)}`,
    };

    this.timerConfig = updatedConfig;
    await this.dataService.set('configuration', updatedConfig);
    this.loadConfiguration(updatedConfig)
    this.isConfigChange.emit();
  }

  saveSoundConfigToLocalStorage() {
  this.timerConfig.soundEnabled = this.sound;

  this.dataService.set('configuration', this.timerConfig).then(() => {
    this.updateSoundState();
  });
}

private updateSoundState() {
  if (this.sound) {
    this.soundService.enableSound();
  } else {
    this.soundService.disableSound();
  }
}

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  focusSafeElement() {
    const safe = document.getElementById('safe-focus-element');
    safe?.focus();
  }

  resetConfiguration() {
    if (confirm('¿Estás seguro que deseas reiniciar la configuración por defecto?')) {
      this.dataService.set('configuration', this.dataService.defaultConfig).then(() => {
        this.getData();
        this.languagesService.setLanguage('en');
        this.resetConfigChange.emit();
      });
    }
  }

  onToggleRoundTimer(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked && this.timerConfig.chessTimerConfig.chessTimerEnabled) {
      const confirmDisable = confirm(
        'Los temporizadores no se pueden activar si el temporizador de ajedrez está habilitado. ¿Deseas desactivar el temporizador de ajedrez?'
      );

      if (confirmDisable) {
        this.timerConfig.chessTimerConfig.chessTimerEnabled = false;
        this.roundTimerEnabled = true;
      } else {
        (event.target as HTMLInputElement).checked = false;
        return;
      }
    } else {
      this.roundTimerEnabled = checked;
    }

    this.saveConfigToLocalStorage();
  }

  onToggleTurnTimer(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked && this.timerConfig.chessTimerConfig.chessTimerEnabled) {
      const confirmDisable = confirm(
        'Los temporizadores no se pueden activar si el temporizador de ajedrez está habilitado. ¿Deseas desactivar el temporizador de ajedrez?'
      );

      if (confirmDisable) {
        this.timerConfig.chessTimerConfig.chessTimerEnabled = false;
        this.turnTimerEnabled = true;
      } else {
        (event.target as HTMLInputElement).checked = false;
        return;
      }
    } else {
      this.turnTimerEnabled = checked;
    }

    this.saveConfigToLocalStorage();
  }
}
