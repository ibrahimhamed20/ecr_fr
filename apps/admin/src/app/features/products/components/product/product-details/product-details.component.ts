import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'admin-product-details',
  standalone: true,
  
  imports: [CommonModule, TableModule, ToggleButtonModule,InputSwitchModule,ButtonModule,TranslateModule,DividerModule],
  templateUrl: './product-details.component.html',
  styles: ``,
})
export class ProductDetailsComponent implements OnInit {
  products =[]
  productsDetail :any 
  private destroy$: Subject<void> = new Subject<void>();
  productData !:  ProductData 

  constructor( private _popup:PopupService ,private _product :ProductsService) {

  }
  ngOnInit(): void {
    this.productsDetail  = this._popup.getData<any>();
    this.getProductDetails();
  
  }
  private getProductDetails() {
    this._product.getProductById(this.productsDetail.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res:any) => {
        this.productData = res.data;
      })
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
