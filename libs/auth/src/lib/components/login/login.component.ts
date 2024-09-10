import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '@shared-auth/lib/services/auth.service';

const PRIMENG_MODULES = [
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  PasswordModule,
  ToastModule
];

@Component({
  selector: 'admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ...PRIMENG_MODULES],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styles: [`
    :host ::ng-deep .pi-eye,
    :host ::ng-deep .pi-eye-slash {
        transform:scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
    }
`]
})
export class LoginComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  loginForm!: FormGroup;

  constructor(
    private _message: MessageService,
    private _auth: AuthService,
    private _router: Router,
    private _fb: FormBuilder) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    })
  }

  login() {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.getRawValue();
    this._auth.login({ username, password })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (!res.hasPermissions) {
          this._message.add({ severity: 'warn', summary: 'Access Denied', detail: 'You don\'t have permissions to access.' });
        } else {
          this._router.navigate(["/home"]);
        }
      })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
