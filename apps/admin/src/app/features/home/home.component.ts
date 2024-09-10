import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-home',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class HomeComponent { }