import { Component, Input, OnInit } from '@angular/core';
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
  FormControl,
  FormsModule,
} from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ProductService } from '@admin-features/products/Service/product-service';
import { ReplaySubject } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'admin-basic-info',
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
    InputGroupModule,
    FormsModule,
    InputNumberModule,
    CheckboxModule,
  ],
  templateUrl: './basic-info.component.html',
})
export class BasicInfoComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() formError!: FormHelper.ErrorManagement;
  Countries: any;
  classifications: any;
  // classifications: any[] = [];

  timeUnits = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];
  dropdownItems = [
    { name: 'Option 1', code: 'option1' },
    { name: 'Option 2', code: 'option2' },
    { name: 'Option 3', code: 'option3' },
  ];

  selections = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' },
  ];
  constructor(
    private _fb: FormBuilder,
    private _productService: ProductService
  ) {}
  ngOnInit(): void {
    this.getCountries();
    this.getClassifications();
  }
  hasSerialNumber: boolean = false;
  hasExpiryDate: boolean = false;
  expirationDateAlarm: number | null = null;

  // chooseExpiredDate(event: any) {
  //   this.hasExpiryDate = event.checked;
  // }

  uploadedFiles: any[] = [];
  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  timeUnit: any[] = [
    { code: 1, name: BasicInfoTypeEnum.Day },
    { code: 2, name: BasicInfoTypeEnum.Month },
    { code: 3, name: BasicInfoTypeEnum.Week },
    { code: 4, name: BasicInfoTypeEnum.Year },
  ];

  get timeUnites() {
    return this.form.get('basicinfo.timeUnit') as FormArray;
  }


  getCountries() {
    this._productService.getCountry().subscribe({
      next: (response: any) => {
        this.Countries = response.data;
      },
    });
  }

  getClassifications() {
    this._productService.getClassifications().subscribe({
      next: (res: any) => {
        this.classifications = res.data.classifications;
      },
    });
  }
  getForm(){
    console.log(this.form)
  }
}


export enum BasicInfoTypeEnum {
  Day =  'Day',
  Week =  'Week',
  Month =  'Month',
  Website = 'Website',
  Year =     'Year',
}

