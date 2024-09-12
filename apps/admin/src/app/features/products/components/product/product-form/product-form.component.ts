import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BasicInfoComponent, BREADCRUMB_ITEMS, PRODUCT_FORM_IMPORTS } from './product-form.config';
import { MenuItem } from 'primeng/api';
import {  FormBuilder, FormGroup,Validators } from '@angular/forms';
import { FormHelper } from '@shared-utils';
import { UsersService } from '@admin-shared/services';
import { ProductImagesComponent } from './product-images/product-images.component';
import { ProductTreeComponent } from './product-tree/product-tree.component';

@Component({
  selector: 'admin-product-form',
  standalone: true,
  imports: PRODUCT_FORM_IMPORTS,
  templateUrl:'./product-form.component.html',
  styles: ``,
})
export class ProductFormComponent {

  steps: { id: number, label: string, template: TemplateRef<any> }[] = [];
  @ViewChild('basicInfo', { static: true }) private basicInfoComp!: TemplateRef<BasicInfoComponent>;
  @ViewChild('productImages', { static: true }) private productImagefComp!: TemplateRef<ProductImagesComponent>;
  @ViewChild('productTree', { static: true }) private productTreeComp!: TemplateRef<ProductTreeComponent>;

  // breadcrumb config
  breadcrumb: MenuItem[] = BREADCRUMB_ITEMS;
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
      { id: 1, label: 'Basic Info', template: this.basicInfoComp },
      { id: 2, label: 'Product Images', template: this.productImagefComp },
      { id: 3, label: 'Product Tree ', template: this.productTreeComp },
      { id: 4, label: 'Final Details', template: this.productTreeComp }
    ];
  }


  initForm() {
    this.storeForm = this._fb.group({
      basicinfo: this._fb.group({
        productName: [null, [Validators.required, Validators.maxLength(100)]],
        unitIds:[null, [Validators.required]],
        countryId:[null, [Validators.required]],
        classificationId:[null, [Validators.required]],
        hasSerialNumber: [],
        hasExpiryDate: [],
        expirationDateAlarm: [],
        timeUnit: this._fb.array([this._fb.group({ contact: [null], contactType: 1 })]),
        hasUnits: [false],
        smallUnit: [null],
        mediumUnit: [null],
        largeUnit: [null],
        largeUnitCount:[],
        mediumUnitCount:[],
        variantType:[],
        variantValue:[]
      }),

      productImage: this._fb.group({
        icon: this._fb.group({ externalStorageId: [''], mimeType: [''], sizeInBytes: [0], blobUrI: [''] }),
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
        tagIds:[],

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


}
