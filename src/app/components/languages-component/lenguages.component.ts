import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguagesService } from 'src/app/services/lenguages.service';

@Component({
  selector: 'languages',
  templateUrl: './lenguages.component.html',
  styleUrls: ['./lenguages.component.scss'],
  imports: [CommonModule, FormsModule, TranslateModule]
})
export class LanguagesComponent implements OnInit {
  selectedLang = '';
 public languages: { code: string; name: string }[] = [];

  private languageService = inject(LanguagesService)

  async ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selectedLang = this.languageService.getCurrentLang();
  }

  async onLanguageChange() {
    await this.languageService.setLanguage(this.selectedLang);
  }
}
