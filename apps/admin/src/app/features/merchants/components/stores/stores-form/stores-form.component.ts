import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BranchStepComponent, BREADCRUMB_ITEMS, OwnerDetailsStepComponent, StoreInfoStepComponent, STORES_FORM_IMPORTS } from './stores-form.config';
import { catchError, map, Observable, of } from 'rxjs';
import { UsersService } from '@admin-shared/services';
import { FormHelper } from '@shared-utils';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'admin-stores-form',
  templateUrl: './stores-form.component.html',
  imports: STORES_FORM_IMPORTS,
  standalone: true
})
export class StoresFormComponent implements OnInit {
  // stepper config
  steps: { id: number, label: string, template: TemplateRef<any> }[] = [];
  @ViewChild('ownerDetails', { static: true }) private ownerDetailsComp!: TemplateRef<OwnerDetailsStepComponent>;
  @ViewChild('storeInfo', { static: true }) private storeInfComp!: TemplateRef<StoreInfoStepComponent>;
  @ViewChild('branch', { static: true }) private branchComp!: TemplateRef<BranchStepComponent>;

  // breadcrumb config
  breadcrumb: MenuItem[] = BREADCRUMB_ITEMS;

  // store work
  storeForm!: FormGroup;
  formError!: FormHelper.ErrorManagement;

  constructor(private _fb: FormBuilder, private _users: UsersService) { }

  ngOnInit(): void {
    this.initSteps();
    this.initForm();
    this.formError = new FormHelper.ErrorManagement(this.storeForm);
  }

  initSteps() {
    this.steps = [
      { id: 1, label: 'Owner Details', template: this.ownerDetailsComp },
      { id: 2, label: 'Store Info', template: this.storeInfComp },
      { id: 3, label: 'Branch', template: this.branchComp }
    ];
  }

  initForm() {
    this.storeForm = this._fb.group({
      owner: this._fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        phoneNumber: ['', [Validators.required], [this.phoneValidator.bind(this)]],
        password: ['', Validators.required]
      }),

      store: this._fb.group({
        classificationId: [null, Validators.required],
        englishName: ['', Validators.required],
        arabicName: ['', Validators.required],
        englishDescription: ['', Validators.required],
        arabicDescription: ['', Validators.required],
        shortName: ['', Validators.required],
        merchantType: ['', Validators.required],

        merchantTagsIds: [null],
        merchantCategoryIds: [null, Validators.compose([Validators.required, Validators.minLength(1)])],

        contacts: this._fb.array([this._fb.group({ contact: ['', Validators.required], contactType: 1 })]),
        icon: this._fb.group({ externalStorageId: [''], mimeType: [''], sizeInBytes: [0], blobUrI: [''] }),

        userId: [null]
      }),

      branch: this._fb.group({
        arabicName: ['', [Validators.required]],
        englishName: ['', [Validators.required]],
        branchType: [null, [Validators.required]],
        branchTagIds: [null],
        images: [null],
        workingHoursFrom: [''],
        workingHoursTo: [''],
        location: this._fb.group({ longitude: [44], latitude: [55] }),
        contacts: this._fb.array([this._fb.group({ contact: [''], contactType: 1 })]),
        branchDaysOff: [null],
        // merchantId: [''],
        addressTags: [null],

        address: this._fb.group({
          countryId: ['', [Validators.required]],
          cityId: ['', [Validators.required]],
          localityId: ['', [Validators.required]],
          subLocalityId: ['', [Validators.required]],
          street: ['', [Validators.required]],
          streetNo: ['', [Validators.required]],
        })
      })
    });
  }

  submit() {
    if (this.storeForm.invalid) return;
    console.log(this.storeForm.value);
  }

  phoneValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.validatePhoneNumber(control.value);
  }

  validatePhoneNumber(phone: string): Observable<ValidationErrors | null> {
    // Simulate an API call to validate the phone number
    return this._users.checkUser(phone)
      .pipe(
        map(response => response.data ? { invalidPhone: true } : null),
        catchError(() => of({ invalidPhone: true })) // Handle errors
      );
  }
}
