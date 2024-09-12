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

  constructor(
    private primengConfig: PrimeNGConfig,
    private translate: TranslateService) {
    this.initLanguage();
  }


  initLanguage() {
    this.translate.addLangs(['en', 'ar']);

    const lang = localStorage.getItem('lang') || 'en';
    localStorage.setItem('lang', lang);

    this.translate.setDefaultLang(lang);
    this.translate.use(lang);

    this.changePageDirection();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true; //enables core ripple functionality
  }

  changePageDirection() {
    if (this.translate.currentLang == 'en') {
      document.documentElement.setAttribute('dir', 'ltr');
    } else {
      document.documentElement.setAttribute('dir', 'rtl');
    }
  }
}
