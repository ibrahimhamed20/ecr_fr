import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Classification, CategoriesData, ClassificationsData, FileEvent } from '@admin-features/products/interfaces';
import { ProductsService } from '@admin-features/products/services/products.service';
import { PopupService } from '@shared-ui';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'admin-add-edit-subcategory',
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
    ButtonModule,
    DropdownModule,
    TableModule
  ],
  templateUrl: './add-edit-subcategory.component.html',
  styleUrl: './add-edit-subcategory.component.scss',
})
export class AddEditSubcategoryComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  classifications: Classification[] = [];
  categories: any[] = [];
  data!: any | null;
  dialogForm!: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _popup: PopupService,
    private _translate: TranslateService,
    private _toastr: ToastrService,
    private _product: ProductsService) { }

  ngOnInit() {
    this.data = this._popup.getData();
    this.prepareForm();
    this.classifications = this.data?.classifications as Classification[];
    console.log('this.data?.response',this.data)
    if (this.data?.response) {
      this.dialogForm.patchValue(this.data?.response);
      this.setPreSelectedValues();
      this.getAllCategories();
    }
  }
  prepareForm() {
    this.dialogForm = this._fb.group({
      arabicName: [null, [Validators.required,Validators.maxLength(50)]],
      englishName: [null, [Validators.required,Validators.maxLength(50)]],
      classificationsIds: [null],
      classifications: [null, Validators.required],
      parentId: [this.data?.id],
      id: [this.data?.response ? this.data.response.id : null], // Conditionally set the id
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
  subCatagory:any;
  getAllCategories() {
    this._product.getAllCategories(100000, 1,'').subscribe((res: any) => {
      let data = res.data.result;
      let parentId = this.data?.response?.id
      let childCategories = data.filter((x:any) => x.id == parentId);
      if(childCategories){
        this.subCatagory = childCategories[0]?.subCategories ? childCategories[0]?.subCategories : [];
      }
    });
  }
  onClassificationChange(event: {value:[]}) {
    const selectedIds = event.value.map((item: {id:number}) => item.id);
    this.dialogForm.get('classificationsIds')?.setValue(selectedIds);
    this.dialogForm.get('classifications')?.setValue(event.value);
  }
  setPreSelectedValues() {
    const preSelectedFormatted = this.data?.response?.classifications.map((item:any) =>
      this.classifications.find(option => option.id === item.id)
    );
    const selectedIds = preSelectedFormatted?.map((item:any) => item?.id);
    this.dialogForm.get('classificationsIds')?.setValue(selectedIds);
    // Patch the form control with the pre-selected items
    this.dialogForm.patchValue({
      classifications: preSelectedFormatted
    });
  }

  save() {
     // Check if the id is null and remove the control if necessary
      if (!this.dialogForm.get('id')?.value) {
        this.dialogForm.removeControl('id');
      }
    const updatedCategory = this.dialogForm.getRawValue();
    (this.data?.response ?
      this._product.editCategory(updatedCategory) : this._product.addCategory(updatedCategory))
      .pipe(takeUntil(this.destroy$)).subscribe(() => this.afterSavingDone(this.data?.response ? 'edit' : 'add', updatedCategory));
  }

  private afterSavingDone(type: 'add' | 'edit', classification: ClassificationsData) {
    const nameToUse = this._translate.currentLang === 'ar' ? classification?.arabicName : classification?.englishName;

    this._translate.get(type == 'add' ? 'GENERAL.ADDED_SUCCESSFULLY' : 'GENERAL.UPDATED_SUCCESSFULLY', { name: nameToUse })
      .subscribe((msg: string) => this._toastr.success(msg));

    this._popup.close(true);
  }
  //#region Upload Component Should be shared
  removeImage() {
    if (this.data?.response && this.data?.response?.icon) {
      this.data.response.icon.blobUrI = null; // Use undefined instead of null
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
  onActionClicked(item?:any) {
    this._popup.close(item);
  }
  close = () => this._popup.close();
}

