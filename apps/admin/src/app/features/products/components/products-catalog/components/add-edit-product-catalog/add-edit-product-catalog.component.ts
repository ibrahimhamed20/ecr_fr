import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableComponent, TableConfig } from '@shared-ui';
import { TabViewModule } from 'primeng/tabview';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CatalogService } from '../../services/catalog.service';
import { ApiResponse, UnitData } from '@admin-features/products/interfaces/products.interface';
import { debounceTime, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { ProductSelectedTableConfig, SelectedProductTableConfig } from '../../catalog.config';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginatorState } from 'primeng/paginator';
import { UnitsTableConfig } from '@admin-features/products/components/product-settings/units/units.config';

@Component({
  selector: 'admin-add-edit-product-catalog',
  standalone: true,
  imports: [CommonModule, TabMenuModule,
    TableComponent,
    TabViewModule,
    TranslateModule,
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
  templateUrl: './add-edit-product-catalog.component.html',
  styleUrl: './add-edit-product-catalog.component.scss',
})
export class AddEditProductCatalogComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  pageSize = 10;
  pageNumber = 1;
  classId!: number;
  items: MenuItem[] = [
    { label: 'All products' },
    { label: 'Selected' },
  ];
  activeItem!: MenuItem;
  tableConfig!: TableConfig;
  catalogFormGroup!: FormGroup;
  allProductsList: any[] = [];
  selectedProductsList: any[] = [];
  tempSelectedProductsList: any[] = [];
  searchControl: FormControl = new FormControl();
  keyword = "";

  constructor(private _fb: FormBuilder,
    private _catalog: CatalogService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _translate: TranslateService,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.classId = Number(this._route.snapshot.paramMap.get("id")) as number;
    this.prepareCatalogForm();
    this.getCatalogInfoByClassification();
    this.activateTab(this.items[0]);
    this.onSearch();
  }

  activateTab(item: MenuItem): void {
    this.activeItem = item;
    // Fetch data based on the tab label
    if (item.label === 'All products') {
      this.tableConfig = ProductSelectedTableConfig;
      this.getAllPaidProduct();
    } else if (item.label === 'Selected') {
      this.tableConfig = SelectedProductTableConfig;
      this.getAllFreeProduct();
    }
  }


  getAllPaidProduct(): void {
    this._catalog.getAllPaidProduct(this.classId, this.pageNumber, this.pageSize,this.keyword)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: ApiResponse<any>) => {
        // Process the response data
        const productsFromResponse = response.data.result.map(el => ({
          ...el,
          brandName: el.brand?.name,
          categoryName: el.category?.name,
        })) || [];
        console.log('tempSelectedProductsList', this.tempSelectedProductsList);
        if (this.activeItem?.label === 'All products') {
          // Combine the tempSelectedProductsList with productsFromResponse
          const combinedList = [...this.tempSelectedProductsList, ...productsFromResponse];

          // Remove duplicates based on productId
          const uniqueProducts = Array.from(new Map(combinedList.map(product => [product.productId, product])).values());

          // Update allProductsList with unique products
          this.allProductsList = uniqueProducts;

          // Update tableConfig for 'All products' tab
          this.tableConfig.rows = [...this.allProductsList];
          this.tableConfig.totalRecords = this.allProductsList.length;
        }
      });
  }




  getAllFreeProduct(): void {
    this._catalog.getAllFreeProduct(this.classId, this.pageNumber, 10000)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: ApiResponse<any>) => {
        const freeProducts = response.data.result.map((el) => ({
          ...el, // Spread the rest of the properties except productId
          brandName: el.brand?.name, // Optionally include brand name
          categoryName: el.category?.name, // Optionally include category name
        })) || [];
        // Combine with existing selected products and remove duplicates
        const updatedProductsList = [...this.selectedProductsList, ...freeProducts];
        const uniqueProducts = Array.from(new Map(updatedProductsList.map(product => [product.productId, product])).values());

        // Update the selectedProductsList
        this.selectedProductsList = uniqueProducts;

        // Check if we are on the 'Selected' tab and update tableConfig
        if (this.activeItem?.label === 'Selected') {
          this.tableConfig = { ...this.tableConfig, rows: [...this.selectedProductsList], totalRecords: this.selectedProductsList.length };
          console.log('Updated tableConfig rows:', this.tableConfig.rows);
        }
      });
  }


  private updateProductLists(sourceList: any[], targetList: any[], productId: number) {
    const index = sourceList.findIndex(product => product.productId === productId);
    if (index !== -1) {
      const [productToMove] = sourceList.splice(index, 1);
      targetList.unshift(productToMove);
    }
  }

  onActionClicked(ev: any): void {
    if (ev.action === 'ROW_SELECTED') {
      const selectedProduct = ev.data;
      if (this.activeItem?.label === 'All products') {
        this.updateProductLists(this.allProductsList, this.tempSelectedProductsList, selectedProduct.productId);
        this.selectedProductsList = [...this.tempSelectedProductsList];
        this.tableConfig.rows = [...this.allProductsList];
      } else if (this.activeItem?.label === 'Selected') {
        this.updateProductLists(this.selectedProductsList, this.tempSelectedProductsList, selectedProduct.productId);
        this.allProductsList = [...this.tempSelectedProductsList];
        this.tableConfig.rows = [...this.selectedProductsList];
        console.log('rows',this.allProductsList)
      }
      this.tableConfig.totalRecords = this.tableConfig?.rows?.length;
    }
  }


  onPageChange(event: PaginatorState): void {
    this.pageSize = event.rows || 10;
    this.pageNumber = event.page || 1;
    if (this.activeItem.label === 'All products') {
      this.getAllPaidProduct();
    }
  }

  prepareCatalogForm() {
    this.catalogFormGroup = this._fb.group(
      {
        id: [this.classId],
        catalogProductCount: [null, Validators.required],
        catalogProductCountPrice: [null, Validators.required]
      }
    )
  }

  getCatalogInfoByClassification() {
    this._catalog.getCatalogInfoByClassification(Number(this.classId)).subscribe((response: any) => {
      this.catalogFormGroup.patchValue(response.data);
    })
  }

  save() {
    const productIds = this.selectedProductsList.map(product => product.productId);
    let catalogDto = {
      classificationId: this.classId,
      productIds: productIds
    };
    this._catalog.editCatalogInfo(this.catalogFormGroup.value).pipe(
      switchMap(() => {
        return this._catalog.editProductCatalog(catalogDto);
      })).subscribe(() => {
        this._translate.get('GENERAL.ADDED_SUCCESSFULLY', { name: this._translate.instant('FIELDS.CATALOG') })
          .subscribe((msg: string) => this._toastr.success(msg));
        this.goBack();
      }
    );
  }

  onSearch() {
    this.searchControl.valueChanges.pipe(
      filter((k: string) => k.trim().length >= 0),
      debounceTime(400),
      switchMap(word => this._catalog.getAllPaidProduct(
        this.classId,
        this.pageSize,
        this.pageNumber,
        word.trim()
      ))
    ).subscribe((response:ApiResponse<UnitData>) => {
      if (response && response.data) {
        this.tableConfig = {
          ...ProductSelectedTableConfig,
          rows: response.data.result.map(el => ({
            ...el,
            brandName: el.brand?.name,
            categoryName: el.category?.name,
          })) || [],
          totalRecords: response.data.rowCount,
        };
      }
    });
  }
  goBack() {
    this._router.navigate(['/products/products-catalog']);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
