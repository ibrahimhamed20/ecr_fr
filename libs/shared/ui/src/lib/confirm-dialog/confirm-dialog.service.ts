import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    confirm(type: 'delete' | 'warn' | 'confirm'|'Approve'|'Reject'): Observable<boolean> { return of(false); }
}