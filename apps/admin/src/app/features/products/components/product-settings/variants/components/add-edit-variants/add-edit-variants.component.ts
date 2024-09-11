import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { variantsData } from '@admin-features/products/interfaces/variants.interface';
import { Classification } from '@admin-features/products/interfaces/product.interface';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

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
  @Output() save = new EventEmitter<void>();
  @Output() closeVariantValue = new EventEmitter<void>();

  addVariantForm!: FormGroup;
  @Input() classifications: Classification[] = [];
  breadcrumb!: MenuItem[];
  @Input() variantsData!: variantsData | null; // Properly typed as UnitData or null
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    this.initForm();
    this.setdataInform();
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
      const selectedClassifications = this.getSelectedOptions(
        this.variantsData.classificationIds
      );
      this.addVariantForm.patchValue({
        classificationIds: selectedClassifications,
      });
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
  getSelectedOptions(selectedIds: number[]): any[] {
    return this.classifications.filter((option) => selectedIds.includes(option.id));
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
    this.variantValues.removeAt(index);
  }

  onSave() {
    if (this.addVariantForm.valid) {
      this.save.emit(this.addVariantForm.value);
    } else {
      this.addVariantForm.markAllAsTouched();
    }
  }
  onClose() {
    this.closeVariantValue.emit();

  }
}
