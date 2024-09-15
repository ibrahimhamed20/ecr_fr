import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Classification, DropdownEvent, ClassificationsResponse, Data,} from '@admin-features/products/interfaces/products.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { FormHelper } from '@shared-utils';
import { Subject, takeUntil } from 'rxjs';
import { PopupService } from '@shared-ui';
import { ToastrService } from 'ngx-toastr';
import { BrandService } from '../services/brands.service';
import { BrandData } from '@admin-features/products/interfaces/brand.interface';

@Component({
  selector: 'admin-brands-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
    TranslateModule,
    FileUploadModule,
  ],
  templateUrl: './brands-form.component.html',
  styles: ``,
})
export class BrandsFormComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  public formError!: FormHelper.ErrorManagement;
  public brandForm!: FormGroup;

  public brand!: BrandData;
  selectedBrands: any;
  classifications: Classification[] = [];

  constructor(
    private _product: BrandService,
    private _popup: PopupService,
    private _translate: TranslateService,
    private _toastr: ToastrService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.brand = this._popup.getData<BrandData>();
    this.brandForm = this.initForm();
    this.formError = new FormHelper.ErrorManagement(this.brandForm);
    this.brand.id && this.getBrandDetails();
    this.getClassifications();
  }
  private getBrandDetails() {
    this._product
      .getBrandById(this.brand.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Data<BrandData>) => {
          this.brand = res.data;  
          if (!this.selectedBrands) {
            this.selectedBrands = {
              classificationModels: [],
              classificationIds: [],
            };
          }
  
          this.selectedBrands.classificationIds = (
            this.brand.classificationModels || []
          ).map((model: Classification) => model.id || 0);
  
          if (this.brand.id) {
            this.patchFormData();
          }
        },
      });
  }
  
  private initForm(): FormGroup {
    return this._fb.group({
      id: [0],
      classificationIds: [[], [Validators.required]],
      arabicName: ['', [Validators.required]],
      englishName: ['', [Validators.required]],
      serviceType: [null, [Validators.required]],
      icon: this._fb.group({
        id: 0,
        externalStorageId: '',
        mimeType: '',
        has360View: false,
        sizeInBytes: 0,
        blobUrI: '',
      }),
    });
  }

  private patchFormData() {
    this.brandForm.patchValue({
      id: this.brand.id,
      classificationIds: this.selectedBrands.classificationIds || [],
      arabicName: this.brand.arabicName,
      englishName: this.brand.englishName,
      icon: this.brand.icon || {},
    });
    console.log('Form Value Inside patchFormData:', this.brandForm.value);
    const iconFormGroup = this.brandForm.get('icon') as FormGroup;
    this.brand.icon &&
      iconFormGroup.patchValue({
        id: this.brand.icon.id,
        externalStorageId: this.brand.icon.externalStorageId,
        mimeType: this.brand.icon.mimeType,
        has360View: this.brand.icon.has360View,
        sizeInBytes: this.brand.icon.sizeInBytes,
        blobUrI: this.brand.icon.blobUrI,
      });
  }

  uploadFile(event: FileSelectEvent) {
    const files: File[] = event.files;
    if (files.length > 0) {
      const file = files[0];
      const iconFormGroup = this.brandForm.get('icon') as FormGroup;
      iconFormGroup.patchValue({
        id: 0,
        externalStorageId: file.name,
        mimeType: file.type,
        sizeInBytes: file.size,
        has360View: true,
        blobUrl: URL.createObjectURL(file),
      });
    }
  }

  removeFile() {
    this.brandForm.get('icon')?.get('blobUrI')?.setValue('');
    this.brand.icon && (this.brand.icon.blobUrI = undefined);
  }

  save() {
    const classification = this.brandForm.getRawValue();
    (classification.id
      ? this._product.editBrand(classification)
      : this._product.addBrand(classification)
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() =>
        this.afterSavingDone(classification.id ? 'edit' : 'add', classification)
      );
  }

  private afterSavingDone(type: 'add' | 'edit', classification: BrandData) {
    const nameToUse =
      this._translate.currentLang === 'ar'
        ? classification?.arabicName
        : classification?.englishName;

    this._translate
      .get(type ? 'GENERAL.ADDED_SUCCESSFULLY' : 'UPDATED_SUCCESSFULLY', {
        name: nameToUse,
      })
      .subscribe((msg: string) => this._toastr.success(msg));

    this._popup.close(true);
  }

  close = () => this._popup.close();

  onClassificationChange(event: DropdownEvent) {
    this.brandForm.get('classificationId')?.setValue(event.value.id);
    this.brandForm.get('classification')?.setValue(event.value);
  }
  private getClassifications(): void {
    this._product
      .getClassifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ClassificationsResponse) => {
          this.classifications = res.data.classifications;
        },
      });
  }
}
