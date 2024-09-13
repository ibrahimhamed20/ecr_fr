import { Injectable, Type } from "@angular/core";
import { DialogConfig } from "./dialog.config";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CustomDialogService {

    open(component: Type<any>, config: DialogConfig): { afterClosed: Observable<any> } { return { afterClosed: of(null) } }

    getData<T>(): T { return <T>{} }

    close(data?: any) { }
}