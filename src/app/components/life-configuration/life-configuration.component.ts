import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { DataServicesService } from 'src/app/services/data-services.service';

@Component({
  selector: 'life-configuration',
  templateUrl: './life-configuration.component.html',
  styleUrls: ['./life-configuration.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LifeConfigurationComponent implements OnInit {
  @Output() closeLifeConfigWindow = new EventEmitter<void>();
  @Output() closeGameModeConfigWindow = new EventEmitter<void>();
  @Output() lifeChange = new EventEmitter<void>();

  private dataService = inject(DataServicesService);

  ngOnInit() {}

  async changeLifeConfiguration(newHpValue: number) {
    const config = await this.dataService.get<any>('configuration');

    if (!config) {
      console.error('No se encontró configuración');
      return;
    }

    if (config.hpValue === newHpValue) {
      return;
    }

    config.hpValue = newHpValue;

    await this.dataService.set('configuration', config);
    this.lifeChange.emit();
    this.closeGameModeConfigWindow.emit();
    this.dataService.setConfigChanged(true);
  }

  @HostListener('document:click')
  closeMenu() {
    this.closeLifeConfigWindow.emit();
  }
}
