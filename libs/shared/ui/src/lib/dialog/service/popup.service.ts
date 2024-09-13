import { PopupConfig } from "../config/popup.config";
import { Injectable, Type } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    open(component: Type<any>, config: PopupConfig): { afterClosed: Observable<any> } { return { afterClosed: of(null) } }

    getData<T>(): T { return <T>{} }

    close(data?: any) { }
}