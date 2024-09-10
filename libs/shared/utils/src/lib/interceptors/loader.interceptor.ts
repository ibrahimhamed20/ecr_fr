import { inject } from "@angular/core";
import { finalize } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpInterceptorFn } from "@angular/common/http";


export const LoaderInterceptorFn: HttpInterceptorFn = (req, next) => {
    let count = 0;

    const _spinner = inject(NgxSpinnerService);
    // const skipLoader = req.headers.get('skipLoader') as 'yes' | 'no';

    // if (skipLoader === 'yes') return next(req);

    _spinner.show();
    count++;

    return next(req).pipe(
        finalize(() => {
            count--;
            count === 0 && _spinner.hide();
        })
    );


}