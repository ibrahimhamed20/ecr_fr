import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponent, TableConfig } from '@shared-ui';
import { TabViewModule } from 'primeng/tabview';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CatalogService } from '../../services/catalog.service';
import { ApiResponse, UnitData } from '@admin-features/products/interfaces/products.interface';
import { Subject, takeUntil } from 'rxjs';
import { CatalogTableConfig, ProductSelectedTableConfig, SelectedProductTableConfig } from '../../catalog.config';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-add-edit-product-catalog',
  standalone: true,
  imports: [CommonModule,TabMenuModule,
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
export class AddEditProductCatalogComponent implements OnInit , OnDestroy{
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  pageSize = 10;
  pageNumber = 1;
  classId!:number;
  items: MenuItem[] = [
    { label: 'All products' },
    { label: 'Selected' },
  ];
  activeItem!: MenuItem;
  tableConfig!: TableConfig;
  catalogFormGroup!: FormGroup

  constructor(private _fb:FormBuilder,
    private _catalog:CatalogService,
    private _route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.classId = Number(this._route.snapshot.paramMap.get("id")) as number;
    this.prepareCatalogForm();
    this.activateTab(this.items[0]);
  }
  selectedProducts: any[] = [];  // Local variable to track selected products

  activateTab(item: MenuItem) {
    this.activeItem = item;
    if (item.label == 'All products') {
      this.tableConfig = ProductSelectedTableConfig;
      this.getAllPaidProduct();
    } else if (item.label == 'Selected') {
      this.tableConfig = SelectedProductTableConfig;
          // Ensure that the tableConfig reflects the current state of selected products
    this.tableConfig = {
      ...SelectedProductTableConfig,
      rows: [...this.selectedProducts]
    };

    }
  }
  onActionClicked(ev: any) {
    let data = ev.data;

    const exists = this.selectedProducts.some((row: any) => row.id === data.id);

    if (!exists) {
      this.selectedProducts.push(data);
    }

    if (this.activeItem && this.activeItem.label === 'Selected') {
      this.tableConfig = {
        ...SelectedProductTableConfig,
        rows: [...this.selectedProducts]
      };
    }

    console.log(this.selectedProducts); // For debugging purposes
  }


  prepareCatalogForm() {
    this.catalogFormGroup = this._fb.group(
      {
        id: [null],
        catalogProductCount: [null, Validators.required],
        catalogProductCountPrice: [null, Validators.required]
      }
    )
  }


  getAllPaidProduct(): void {
    this._catalog.getAllPaidProduct(this.classId,this.pageNumber,this.pageSize)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: ApiResponse<any>) => {
        console.log('response.data.result',response.data.result)
        this.tableConfig.rows = response.data.result.map(el => ({
          ...el,
          brandName: el.brand?.name,
          categoryName: el.category?.name,

        })) || [];
        this.tableConfig.totalRecords = response.data.rowCount;
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
