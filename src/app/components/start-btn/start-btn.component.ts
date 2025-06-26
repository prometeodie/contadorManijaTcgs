import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'start-btn',
  templateUrl: './start-btn.component.html',
  styleUrls: ['./start-btn.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StartBtnComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
