import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  Classification,
  DropdownEvent,
  BrandData,
  FileEvent,
} from '@admin-features/products/interfaces/products.interface';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ProductsService } from '@admin-features/products/services/products.service';

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
  @Input() classifications: Classification[] = [];
  @Input() brandData!: BrandData | null;
  selectedBrand: BrandData | null = null;

  brandForm!: FormGroup;
  @Output() save = new EventEmitter<void>();

  constructor(private _fb: FormBuilder, private _product: ProductsService) {}

  ngOnInit() {
    this.brandForm = this.initForm();
    if (this.brandData) {
      this.brandForm.patchValue(this.brandData);
    }
  }

  private initForm(): FormGroup {
    return (this.brandForm = this._fb.group({
      arabicName: ['', [Validators.required]],
      englishName: ['', [Validators.required]],
      classificationIds: [[], [Validators.required]],
      countryIds: [null],
      iconUrl: this._fb.group({
        externalStorageId: '',
        mimeType: '',
        sizeInBytes: 0,
        blobUrI: '',
      }),
    }));
  }

  onClassificationChange(event: DropdownEvent) {
    this.brandForm.get('classificationId')?.setValue(event.value.id);
    this.brandForm.get('classification')?.setValue(event.value);
  }

  onSave() {
    if (this.brandForm.valid) {
      this.save.emit(this.brandForm.value);
    } else {
      this.brandForm.markAllAsTouched();
    }
  }

  uploadedFiles: any[] = [];
  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

}
