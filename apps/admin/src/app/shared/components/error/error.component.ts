import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'admin-error',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent {
  pageMode: 'error' | 'not_found' | 'access_denied' = 'not_found';
  constructor(_route: ActivatedRoute) {
    _route.data.subscribe((res: any) => this.pageMode = res.mode || this.pageMode);
  }
}
