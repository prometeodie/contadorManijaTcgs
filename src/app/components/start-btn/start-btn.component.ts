import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'start-btn',
  templateUrl: './start-btn.component.html',
  styleUrls: ['./start-btn.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class StartBtnComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
