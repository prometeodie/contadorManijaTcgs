import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConfigurationData } from 'src/app/interfaces/configuration-data.interface';
import { DataServicesService } from 'src/app/services/data-services.service';

@Component({
  selector: 'timers-configuration',
  templateUrl: './timers-configuration.component.html',
  styleUrls: ['./timers-configuration.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class TimersConfigurationComponent implements OnInit {
  @Output() closeConfigWindow = new EventEmitter<void>();
  @Output() isConfigChange = new EventEmitter<void>();
  private dataService = inject(DataServicesService);
  public timerConfig!: ConfigurationData;

  hourOptions = Array.from({ length: 24 }, (_, i) => i); // 0-23
  minuteOptions = Array.from({ length: 60 }, (_, i) => i); // 0-59
  secondOptions = Array.from({ length: 60 }, (_, i) => i); // 0-59

  roundTimerEnabled = false;
  turnTimerEnabled = false;
  threeMatches = false;

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

    const [rh, rm, rs] = data.roundTimerDuration.split(':').map(Number);
    this.roundHours = rh || 0;
    this.roundMinutes = rm || 0;
    this.roundSeconds = rs || 0;

    const [tm, ts] = data.turnTimerDuration.split(':').map(Number);
    this.turnMinutes = tm || 0;
    this.turnSeconds = ts || 0;
  }

  async saveConfigToLocalStorage() {
    const updatedConfig: ConfigurationData = {
      ...this.timerConfig,
      roundTimerEnabled: this.roundTimerEnabled,
      turnTimerEnabled: this.turnTimerEnabled,
      threeMatches: this.threeMatches,
      roundTimerDuration: `${this.pad(this.roundHours)}:${this.pad(this.roundMinutes)}:${this.pad(this.roundSeconds)}`,
      turnTimerDuration: `${this.pad(this.turnMinutes)}:${this.pad(this.turnSeconds)}`,
    };

    this.timerConfig = updatedConfig;
    await this.dataService.set('configuration', updatedConfig);
    this.isConfigChange.emit();
  }

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  focusSafeElement() {
    const safe = document.getElementById('safe-focus-element');
    safe?.focus();
  }

  resetConfiguration(){
    if(confirm('Estassegudro que deseas reinicar la configuración por defecto?') ){
      this.dataService.set('configuration', this.dataService.defaultConfig).then(() => {
        this.getData();
        this.isConfigChange.emit();
      });
    }
  }
}
