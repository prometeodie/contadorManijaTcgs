import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigurationData } from 'src/app/interfaces/configuration-data.interface';
import { DataServicesService } from 'src/app/services/data-services.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'timers-configuration',
  templateUrl: './timers-configuration.component.html',
  styleUrls: ['./timers-configuration.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TimersConfigurationComponent implements OnInit {
  @Output() closeConfigWindow = new EventEmitter<void>();
  @Output() isConfigChange = new EventEmitter<void>();

  private dataService = inject(DataServicesService);
  private soundService = inject(SoundService);

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
    this.isConfigChange.emit();
  }

  async saveSoundConfigToLocalStorage() {
    const currentConfig = await this.dataService.get<typeof this.dataService.defaultConfig>('configuration') ?? this.dataService.defaultConfig;

    const updatedConfig = {
      ...currentConfig,
      soundEnabled: this.sound,
    };

    await this.dataService.set('configuration', updatedConfig);

    this.dataService.setConfigChanged(true);
    setTimeout(() => {
      this.dataService.setConfigChanged(false);
    }, 200);

    this.updateSoundState();
    this.isConfigChange.emit();
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
        this.isConfigChange.emit();
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
