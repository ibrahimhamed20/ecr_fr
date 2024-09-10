import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FileEvent, Classification, CategoriesData } from '@admin-features/products/interfaces/products.interface';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ProductsService } from '@admin-features/products/services/products.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'admin-add-edit-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    MultiSelectModule,
    TranslateModule,
    CheckboxModule,
    InputNumberModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './add-edit-category.component.html',
  styleUrl: './add-edit-category.component.scss',
})
export class AddEditCategoryComponent implements OnInit {
  @Input() classifications: Classification[] = [];
  @Input() data!: CategoriesData | null; // Properly typed as CategoriesData or null

  dialogForm!: FormGroup;
  @Output() save = new EventEmitter<CategoriesData>();
  constructor(private _fb: FormBuilder,private _product: ProductsService) { }

  ngOnInit() {
    this.prepareForm();
    if (this.data) {
      this.dialogForm.patchValue(this.data);
      this.setPreSelectedValues();
    }
  }



  prepareForm() {
    this.dialogForm = this._fb.group({
      arabicName: [null, [Validators.required,Validators.maxLength(50)]],
      englishName: [null, [Validators.required,Validators.maxLength(50)]],
      classificationsIds: [null],
      classifications: [null, Validators.required],
      barcodeNumber: [null, Validators.required],
      icon: this._fb.group({
        externalStorageId: "",
        mimeType: "",
        sizeInBytes: 0,
        blobUrI: "",
      }),
    });
  }

  get control() {
    return this.dialogForm.controls;
  }

  onClassificationChange(event: {value:[]}) {
    const selectedIds = event.value.map((item: {id:number}) => item.id);
    this.dialogForm.get('classificationsIds')?.setValue(selectedIds);
    this.dialogForm.get('classifications')?.setValue(event.value);
  }
  setPreSelectedValues() {
    const preSelectedFormatted = this.data?.classifications.map(item =>
      this.classifications.find(option => option.id === item.id)
    );
    const selectedIds = preSelectedFormatted?.map((item) => item?.id);
    this.dialogForm.get('classificationsIds')?.setValue(selectedIds);
    // Patch the form control with the pre-selected items
    this.dialogForm.patchValue({
      classifications: preSelectedFormatted
    });
  }
  onSave() {
    if (this.dialogForm.valid) {
      this.save.emit(this.dialogForm.value);
    } else {
      this.dialogForm.markAllAsTouched();
    }
  }

  //#region Upload Component Should be shared
removeImage() {
  if (this.data && this.data.icon) {
    this.data.icon.blobUrI = undefined; // Use undefined instead of null
  }
}
  onFileSelect(event: FileEvent) {
    if (event.files && event.files[0]) {
      const file = event.files[0];
      this.uploadImage(file).subscribe(
        (res) => {
          this.updateFormWithResponse(res.data);
        },
        (error) => {
          console.error('Error during image upload:', error);
        }
      );
    }
  }
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this._product.uploadGalaryImage(formData);
  }

  updateFormWithResponse(data: {externalStorageId:string,mimeType:string,sizeInBytes:string,blobUrI:string}) {
    this.dialogForm.get("icon")?.setValue({
      externalStorageId: data.externalStorageId,
      mimeType: data.mimeType,
      sizeInBytes: data.sizeInBytes,
      blobUrI: data.blobUrI,
    });
  }
  //#endregion
}
