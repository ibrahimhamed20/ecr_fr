import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormHelper } from '@shared-utils';
import { ApiResponse, Classification, ClassificationsResponse, Data, DropdownEvent } from '@admin-features/products/interfaces/products.interface';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TagsData } from '@admin-features/products/interfaces/tags.interface';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '@admin-shared/services';
import { PopupService } from '@shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '@admin-features/products/services/products.service';

@Component({
  selector: 'admin-tags-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule , DropdownModule , InputTextModule,
    MultiSelectModule, ButtonModule, TranslateModule],
  templateUrl: './tags-form.component.html',
})
// export class TagsFormComponent implements OnInit {
//   formError!: FormHelper.ErrorManagement;

//   @Input() classifications: Classification[] = [];
//   @Input() tagData!: TagData | null; 
//   selectedTags: TagData | null = null;

//   TagFormData!: FormGroup;
//   @Output() save = new EventEmitter<void>();

//   constructor(private _fb: FormBuilder) {}

//   ngOnInit() {
   
//    this.TagFormData = this.initForm();
//     if (this.tagData) {
//       console.log('tagData',this.tagData)
//       this.TagFormData.patchValue(this.tagData);
//       if (this.tagData.classificationIds) {
//         const classificationId = Number(this.tagData.classificationIds);
//         const selectedClassification = this.classifications.find(
//           classification => classification.id === classificationId
//         );
//         if (selectedClassification) {
//           this.TagFormData.get('classifications')?.setValue(selectedClassification);
//         }
//       }
//     }
//   }


//   private  initForm():FormGroup {
//   return this.TagFormData = this._fb.group({
//       // id: [null],
//       arabicName: ['', [Validators.required]],
//       englishName: ['', [Validators.required]],
//       classificationIds: [[], [Validators.required]],
//       tagTypeId: [2]
//     });
//   }


//   onClassificationChange(event: DropdownEvent) {
//     this.TagFormData.get('classificationId')?.setValue(event.value.id);
//     this.TagFormData.get('classification')?.setValue(event.value);
//   }
  
//   onSave() {
//     if (this.TagFormData.valid) {
//       this.save.emit(this.TagFormData.value);
//     } else {
//       this.TagFormData.markAllAsTouched();
//     }
//   }
// }

