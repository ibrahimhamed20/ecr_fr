import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownEvent } from '@admin-features/products/interfaces/products.interface';
import { ClassificationsData } from '@admin-features/products/interfaces/classifications.interface';
import { Service_Types } from '@admin-features/products/enum/service-types';

@Component({
  selector: 'admin-add-edit-classification',
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
  templateUrl: './add-edit-classification.component.html',
  styleUrl: './add-edit-classification.component.scss',
})
export class AddEditClassificationComponent {
  @Input() ClassificationsData!: ClassificationsData | null; // Properly typed as UnitData or null
  @Output() closeDialog= new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  ServicetypeOptions!: { label: string; value: number }[];
  classificationsForm!: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.classificationsForm = this.initForm();
    this.ServicetypeOptions = this.getEnumOptions(Service_Types);
    if (this.ClassificationsData) {;
    this.setdatatoForm(this.ClassificationsData);
    }
  }
  setdatatoForm(editData: ClassificationsData) {
    this.classificationsForm.patchValue({
      id: editData.id,
      arabicName: editData.arabicName,
      englishName: editData.englishName,
      serviceType: editData.serviceType,
    });
  
    // Conditionally patch the icon object if it exists
    if (editData.icon) {
      this.classificationsForm.patchValue({
        iconUrl: {
          id: editData.icon.id,
          externalStorageId: editData.icon.externalStorageId,
          mimeType: editData.icon.mimeType,
          has360View: editData.icon.has360View,
          sizeInBytes: editData.icon.sizeInBytes,
          blobUrI: editData.icon.blobUrI
        }
      });
    }
  
    // Patch the serviceType based on the options
    const serviceType = Number(editData.serviceType);
    const selectedServType = this.ServicetypeOptions.find(
      (classification) => classification.value === serviceType
    );
    if (selectedServType) {
      this.classificationsForm.get('serviceType')?.setValue(selectedServType);
    }
  }
  
  private initForm(): FormGroup {
    return (this.classificationsForm = this._fb.group({
      id: [0],
      arabicName: ['', [Validators.required]],
      englishName: ['', [Validators.required]],
      serviceType: [0, [Validators.required]],
      icon: this._fb.group({
        id:0,
        externalStorageId: '',
        mimeType: '',
        has360View:false,
        sizeInBytes: 0,
        blobUrI: '',
      }),
    }));
  }
  getEnumOptions(enumType: any): { label: string; value: number }[] {
    return Object.keys(enumType)
      .filter((key) => !isNaN(Number(enumType[key])))
      .map((key) => ({
        label: key,
        value: enumType[key],
      }));
  }
  removeImage() {
    if (this.ClassificationsData && this.ClassificationsData.icon) {
      this.ClassificationsData.icon.blobUrI = undefined; // Use undefined instead of null
    }
  }

  onClassificationChange(event: DropdownEvent) {}

  onSave() {
    if (this.classificationsForm.valid) {
      this.save.emit(this.classificationsForm.value);
    } else {
      this.classificationsForm.markAllAsTouched();
    }
  }


  onUpload(event: any) {
    debugger
    const files = event.files;
    if (files.length > 0) {
      const file = files[0];
      const iconFormGroup = this.classificationsForm.get(
        'icon'
      ) as FormGroup;

      iconFormGroup.patchValue({
        id:0,
        externalStorageId: file.name, // Here, you might want to set a real external ID
        mimeType: file.type,
        sizeInBytes: file.size,
        has360View :true,
        blobUrl: URL.createObjectURL(file),
      });
    }
  }
  onClose(){
    this.closeDialog.emit();
  }
}
