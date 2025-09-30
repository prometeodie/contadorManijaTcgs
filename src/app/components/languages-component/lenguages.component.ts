import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguagesService } from 'src/app/services/lenguages.service';

@Component({
  selector: 'languages',
  templateUrl: './lenguages.component.html',
  styleUrls: ['./lenguages.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule]
})
export class LanguagesComponent implements OnInit, OnDestroy {
  selectedLang = '';
  public languages: { code: string; name: string }[] = [];
  private languageService = inject(LanguagesService);
  private sub!: Subscription;

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.sub = this.languageService.currentLang$.subscribe(lang => {
      this.selectedLang = lang;
    });
  }

  async onLanguageChange() {
    await this.languageService.setLanguage(this.selectedLang);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
