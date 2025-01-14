import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FileEvent, Classification, CategoriesData } from '@admin-features/products/interfaces/products.interface';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ProductsService } from '@admin-features/products/services/products.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogService, OnlyNumbersDirective, PopupService } from '@shared-ui';
import { ClassificationsData } from '@admin-features/products/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';

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
    OnlyNumbersDirective,
    ButtonModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './add-edit-category.component.html',
  styleUrl: './add-edit-category.component.scss',
})
export class AddEditCategoryComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  classifications: Classification[] = [];
  data!: any | null;
  subCatagory:any[] =[];
  dialogForm!: FormGroup;
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(
    private _fb: FormBuilder,
    private _popup: PopupService,
    private _translate: TranslateService,
    private _confirm: ConfirmDialogService,
    private _toastr: ToastrService,
    private _product: ProductsService) { }

  ngOnInit() {
    this.prepareForm();
    this.data = this._popup.getData();
    this.classifications = this.data?.classifications as Classification[];
    if (this.data?.response) {
      this.dialogForm.patchValue(this.data?.response);
      this.setPreSelectedValues();
      this.getAllCategories();;
    }
  }
  prepareForm() {
    this.dialogForm = this._fb.group({
      arabicName: [null, [Validators.required,Validators.maxLength(50)]],
      englishName: [null, [Validators.required,Validators.maxLength(50)]],
      classificationsIds: [null],
      id: [this.data?.response?.id],
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
  getAllCategories() {
    this._product.getAllCategories(100000, 1,'').subscribe((res: any) => {
      let data = res.data.result;
      let parentId = this.data?.response?.id;
      let childCategories = data.filter((x:any) => x.id == parentId);
      if(childCategories){
        this.subCatagory = childCategories[0]?.subCategories ? childCategories[0]?.subCategories : [];
      console.log('this.subCatagorythis.subCatagorythis.subCatagory',this.subCatagory)
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
    const category = this.dialogForm.getRawValue();
    (this.data?.response ?
      this._product.editCategory(category) : this._product.addCategory(category))
      .pipe(takeUntil(this.destroy$)).subscribe(() => this.afterSavingDone(this.data?.response ? 'edit' : 'add', category));
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

  onActionClicked(ev: { action: string; data?: any }) {
    switch (ev.action) {
      case 'ADD_SUB_CATEGORY': this.addSubcategory(ev.data); break;
      case 'EDIT_SUB_CATEGORY': this.editSubcategory(ev.data); break;
      case 'DELETE': this.onActionDelete(ev.data); break;
    }
  }
  editSubcategory(data:any) {
    console.log('data',data)
    this._product.getCategoryById(Number(data?.id)).subscribe(response => {
      this._popup.close({action:'EDIT_SUB_CATEGORY',data:response});
    })
  }
  addSubcategory(data:any) {
    this._popup.close({action:'ADD_SUB_CATEGORY',data:data?.response});
  }
  onActionDelete(data: { id: number }): void {
    this._confirm.confirm('delete').subscribe((res) => {
      if (res) {
        this._product
          .deleteCategory(data.id)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((response) => {
            if (response.data) {
              this.close();
            }
          });
      }
    });
  }
  close = () => this._popup.close();
}
