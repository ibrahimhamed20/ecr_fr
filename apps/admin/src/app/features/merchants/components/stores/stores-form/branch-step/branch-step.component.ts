import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { FormHelper } from '@shared-utils';
import { CalendarModule } from 'primeng/calendar';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'admin-branch-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    FileUploadModule,
    CalendarModule,
    InputGroupAddonModule,
    InputGroupModule
  ],
  templateUrl: './branch-step.component.html',
})
export class BranchStepComponent {
  @Input() form!: FormGroup;
  @Input() formError!: FormHelper.ErrorManagement;

  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' },
  ];

  selections = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' },
  ];
  constructor(private _fb: FormBuilder) { }

  uploadedFiles: any[] = [];
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

  get branchContacts() {
    return this.form.get('branch.contacts') as FormArray;
  }

  removeContact(index: number) {
    index && this.branchContacts.removeAt(index);
  }

  addContact() {
    this.branchContacts.push(this._fb.group({ contact: [''], contactType: 1 }));
  }
}

export enum ContactTypeEnum {
  Phone = 'Phone',
  Mobile = 'Mobile',
  Email = 'Email',
  Website = 'Website',
  Fax = 'Fax',
}