export class TagsFormComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  public formError!: FormHelper.ErrorManagement;
  public tagForm!: FormGroup;

  public tag!: TagsData;

  constructor(
    private _product: ProductsService,
    private _popup: PopupService,
    private _translate: TranslateService,
    private _toastr: ToastrService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.tag = this._popup.getData<TagsData>();
    this.tagForm = this.initForm();
    this.formError = new FormHelper.ErrorManagement(this.tagForm);
    this.tag.id && this.getTagsDetails({ tagId: this.tag.id });
    this.getClassifications();
  }
  selectedTag: any;

  // private getBrandDetails() {
  //   this._product.getBrandById(this.brand.id)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(res => {
  //       this.brand = res.data;
  //         console.log('Brand Data:', this.brand);
  //       console.log('Classification Models:', this.brand.classificationModels);

  //       if (!this.selectedBrands) {
  //         this.selectedBrands = { classificationModels: [], classificationIds: [] };
  //       }

  //       this.selectedBrands.classificationIds = (
  //         (this.brand.classificationModels || []).map((model: Classification) => model.id || 0)
  //       );

  //       console.log('Updated classificationIds:', this.selectedBrands.classificationIds);

  //       if (this.brand.id) {
  //         this.patchFormData();

  //         // Log the form value after patching
  //         console.log('Form Value After Patching:', this.brandForm.value);
  //       }
  //     }, error => {
  //       console.error('Error fetching brand details:', error);
  //     });
  // }

  // private getBrandDetails() {
  //   this._product
  //     .getBrandById(this.brand.id)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res: Data<BrandData>) => {
  //         if (!this.selectedBrands) {
  //           this.selectedBrands = {
  //             classificationModels: [],
  //             classificationIds: [],
  //           };
  //         }

  //         this.selectedBrands.classificationIds = (
  //           this.brand.classificationModels || []
  //         ).map((model: Classification) => model.id || 0);

  //         if (this.brand.id) {
  //           this.patchFormData();
  //         }
  //       },
  //     });
  // }
  // private getTagsDetails() {
  //   if (!this.tag?.id) {
  //     // Handle undefined or invalid tag.id
  //     console.error('Invalid tag ID');
  //     return;
  //   }
  
  //   this._product
  //     .getTagsById(this.tag.id)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (res: ApiResponse<TagsData>) => {
  //         if (res?.data) {
  //           this.tag = res.data;
  
  //           if (!this.selectedTag) {
  //             this.selectedTag = {
  //               classificationModels: [],
  //               classificationIds: [],
  //             };
  //           }
  
  //           this.selectedTag.classificationIds = (
  //             this.tag.classificationModels || []
  //           ).map((model: Classification) => model.id || 0);
  
  //           if (this.tag.id) {
  //             this.patchFormData();
  //           }
  //         } else {
  //           console.error('No data returned from API');
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Error fetching tag details:', err);
  //       },
  //     });
  // }
  // private getTagsDetails(data: { tagId: number | string }) {
  //   const id = typeof data.tagId === 'string' ? Number(data.tagId) : data.tagId;
  
  //   if (id && !isNaN(id)) {
  //     this._product.getTagsById(id).subscribe({
  //       next: (res: ApiResponse<TagsData>) => {
  //         console.log('Response:', res.data);
  
  //         if (res.data) {
  //           this.selectedTag = res.data;
  
  //           // Ensure classificationIds exist and map them correctly
  //           this.selectedTag.classificationIds = (this.selectedTag.classificationIds || []).map(
  //             (obj: any) => obj.id
  //           );
  
  //           console.log('Selected Tags:', this.selectedTag);
  //         } else {
  //           console.error('No data received from API');
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Error fetching tag data:', err);
  //       }
  //     });
  //   } else {
  //     console.error('Invalid tag ID');
  //   }
  // }
  private getTagsDetails(data: { tagId: number | string }) {
    const id = typeof data.tagId === 'string' ? Number(data.tagId) : data.tagId;
  
    if (id && !isNaN(id)) {
      this._product.getTagsById(id).subscribe({
        next: (res: ApiResponse<TagsData>) => {
          console.log('Response:', res.data);
  
          if (res.data) {
            this.selectedTag = res.data;
  
            // Ensure classificationIds exist and map them correctly
            this.selectedTag.classificationIds = (this.selectedTag.classificationIds || []).map(
              (obj: any) => obj.id
            );
  
            console.log('Selected Tags:', this.selectedTag);
          } else {
            console.error('No data received from API');
          }
        },
        error: (err) => {
          console.error('Error fetching tag data:', err);
        }
      });
    } else {
      console.error('Invalid tag ID');
    }
  }
  
  private initForm(): FormGroup {
    return this._fb.group({
      id: [0],
      classificationIds: [[], [Validators.required]],
      arabicName: ['', [Validators.required]],
      englishName: ['', [Validators.required]],
      TagTypeId: [2],
    });
  }

  private patchFormData() {
    this.tagForm.patchValue({
      id: this.tag.id,
      classificationIds: this.selectedTag.classificationIds || [],
      arabicName: this.tag.arabicName,
      englishName: this.tag.englishName,
    });
    console.log('Form Value Inside patchFormData:', this.tagForm.value);
    const iconFormGroup = this.tagForm.get('icon') as FormGroup;
  }




  save() {
    const classification = this.tagForm.getRawValue();
    (classification.id
      ? this._product.editTags(classification)
      : this._product.addTags(classification)
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() =>
        this.afterSavingDone(classification.id ? 'edit' : 'add', classification)
      );
  }

  private afterSavingDone(type: 'add' | 'edit', classification: TagsData) {
    const nameToUse =
      this._translate.currentLang === 'ar'
        ? classification?.arabicName
        : classification?.englishName;

    this._translate
      .get(type ? 'GENERAL.ADDED_SUCCESSFULLY' : 'UPDATED_SUCCESSFULLY', {
        name: nameToUse,
      })
      .subscribe((msg: string) => this._toastr.success(msg));

    this._popup.close(true);
  }

  close = () => this._popup.close();

  onClassificationChange(event: DropdownEvent) {
    this.tagForm.get('classificationId')?.setValue(event.value.id);
    this.tagForm.get('classification')?.setValue(event.value);
  }
  classifications: Classification[] = [];
  private getClassifications(): void {
    this._product
      .getClassifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ClassificationsResponse) => {
          this.classifications = res.data.classifications;
        },
      });
  }
}