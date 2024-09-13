import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CustomDialogService } from '@shared-ui';
import { ClassificationsData, ClassificationServiceType } from '@admin-features/products/interfaces';
import { FormHelper } from '@shared-utils';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductHelper } from '@admin-features/products/helpers/helpers';
import { ServiceTypesEnum } from '@admin-features/products/enum/service-types';
import { ClassificationsService } from '@admin-features/products/services/classifications.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'admin-classification-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputTextModule, FileUploadModule, ButtonModule, TranslateModule],
  templateUrl: './classification-form.component.html',
  styleUrl: './classification-form.component.scss'
})
export class ClassificationFormComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  public formError!: FormHelper.ErrorManagement;
  public classificationsForm!: FormGroup;

  public classification!: ClassificationsData;
  public serviceTypes!: ClassificationServiceType[];

  constructor(
    private _classifications: ClassificationsService,
    private _dialog: CustomDialogService,
    private _translate: TranslateService,
    private _toastr: ToastrService,
    private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.classification = this._dialog.getData<ClassificationsData>();
    this.serviceTypes = ProductHelper.getEnumOptions(ServiceTypesEnum);
    this.classificationsForm = this.initForm();
    this.formError = new FormHelper.ErrorManagement(this.classificationsForm);
    this.classification.id && this.getClassificationDetails();
  }

  private getClassificationDetails() {
    this._classifications.getClassificationById(this.classification.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.classification = res.data;
        this.classification.id && this.patchFormData()
      })
  }


  private initForm(): FormGroup {
    return this._fb.group({
      id: [0],
      arabicName: ['', [Validators.required]],
      englishName: ['', [Validators.required]],
      serviceType: [null, [Validators.required]],
      icon: this._fb.group({
        id: 0,
        externalStorageId: '',
        mimeType: '',
        has360View: false,
        sizeInBytes: 0,
        blobUrI: '',
      }),
    });
  }

  private patchFormData() {
    this.classificationsForm.patchValue({
      id: this.classification.id,
      arabicName: this.classification.arabicName,
      englishName: this.classification.englishName,
      serviceType: this.classification.serviceType,
      icon: this.classification.icon
    });
    const iconFormGroup = this.classificationsForm.get('icon') as FormGroup;
    this.classification.icon && iconFormGroup.patchValue({
      id: this.classification.icon.id,
      externalStorageId: this.classification.icon.externalStorageId,
      mimeType: this.classification.icon.mimeType,
      has360View: this.classification.icon.has360View,
      sizeInBytes: this.classification.icon.sizeInBytes,
      blobUrI: this.classification.icon.blobUrI
    });
  }

  uploadFile(event: FileSelectEvent) {
    const files: File[] = event.files;
    if (files.length > 0) {
      const file = files[0];
      const iconFormGroup = this.classificationsForm.get('icon') as FormGroup;
      iconFormGroup.patchValue({
        id: 0,
        externalStorageId: file.name, // Here, you might want to set a real external ID
        mimeType: file.type,
        sizeInBytes: file.size,
        has360View: true,
        blobUrl: URL.createObjectURL(file),
      });
    }
  }

  removeFile() {
    this.classificationsForm.get('icon')?.get('blobUrI')?.setValue('');
    this.classification.icon && (this.classification.icon.blobUrI = undefined);
  }

  save() {
    const classification = this.classificationsForm.getRawValue();
    (classification.id ?
      this._classifications.editClassification(classification) : this._classifications.addClassification(classification))
      .pipe(takeUntil(this.destroy$)).subscribe(() => this.afterSavingDone(classification.id ? 'edit' : 'add', classification));
  }

  afterSavingDone(type: 'add' | 'edit', classification: ClassificationsData) {
    const nameToUse = this._translate.currentLang === 'ar' ? classification?.arabicName : classification?.englishName;

    this._translate.get(type ? 'GENERAL.ADDED_SUCCESSFULLY' : 'UPDATED_SUCCESSFULLY', { name: nameToUse })
      .subscribe((msg: string) => this._toastr.success(msg));

    this._dialog.close(true);
  }

  close = () => this._dialog.close();
}
