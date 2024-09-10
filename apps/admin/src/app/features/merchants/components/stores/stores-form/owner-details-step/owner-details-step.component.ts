import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormHelper } from '@shared-utils';

@Component({
  selector: 'admin-owner-details-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, InputTextareaModule],
  templateUrl: './owner-details-step.component.html'
})
export class OwnerDetailsStepComponent {
  @Input() form!: FormGroup;
  @Input() formError!: FormHelper.ErrorManagement;
}


// checkUser() {
// this.form.get('owner.phoneNumber')?.valueChanges.pipe(
//   debounceTime(400),
//   filter((q) => q?.trim().length > 0),
//   switchMap(term => this._users.checkUser(term)),
//   retry(-1)
// ).subscribe(res => res.data && this._toastr.warning(`Phone Number ${res.data.phone} is already exists`));
// }