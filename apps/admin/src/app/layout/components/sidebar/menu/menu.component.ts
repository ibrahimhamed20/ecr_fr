import { MenuItemComponent } from './menu-item/menu-item.component';
import { MAIN_MENU_ITEMS } from '@admin-layout/configs';
import { LayoutService } from '@admin-layout/services';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'admin-menu',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './menu.component.html'
})
export class MenuComponent {
  model: MenuItem[] = MAIN_MENU_ITEMS;
  constructor(public _layout: LayoutService) { }
}
