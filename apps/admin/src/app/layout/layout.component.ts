import { AdminConfigComponent, FooterComponent, NavbarComponent, SidebarComponent } from './components';
import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from './services';
import { ConfirmDialogComponent, PopupComponent } from '@shared-ui';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    AdminConfigComponent,
    FooterComponent,
    ConfirmDialogComponent,
    PopupComponent
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnDestroy {
  overlayMenuOpenSubscription: Subscription;
  menuOutsideClickListener: any;
  profileMenuOutsideClickListener: any;

  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;
  @ViewChild(NavbarComponent) navbar!: NavbarComponent;

  constructor(
    public _layout: LayoutService,
    public _renderer: Renderer2,
    public _router: Router) {
    this.overlayMenuOpenSubscription = this._layout.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this._renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.sidebar.el.nativeElement.isSameNode(event.target) || this.sidebar.el.nativeElement.contains(event.target)
            || this.navbar.menuButton.nativeElement.isSameNode(event.target) || this.navbar.menuButton.nativeElement.contains(event.target));

          isOutsideClicked && this.hideMenu();
        });
      }

      if (!this.profileMenuOutsideClickListener) {
        this.profileMenuOutsideClickListener = this._renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.navbar.menu.nativeElement.isSameNode(event.target) || this.navbar.menu.nativeElement.contains(event.target)
            || this.navbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.navbar.topbarMenuButton.nativeElement.contains(event.target));

          isOutsideClicked && this.hideProfileMenu();
        });
      }

      this._layout.state.staticMenuMobileActive && this.blockBodyScroll();
    });

    this._router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideMenu();
        this.hideProfileMenu();
      });
  }

  hideMenu() {
    this._layout.state.overlayMenuActive = false;
    this._layout.state.staticMenuMobileActive = false;
    this._layout.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  hideProfileMenu() {
    this._layout.state.profileSidebarVisible = false;
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener();
      this.profileMenuOutsideClickListener = null;
    }
  }

  blockBodyScroll(): void {
    if (document.body.classList) document.body.classList.add('blocked-scroll');
    else document.body.className += ' blocked-scroll';
  }

  unblockBodyScroll(): void {
    if (document.body.classList) document.body.classList.remove('blocked-scroll');
    else document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
      'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  get containerClass() {
    return {
      'layout-theme-light': this._layout.config().colorScheme === 'light',
      'layout-theme-dark': this._layout.config().colorScheme === 'dark',
      'layout-overlay': this._layout.config().menuMode === 'overlay',
      'layout-static': this._layout.config().menuMode === 'static',
      'layout-static-inactive': this._layout.state.staticMenuDesktopInactive && this._layout.config().menuMode === 'static',
      'layout-overlay-active': this._layout.state.overlayMenuActive,
      'layout-mobile-active': this._layout.state.staticMenuMobileActive,
      'p-input-filled': this._layout.config().inputStyle === 'filled',
      'p-ripple-disabled': !this._layout.config().ripple
    }
  }

  ngOnDestroy() {
    this.overlayMenuOpenSubscription && this.overlayMenuOpenSubscription.unsubscribe();
    this.menuOutsideClickListener && this.menuOutsideClickListener();
  }
}
