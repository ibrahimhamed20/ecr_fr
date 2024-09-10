import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormHelper } from '@shared-utils';
import { Classification, DropdownEvent, TagData } from '@admin-features/products/interfaces/products.interface';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'admin-tags-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule , DropdownModule , InputTextModule,
    MultiSelectModule, ButtonModule],
  templateUrl: './tags-form.component.html',
})
export class TagsFormComponent implements OnInit {
  formError!: FormHelper.ErrorManagement;

  @Input() classifications: Classification[] = [];
  @Input() tagData!: TagData | null; 
  selectedTags: TagData | null = null;

  TagFormData!: FormGroup;
  @Output() save = new EventEmitter<void>();

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
   
   this.TagFormData = this.initForm();
    if (this.tagData) {
      console.log('tagData',this.tagData)
      this.TagFormData.patchValue(this.tagData);
      if (this.tagData.classificationIds) {
        const classificationId = Number(this.tagData.classificationIds);
        const selectedClassification = this.classifications.find(
          classification => classification.id === classificationId
        );
        if (selectedClassification) {
          this.TagFormData.get('classifications')?.setValue(selectedClassification);
        }
      }
    }
  }


  private  initForm():FormGroup {
  return this.TagFormData = this._fb.group({
      // id: [null],
      arabicName: ['', [Validators.required]],
      englishName: ['', [Validators.required]],
      classificationIds: [[], [Validators.required]],
      tagTypeId: [2]
    });
  }


  onClassificationChange(event: DropdownEvent) {
    this.TagFormData.get('classificationId')?.setValue(event.value.id);
    this.TagFormData.get('classification')?.setValue(event.value);
  }
  
  onSave() {
    if (this.TagFormData.valid) {
      this.save.emit(this.TagFormData.value);
    } else {
      this.TagFormData.markAllAsTouched();
    }
  }
}