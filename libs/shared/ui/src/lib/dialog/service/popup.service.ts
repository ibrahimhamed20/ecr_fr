import { PopupConfig, PopupConfigIntialData } from "../config/popup.config";
import { Injectable, Type } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    open(component: Type<any>, config: PopupConfig): { afterClosed: Observable<any> } { return { afterClosed: of(PopupConfigIntialData) } }

    getData<T>(): T { return <T>{} }

    close(data?: any) { }
}