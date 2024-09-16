import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VariantsData } from '@admin-features/products/interfaces/variants.interface';
import { Classification } from '@admin-features/products/interfaces/product.interface';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { PopupService } from '@shared-ui';
import { VariantsService } from '../../../../../services/variants.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '@admin-features/products/services/products.service';
import { DropdownEvent } from '@admin-features/products/interfaces';

@Component({
  selector: 'admin-add-edit-variants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TranslateModule,
    MultiSelectModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './add-edit-variants.component.html',
  styleUrl: './add-edit-variants.component.scss',
})
export class AddEditVariantsComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  addVariantForm!: FormGroup;
  classifications: Classification[] = [];
  breadcrumb!: MenuItem[];
  public variantsData!: VariantsData;
  constructor(
    private fb: FormBuilder,
    private _popup: PopupService,
    private _varaints: VariantsService,
    private _translate: TranslateService,
    private _toastr: ToastrService,
    private _product: ProductsService,
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.getClassifications();
    this.variantsData = this._popup.getData<VariantsData>();
    this.variantsData.id && this.getVariantsDataDetails();
  }
  getClassifications(): void {
    this._product
      .getClassifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.classifications = res.data.classifications;
      });
  }
  private getVariantsDataDetails() {
    this._varaints
      .getById(this.variantsData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.variantsData = res.data;
        this.variantsData.id && this.setdataInform();
      });
  }

  initForm() {
    this.addVariantForm = this.fb.group({
      id: [0],
      arabicName: ['', [Validators.required, Validators.maxLength(50)]],
      englishName: ['', [Validators.required, Validators.maxLength(50)]],
      classificationIds: [[], Validators.required],
      variantValues: this.fb.array([this.createVariantGroup()]),
    });
  }
  setdataInform() {
    if (this.variantsData) {
      this.addVariantForm.patchValue(this.variantsData);

      this.variantValues.clear();
      for (let i = 0; i < this.variantsData.variantValues.length; i++) {
        this.variantValues.push(
          this.fb.group({
            id: this.variantsData.variantValues[i].id,
            englishName: this.variantsData.variantValues[i].englishName,
            arabicName: this.variantsData.variantValues[i].arabicName,
          })
        );
      }
    }
  }
  onClassificationChange(event: DropdownEvent) {
    this.addVariantForm.get('classificationId')?.setValue(event.value.id);
    this.addVariantForm.get('classification')?.setValue(event.value);
  }

  get variantValues(): FormArray {
    return this.addVariantForm.get('variantValues') as FormArray;
  }
  get control() {
    return this.addVariantForm.controls;
  }

  createVariantGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      arabicName: ['', [Validators.required, Validators.maxLength(50)]],
      englishName: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  // Method to add a new variant
  addNewVariants() {
    this.variantValues.push(this.createVariantGroup());
  }

  removeVariants(index: number) {
    index && this.variantValues.removeAt(index);
  }

  save() {
    const variant = this.addVariantForm.getRawValue();

    (variant.id ? this._varaints.update(variant) : this._varaints.create(variant))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() =>
        this.afterSavingDone(variant.id ? 'edit' : 'add', variant)
      );
  }
  private afterSavingDone(type: 'add' | 'edit', classification: VariantsData) {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
