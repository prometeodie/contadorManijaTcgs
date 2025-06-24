import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ConfigurationData } from 'src/app/interfaces/configuration-data.interface';
import { DataServicesService } from 'src/app/services/data-services.service';

@Component({
  selector: 'game-modes',
  templateUrl: './game-modes.component.html',
  styleUrls: ['./game-modes.component.scss'],
  standalone  : true,
  imports: [CommonModule, IonicModule]
})
export class GameModesComponent  implements OnInit {

  @Output() closeGameModeConfigWindow = new EventEmitter<void>();
  @Output() openCloseChessMode = new EventEmitter<void>();
  private dataService = inject(DataServicesService);

  ngOnInit() {}

  @HostListener('document:click')
  closeMenu() {
    this.closeGameModeConfigWindow.emit();
  }

async showTimers(show: boolean) {
  let text = '';
  text = show
    ? '¿Estás seguro de que querés activar los timers? '
    : '¿Estás seguro de que querés desactivar los timers?';

  if (confirm(text)) {
    // Obtener la configuración actual
    const config = await this.dataService.get<ConfigurationData>('configuration');

    if (config) {
      // Modificar los timers generales
      config.roundTimerEnabled = show;
      config.turnTimerEnabled = show;

      // Si show es true, poner chessTimerEnabled en false dentro de chessTimerConfig
      if (config.chessTimerConfig) {
        config.chessTimerConfig.chessTimerEnabled = false;
      }

      // Guardar la configuración modificada
      await this.dataService.set('configuration', config);
    } else {
      // Si no hay configuración previa, usar la default sin timers
      const newConfig = {
        ...this.dataService.defaultConfig,
        roundTimerEnabled: show,
        turnTimerEnabled: show,
        chessTimerConfig: {
          duration: "00:10:00",
          increment: "00:05",
          chessTimerEnabled: show ? false : true, // si show true entonces false
        }
      };
      await this.dataService.set('configuration', newConfig);
    }

    // Cerrar la ventana de configuración
    this.closeGameModeConfigWindow.emit();
  }
}


  chessMode(){
    this.openCloseChessMode.emit();
  }
}
