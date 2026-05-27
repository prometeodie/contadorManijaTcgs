import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TokenIcon } from '../tcg-icons-selector/tcg-icons-selector.component';

@Component({
  selector: 'token-icons-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './token-icons-display.component.html',
  styleUrls: ['./token-icons-display.component.scss']
})
export class TokenIconsDisplayComponent {

  @Input() icons: TokenIcon[] = [];

  // ✅ UN SOLO ESTADO GLOBAL (clave del fix)
  activeIcons = new Set<string>();

  leftIcons(): TokenIcon[] {
    const middle = Math.ceil(this.icons.length / 2);
    return this.icons.slice(0, middle);
  }

  rightIcons(): TokenIcon[] {
    const middle = Math.ceil(this.icons.length / 2);
    return this.icons.slice(middle);
  }

  // -------------------------
  // TOGGLE UNIFICADO
  // -------------------------
  toggleIcon(icon: TokenIcon): void {
    const key = icon.id;

    if (this.activeIcons.has(key)) {
      this.activeIcons.delete(key);
      return;
    }

    this.activeIcons.add(key);
  }

  // -------------------------
  // ACTIVE CHECK UNIFICADO
  // -------------------------
  isActive(icon: TokenIcon): boolean {
    return this.activeIcons.has(icon.id);
  }
}
