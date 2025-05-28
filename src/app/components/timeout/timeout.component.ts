import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TimerServicesService } from 'src/app/services/timer-services.service';

@Component({
  selector: 'timeout',
  templateUrl: './timeout.component.html',
  styleUrls: ['./timeout.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TimeoutComponent  implements OnInit {

  private timerService = inject(TimerServicesService);
  totalSeconds = this.timerService.totalSeconds;

  ngOnInit() {}

}
