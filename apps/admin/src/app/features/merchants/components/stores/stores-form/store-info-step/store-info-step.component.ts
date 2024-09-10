import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormHelper } from '@shared-utils';

const PRIMENG_MODULES = [
  InputTextModule,
  PasswordModule,
  InputTextareaModule,
  DropdownModule,
  RadioButtonModule,
  MultiSelectModule,
  FileUploadModule,
  InputGroupModule,
  InputGroupAddonModule
];

@Component({
  selector: 'admin-store-info-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...PRIMENG_MODULES],
  templateUrl: './store-info-step.component.html'
})
export class StoreInfoStepComponent {
  @Input() form!: FormGroup;
  @Input() formError!: FormHelper.ErrorManagement;

  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
  ];

  categories = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  uploadedFiles: any[] = [];

  constructor(private _fb: FormBuilder) { }

  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  contacts: any[] = [
    { code: 1, name: ContactTypeEnum.Phone },
    { code: 2, name: ContactTypeEnum.Mobile },
    { code: 3, name: ContactTypeEnum.Email },
    { code: 4, name: ContactTypeEnum.Website },
    { code: 5, name: ContactTypeEnum.Fax },
  ];

  get storeContacts() {
    return this.form.get("store.contacts") as FormArray;
  }

  removeContact(index: number) {
    index && this.storeContacts.removeAt(index);
  }

  addContact() {
    this.storeContacts.push(this._fb.group({ contact: [''], contactType: 1 }));

  }

}

enum ContactTypeEnum {
  Phone = 'Phone',
  Mobile = 'Mobile',
  Email = 'Email',
  Website = 'Website',
  Fax = 'Fax',
}