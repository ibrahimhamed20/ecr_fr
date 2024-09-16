import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Classification } from '@admin-features/products/interfaces/products.interface';
import { VariantsData } from '@admin-features/products/interfaces/variants.interface';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PopupService } from '@shared-ui';
import { VariantsService } from '../../../../../services/variants.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'admin-add-variants-value',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TranslateModule,
    InputTextModule,
  ],
  templateUrl: './add-variants-value.component.html',
  styleUrl: './add-variants-value.component.scss',
})
export class AddVariantsValueComponent implements OnInit, OnDestroy {
  addVariantValueForm!: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public variantsData!: VariantsData;
  constructor(
    private fb: FormBuilder,
    private _popup: PopupService,
    private _variants: VariantsService,
    private _translate: TranslateService,
    private _toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.variantsData = this._popup.getData<VariantsData>();
  }
  initForm() {
    this.addVariantValueForm = this.fb.group({
      id: [0],
      variantValues: this.fb.array([this.createVariantGroup()]),
    });
  }

  addNewVariants() {
    this.variantValues.push(this.createVariantGroup());
  }

  removeVariants(index: number) {
    index && this.variantValues.removeAt(index);
  }
  get variantValues(): FormArray {
    return this.addVariantValueForm.get('variantValues') as FormArray;
  }
  createVariantGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      arabicName: ['', [Validators.required, Validators.maxLength(50)]],
      englishName: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }
  get control() {
    return this.addVariantValueForm.controls;
  }

  save() {
    const variant = this.addVariantValueForm.getRawValue();
    variant.id = this.variantsData?.id
    if (variant.classificationIds) {
      variant.classificationIds = variant.classificationIds.map((item: any) =>
        item.id ? item.id : item
      );
    }
    this._variants
      .create(variant)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.afterSavingDone(this.variantsData));
  }
  private afterSavingDone(variantsData: VariantsData) {
    const nameToUse =
      this._translate.currentLang === 'ar'
        ? variantsData?.arabicName
        : variantsData?.englishName;
    this._translate
      .get('GENERAL.ADDED_SUCCESSFULLY', {
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
