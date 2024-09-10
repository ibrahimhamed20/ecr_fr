import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-subscription',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class SubscriptionsComponent {}
