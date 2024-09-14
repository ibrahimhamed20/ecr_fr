import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormHelper } from '@shared-utils';
import {
  ApiResponse,
  Classification,
  ClassificationsResponse,
  DropdownEvent,
} from '@admin-features/products/interfaces/products.interface';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TagsData } from '@admin-features/products/interfaces/tags.interface';
import { Subject, takeUntil } from 'rxjs';
import { PopupService } from '@shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '@admin-features/products/services/products.service';
import { TagsService } from '../services/tags.service';

@Component({
  selector: 'admin-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
    TranslateModule,
  ],
  templateUrl: './tags-form.component.html',
})
export class TagsFormComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();

  public formError!: FormHelper.ErrorManagement;
  public tagForm!: FormGroup;

  public tag!: TagsData;
  classifications: Classification[] = [];
  selectedTag: any;

  constructor(
    private _tag: TagsService,
    private _popup: PopupService,
    private _translate: TranslateService,
    private _toastr: ToastrService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.tag = this._popup.getData<TagsData>();
    this.tagForm = this.initForm();
    this.formError = new FormHelper.ErrorManagement(this.tagForm);
    if (this.tag && this.tag.tagId) {
      this.getTagsDetails({ tagId: this.tag.tagId });
    }
    this.getClassifications();
  }
  private getClassifications(): void {
    this._tag
      .getClassifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ClassificationsResponse) => {
          this.classifications = res.data.classifications;
        },
      });
  }
  private getTagsDetails(data: { tagId: number }) {
    const id = typeof data.tagId === 'string' ? Number(data.tagId) : data.tagId;
    if (id && !isNaN(id)) {
      this._tag.getTagsById(id).subscribe((res: ApiResponse<TagsData>) => {
        if (res.data) {
          this.selectedTag = res.data;
          this.selectedTag.classificationIds = (
            this.selectedTag.classificationIds || []
          ).map((classification: any) => classification.id);
          this.patchFormData();
        }
      });
    }
  }

  private initForm(): FormGroup {
    return this._fb.group({
      classificationIds: [[], [Validators.required]],
      arabicName: ['', [Validators.required]],
      englishName: ['', [Validators.required]],
      TagTypeId: [2],
    });
  }

  private patchFormData() {
    this.tagForm.patchValue({
      classificationIds: this.selectedTag.classificationIds || [],
      arabicName: this.selectedTag.arabicName,
      englishName: this.selectedTag.englishName,
    });
  }

  save() {
    const classification = this.tagForm.getRawValue();
    (classification.id
      ? this._tag.editTags(classification)
      : this._tag.addTags(classification)
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
}
