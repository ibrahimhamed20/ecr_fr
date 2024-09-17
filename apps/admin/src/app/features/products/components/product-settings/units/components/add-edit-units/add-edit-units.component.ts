import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Classification, DropdownEvent, UnitData } from '@admin-features/products/interfaces/products.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { EliminateSpecialCharsDirective } from '@shared-ui';

@Component({
  selector: 'admin-add-edit-units',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    TranslateModule,
    CheckboxModule,
    ReactiveFormsModule,
    InputTextModule,
    EliminateSpecialCharsDirective,
    ButtonModule
  ],
  templateUrl: './add-edit-units.component.html',
  styleUrls: ['./add-edit-units.component.scss'],
})
export class AddEditUnitsComponent implements OnInit {
  @Input() classifications: Classification[] = [];
  @Input() unitData!: UnitData | null; // Properly typed as UnitData or null

  addUnitForm!: FormGroup;
  @Output() save = new EventEmitter<UnitData>();
  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.prepareForm();
    if (this.unitData) {
      this.addUnitForm.patchValue(this.unitData);
      if (this.unitData.classificationId) {
        const classificationId = Number(this.unitData.classificationId);
        const selectedClassification = this.classifications.find(
          classification => classification.id === classificationId
        );
        if (selectedClassification) {
          this.addUnitForm.get('classification')?.setValue(selectedClassification);
        }
      }
    }
  }

  prepareForm() {
    this.addUnitForm = this._fb.group({
      childId: [],
      arabicName: [null, [Validators.required,Validators.maxLength(20)]],
      englishName: [null, [Validators.required,Validators.maxLength(20)]],
      classificationId: [null, Validators.required],
      classification: [null, Validators.required],
      shortArabicName: [null, [Validators.required,Validators.maxLength(20)]],
      shortEnglishName: [null, [Validators.required,Validators.maxLength(20)]],
      isDecimal: [true],
    });
  }

  get control() {
    return this.addUnitForm.controls;
  }

  onClassificationChange(event: DropdownEvent) {
    this.addUnitForm.get('classificationId')?.setValue(event.value.id);
    this.addUnitForm.get('classification')?.setValue(event.value);
  }

  onSave() {
    if (this.addUnitForm.valid) {
      this.save.emit(this.addUnitForm.value);
    } else {
      this.addUnitForm.markAllAsTouched();
    }
  }
}
