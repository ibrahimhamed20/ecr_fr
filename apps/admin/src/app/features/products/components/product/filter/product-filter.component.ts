import { Component, EventEmitter, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin, map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ProductsService } from '@admin-features/products/services/products.service';
import { Classification, Brand, Category } from '@admin-features/products/interfaces/products.interface';

interface FilterData {
  classifications: Classification[];
  categories: Category[];
  brands: Brand[];
}

interface FilterCriteria {
  ClassificationId: number;
  Keyword: string;
  BrandId: number;
  CategoryId: number;
}

@Component({
  selector: 'admin-product-filter',
  standalone: true,
  imports: [CommonModule, DropdownModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './product-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterComponent implements OnInit {
  @Output() onFilter = new EventEmitter<FilterCriteria>();
  filterForm!: FormGroup;
  filterData$!: Observable<FilterData>;

  constructor(
    private _fb: FormBuilder,
    private _product: ProductsService) { }

  ngOnInit(): void {
    this.filterForm = this.initializeForm();
    this.filterData$ = this.getData();
  }

  private initializeForm(): FormGroup {
    return this._fb.group({
      ClassificationId: [''],
      BrandId: [''],
      Unit: [''],
      CategoryId: [''],
    });
  }

  private getData(): Observable<FilterData> {
    return forkJoin({
      classifications: this._product.getClassifications().pipe(map(res => res.data.classifications)),
      categories: this._product.getCategories(),
      brands: this._product.getAllBrands(100000, 1),
    });
  }

  onSubmit(): void {
    this.onFilter.emit(this.filterForm.value);
  }

  onReset(): void {
    this.filterForm.reset();
    this.onFilter.emit(this.filterForm.value);
  }
}