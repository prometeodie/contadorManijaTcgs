import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'match-counter',
  templateUrl: './match-counter.component.html',
  styleUrls: ['./match-counter.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MatchCounterComponent  implements OnInit {
  @Input()  matchesCount: number = 0;

  constructor() { }

  ngOnInit() {}

}
