import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@admin-layout/services';

@Component({
  selector: 'admin-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  constructor(public _layout: LayoutService) { }
}
