import { CommonModule } from "@angular/common";
import { BreadcrumbComponent, StepperComponent } from "@shared-ui";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { BranchStepComponent } from "./branch-step/branch-step.component";
import { OwnerDetailsStepComponent } from "./owner-details-step/owner-details-step.component";
import { StoreInfoStepComponent } from "./store-info-step/store-info-step.component";

export const STORES_FORM_IMPORTS = [
    // modules
    CommonModule,
    MultiSelectModule,
    CalendarModule,
    ButtonModule,
    // components
    BreadcrumbComponent,
    OwnerDetailsStepComponent,
    StoreInfoStepComponent,
    BranchStepComponent,
    StepperComponent
];


export const BREADCRUMB_ITEMS = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Stores Management' },
    { label: 'Stores' },
    { label: 'Add New Store', route: location.pathname }
];


export * from './branch-step/branch-step.component';
export * from './store-info-step/store-info-step.component';
export * from './owner-details-step/owner-details-step.component';