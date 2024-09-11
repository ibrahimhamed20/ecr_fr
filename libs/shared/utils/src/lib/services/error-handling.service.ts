import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlingService {
    constructor(private _toastr: ToastrService) { }

    handleError(error: HttpErrorResponse) {
        const err = error?.error;
        switch (error.status) {
            case 400:
                err?.validationErrors?.forEach((msg: string) => this._toastr.error(msg));
                break;
            case 500:
                this._toastr.error('There is an error with status 500');
                break;
            case 403:
                this._toastr.error('There is an error with status 403');
                break;
            default:
                this._toastr.error('There is an unknown error');
                break;
        }
    }

}
