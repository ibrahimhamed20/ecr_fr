import { MerchantProductsService } from '@admin-features/products/services/merchant-products-services.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, filter, Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

const PRIMENG_MODULES = [
  TableModule,
  ButtonModule,
  CheckboxModule,
  PaginatorModule,
  IconFieldModule,
  InputIconModule,
  InputTextModule
];

@Component({
  selector: 'admin-link-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './link-products.component.html',
})
export class LinkProductsComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  searchControl: FormControl = new FormControl();

  merchantProducts: any[] = [];
  products: any[] = [];

  constructor(
    private _router: Router,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private _merchantProducts: MerchantProductsService) { }


  ngOnInit(): void {
    const productId = +this.activatedRoute.snapshot.params['id'];
    this.getMerchantProductbyId(productId);

    this.onProductsSearch();
  }

  getMerchantProductbyId(id: number) {
    this._merchantProducts.getMerchantProductById(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => this.merchantProducts = res.data || []);
  }

  onProductsSearch() {
    this.searchControl.valueChanges.pipe(
      filter((keyword: string) => keyword.trim().length > 0),
      debounceTime(400),
      switchMap((keyword) => this._merchantProducts.searchForMerchantProduct(keyword.trim())),
      takeUntil(this._unsubscribeAll)
    ).subscribe(res => {
      this.products = res.data || [];
    });
  }


  save() {
    const productsToCatalogs: { productId: number; merchantProductId: number }[] = [{
      productId: this.products.find(el => el.checked).id,
      merchantProductId: this.merchantProducts.find(el => el.checked).id
    }];
    this._merchantProducts.linkProducts({ productsToCatalogs })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.toaster.success('Products linked successfully');
        this._back();
      });
  }

  get disabledProducts(): boolean {
    return this.merchantProducts.some(el => el.checked) && this.products.some(el => el.checked);
  }

  clear() {
    this.merchantProducts.forEach(el => el.checked = false);
    this.products.forEach(el => el.checked = false);
  }

  _back = () => this._router.navigate(['/products/merchant']);

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
