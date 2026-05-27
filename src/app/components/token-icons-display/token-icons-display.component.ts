import {
  CommonModule
} from '@angular/common';

import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { TokenIcon } from '../tcg-icons-selector/tcg-icons-selector.component';

@Component({
  selector: 'token-icons-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './token-icons-display.component.html',
  styleUrls: ['./token-icons-display.component.scss']
})
export class TokenIconsDisplayComponent implements OnChanges {

  @Input() icons: TokenIcon[] = [];

  // 👇 trigger externo
  @Input() resetTrigger = 0;

  activeIcons = new Set<string>();

  ngOnChanges(changes: SimpleChanges): void {

    // 👇 cuando cambia el trigger → reset
    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) {
      this.resetIcons();
    }

  }

  leftIcons(): TokenIcon[] {
    const middle = Math.ceil(this.icons.length / 2);
    return this.icons.slice(0, middle);
  }

  rightIcons(): TokenIcon[] {
    const middle = Math.ceil(this.icons.length / 2);
    return this.icons.slice(middle);
  }

  toggleIcon(icon: TokenIcon): void {

    const key = icon.id;

    if (this.activeIcons.has(key)) {
      this.activeIcons.delete(key);
      return;
    }

    this.activeIcons.add(key);

  }

  isActive(icon: TokenIcon): boolean {
    return this.activeIcons.has(icon.id);
  }

  resetIcons(): void {
    this.activeIcons.clear();
  }

}
