import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Classification } from '@admin-features/products/interfaces/products.interface';
import { variantsData } from '@admin-features/products/interfaces/variants.interface';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';

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
export class AddVariantsValueComponent implements OnInit {
  addVariantValueForm!: FormGroup;
  @Output() save = new EventEmitter<void>();
  @Output() closeVariantValue = new EventEmitter<void>();
  @Input() classifications: Classification[] = [];
  breadcrumb!: MenuItem[];
  @Input() variantsData!: variantsData | null; // Properly typed as UnitData or null
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.initForm();
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
    this.variantValues.removeAt(index);
  }
  get variantValues(): FormArray {
    return this.addVariantValueForm.get('variantValues') as FormArray;
  }
  createVariantGroup(): FormGroup {
    return this.fb.group({
      id: [0],
      arabicName: ['', [Validators.required,Validators.maxLength(50)]],
      englishName: ['', [Validators.required,Validators.maxLength(50)]],
    });
  }
  get control() {
    return this.addVariantValueForm.controls;
  }
  onSave() {
    if (this.addVariantValueForm.valid) {
      if (this.variantsData) {
        this.addVariantValueForm.get('id')?.setValue(this.variantsData.id);
      }
      this.save.emit(this.addVariantValueForm.value);
    }
  }
  onClose() {
    this.closeVariantValue.emit();
  }
}
