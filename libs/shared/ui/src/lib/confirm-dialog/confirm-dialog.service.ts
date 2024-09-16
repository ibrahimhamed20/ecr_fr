import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    confirm(type: 'delete' | 'warn' | 'confirm' | 'approve' | 'reject'): Observable<boolean> { return of(false); }
}