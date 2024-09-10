import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormHelper } from '@shared-utils';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'admin-product-images',
  standalone: true,
  imports: [CommonModule,FileUploadModule,ReactiveFormsModule
  ],
  templateUrl: './product-images.component.html',
  styles: ``,
})
export class ProductImagesComponent {
  @Input() form!: FormGroup;
  @Input() formError!: FormHelper.ErrorManagement;
  uploadedFiles: any[] = [];

  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  onError(event: any) {
    if (event.error === 'sizeLimitExceeded') {
      alert('الحد الأقصى لحجم الصورة هو 2 ميجا');
    }
  }
}
