import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { RippleModule } from 'primeng/ripple'

@Component({
  standalone: true,
  imports: [RouterOutlet, RippleModule, NgxSpinnerModule],
  selector: 'admin-root',
  template: `<router-outlet /><ngx-spinner />`
})
export class AppComponent {
  title = 'Store Admin';
  currentLaguage;


  constructor(private primengConfig: PrimeNGConfig, private translate: TranslateService) {
    this.currentLaguage = localStorage.getItem('lang');
    if (this.currentLaguage == 'null' || this.currentLaguage == null) {
      this.translate.setDefaultLang('ar');
      localStorage.setItem('lang', 'ar');
      this.currentLaguage = localStorage.getItem('lang');
      this.getLanguage();
    } else {
      this.translate.setDefaultLang('ar');
      localStorage.setItem('lang', this.currentLaguage);
      this.getLanguage();
    }
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;       //enables core ripple functionality
  }

  getLanguage() {
    if (this.currentLaguage == 'en') {
      document.documentElement.setAttribute('dir', 'ltr');
    } else {
      document.documentElement.setAttribute('dir', 'rtl');
    }
  }
}
