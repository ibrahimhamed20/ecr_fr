import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProductsService } from '@admin-features/products/services/products.service';
import { DropdownEvent } from '@admin-features/products/interfaces/products.interface';
import { ClassificationsData } from '@admin-features/products/interfaces/classifications.interface';

@Component({
  selector: 'admin-add-edit-classification',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
    TranslateModule,
    FileUploadModule,],
  templateUrl: './add-edit-classification.component.html',
  styleUrl: './add-edit-classification.component.scss',
})
export class AddEditClassificationComponent {
  @Input() ClassificationsData!: ClassificationsData | null; // Properly typed as UnitData or null

  classificationsForm!: FormGroup;
  @Output() save = new EventEmitter<void>();

  constructor(private _fb: FormBuilder, private _product: ProductsService) {}

  ngOnInit() {
    this.classificationsForm = this.initForm();
    if (this.ClassificationsData) {
      this.classificationsForm.patchValue(this.ClassificationsData);
    }
  }

  private initForm(): FormGroup {
    return (this.classificationsForm = this._fb.group({
      id: [],
      arabicName: ['', [Validators.required]],
      englishName: ['', [Validators.required]],
      serviceType: [0, [Validators.required]],
      iconUrl: this._fb.group({
        externalStorageId: '',
        mimeType: '',
        sizeInBytes: 0,
        blobUrI: '',
      }),
    }));
  }

  onClassificationChange(event: DropdownEvent) {

  }

  onSave() {
    if (this.classificationsForm.valid) {
      this.save.emit(this.classificationsForm.value);
    } else {
      this.classificationsForm.markAllAsTouched();
    }
  }

  // uploadedFiles: any[] = [];
  // onUpload(event: any) {
  //   for (const file of event.files) {
  //     this.uploadedFiles.push(file);
  //   }
  // }

  onUpload(event: any) {
    const files = event.files;
    if (files.length > 0) {
      const file = files[0];
      const iconFormGroup = this.classificationsForm.get('iconUrl') as FormGroup;

      iconFormGroup.patchValue({
        externalStorageId: file.name, // Here, you might want to set a real external ID
        mimeType: file.type,
        sizeInBytes: file.size,
        blobUrl: URL.createObjectURL(file)
      });
    }
  }
}
