import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LayoutService, MenuService } from '../../../../services';
import { CommonModule } from '@angular/common';

@Component({
    selector: '[adminMenuItem]',
    template: `
		<ng-container>
            <!-- <div *ngIf="root && item.visible !== false" class="layout-menuitem-root-text">{{item.label}}</div> -->
			<a *ngIf="(!item.routerLink || item.items) && item.visible !== false" [attr.href]="item.url" (click)="itemClick($event)"
			   [ngClass]="item.class" [attr.target]="item.target" tabindex="0" pRipple>
				<i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
				<span class="layout-menuitem-text">{{item.label}}</span>
				<i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
			</a>
			<a *ngIf="(item.routerLink && !item.items) && item.visible !== false" (click)="itemClick($event)" [ngClass]="item.class" 
			   [routerLink]="item.routerLink" routerLinkActive="active-route" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{ paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
               [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" 
               [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state" [queryParams]="item.queryParams"
               [attr.target]="item.target" tabindex="0" pRipple>
				<i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
				<span class="layout-menuitem-text">{{item.label}}</span>
				<i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
			</a>

			<ul *ngIf="item.items && item.visible !== false" [@children]="submenuAnimation">
				<ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
					<li adminMenuItem [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass"></li>
				</ng-template>
			</ul>
		</ng-container>
    `,
    animations: [
        trigger('children', [
            state('collapsed', style({
                height: '0'
            })),
            state('expanded', style({
                height: '*'
            })),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class MenuItemComponent implements OnInit, OnDestroy {

    @Input() item: any;
    @Input() index!: number;
    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;
    @Input() parentKey!: string;

    active: boolean = false;
    menuSourceSubscription: Subscription;
    menuResetSubscription: Subscription;
    key: string = "";

    constructor(
        public _layout: LayoutService,
        public _router: Router,
        private _menu: MenuService) {
        this.menuSourceSubscription = this._menu.menuSource$.subscribe(value => {
            Promise.resolve(null).then(() => {
                if (value.routeEvent) this.active = (value.key === this.key || value.key.startsWith(this.key + '-')) ? true : false;
                else {
                    if (value.key !== this.key && !value.key.startsWith(this.key + '-')) this.active = false;
                }
            });
        });

        this.menuResetSubscription = this._menu.resetSource$.subscribe(() => this.active = false);

        this._router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(params => this.item.routerLink && this.updateActiveStateFromRoute());
    }

    ngOnInit() {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);
        this.item.routerLink && this.updateActiveStateFromRoute();
    }

    updateActiveStateFromRoute() {
        let activeRoute = this._router.isActive(this.item.routerLink[0], { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });
        activeRoute && this._menu.onMenuStateChange({ key: this.key, routeEvent: true });
    }

    itemClick(event: Event) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // execute command
        if (this.item.command) this.item.command({ originalEvent: event, item: this.item });

        // toggle active state
        if (this.item.items) this.active = !this.active;

        this._menu.onMenuStateChange({ key: this.key });
    }

    get submenuAnimation() {
        return this.root ? 'expanded' : (this.active ? 'expanded' : 'collapsed');
    }

    @HostBinding('class.active-menuitem')
    get activeClass() {
        return this.active && !this.root;
    }

    ngOnDestroy() {
        this.menuSourceSubscription && this.menuSourceSubscription.unsubscribe();
        this.menuResetSubscription && this.menuResetSubscription.unsubscribe();
    }
}