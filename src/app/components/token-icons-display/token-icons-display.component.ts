import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'token-icons-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './token-icons-display.component.html',
  styleUrls: ['./token-icons-display.component.scss']
})
export class TokenIconsDisplayComponent {

  @Input() icons: string[] = [];

}
