import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';
import { PopupService } from '@shared-ui';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '@admin-features/products/services/products.service';
import { ProductData } from '@admin-features/products/interfaces';
import { RippleModule } from 'primeng/ripple';
import { ImageModule } from 'primeng/image'
import { FormsModule } from '@angular/forms';

const PRIMNG_MODULES = [
  TableModule, ToggleButtonModule, InputSwitchModule, ButtonModule, DividerModule, RippleModule, ImageModule
]

@Component({
  selector: 'admin-product-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ...PRIMNG_MODULES],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  active: boolean = false;
  products = [];
  productsDetail: any;
  productData!: ProductData;

  constructor(
    private _popup: PopupService,
    private _product: ProductsService) { }

  ngOnInit(): void {
    this.productsDetail = this._popup.getData<any>();
    this.getProductDetails();
  }

  private getProductDetails() {
    this._product.getProductById(this.productsDetail.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.productData = res.data;
      })
  }

  _close = () => this._popup.close();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
