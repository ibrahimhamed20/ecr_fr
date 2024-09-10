import { Component, ElementRef } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { LayoutService } from '@admin-layout/services';

@Component({
  selector: 'admin-sidebar',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  constructor(public _layout: LayoutService, public el: ElementRef) { }
}
