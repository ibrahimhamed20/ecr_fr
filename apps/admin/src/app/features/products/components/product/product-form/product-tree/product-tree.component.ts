import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormHelper } from '@shared-utils';
import { DropdownModule } from 'primeng/dropdown';
import { ProductsService } from '@admin-features/products/services/products.service';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'admin-product-tree',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextareaModule

   ],  templateUrl: './product-tree.component.html',
  styles: ``,
})
export class ProductTreeComponent  implements OnInit{

  @Input() form!: FormGroup;
  @Input() formError!: FormHelper.ErrorManagement;
  category:any;
  tags:any;

  dropdownItems = [
    { name: 'Option 1', code: 'option1' },
    { name: 'Option 2', code: 'option2' },
    { name: 'Option 3', code: 'option3' },
  ];
  constructor(private _productService:ProductsService ){

  }

  ngOnInit(): void {
    this.getCategory()
    this. getTags()
  }

  getCategory(){
    this._productService.getCategories().subscribe({
      next:(res:any)=>{
      this.category = res.data.result;
      }
    })
  }
  getTags(){
    this._productService.getTags().subscribe({
      next:(res:any)=>{
      this.tags = res.data.result;
      }
    })
  }

}
