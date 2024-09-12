import { Injectable, Type } from "@angular/core";
import { DialogConfig } from "./dialog.config";

@Injectable({
    providedIn: 'root'
})
export class CustomDialogService {

    open(component: Type<any>, config: DialogConfig): void { }

}