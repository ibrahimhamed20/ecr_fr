import { CommonModule } from "@angular/common";
import { BreadcrumbComponent, StepperComponent } from "@shared-ui";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { BasicInfoComponent } from "./basic-info/basic-info.component";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { ProductImagesComponent } from "./product-images/product-images.component";
import { ProductTreeComponent } from "./product-tree/product-tree.component";


export const PRODUCT_FORM_IMPORTS = [
    // modules
    CommonModule,
    MultiSelectModule,
    CalendarModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    // components
    BasicInfoComponent,
    ProductImagesComponent,
    ProductTreeComponent,
    BreadcrumbComponent,
    StepperComponent
];


export const BREADCRUMB_ITEMS = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'product Management' },
    { label: 'product' },
    { label: 'Add New product', route: location.pathname }
];


// export * from './branch-step/branch-step.component';
// export * from './store-info-step/store-info-step.component';
// export * from './owner-details-step/owner-details-step.component';

export * from './basic-info/basic-info.component'