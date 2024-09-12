import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { LayoutService } from '@admin-layout/services';
import { AuthService } from '@shared-auth/lib/services/auth.service'
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TooltipModule, TranslateModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public _translate: TranslateService,
    public _layout: LayoutService,
    public _auth: AuthService) { }

  toggleLanguage() {
    if (this._translate.currentLang === 'en') {
      this._translate.use('ar');
      localStorage.setItem('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      this._translate.use('en');
      localStorage.setItem('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }
}
