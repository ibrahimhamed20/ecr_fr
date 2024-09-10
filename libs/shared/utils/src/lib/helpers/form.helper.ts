import { FormGroup } from "@angular/forms";

export namespace FormHelper {

    export class ErrorManagement {
        constructor(private _form: FormGroup) { }

        /**
         * check if input has an error or not
         * @param key form control name
         * @returns boolean
         */
        hasError(key: string): boolean {
            const formControl = this._form.get(key);
            return (formControl?.invalid && (formControl.dirty || formControl.touched) && formControl.errors) as boolean;
        }

        /**
         * check if input has specific error 
         * @param key form control name
         * @param errorName error key name
         * @returns boolean
         */
        hasSpecificError(key: string, errorName: string) {
            return this.hasError(key) && this._form.get(key)?.errors?.[errorName];
        }

        /**
         * set value and update form value and validity when paste any text
         * @param event input event
         * @param formkey form control name
         */
        onPaste(event: any, formkey: string) {
            const text = (event.originalEvent || event).clipboardData.getData('text/plain');
            this._form.get(formkey)?.setValue(text);
            setTimeout(() => {
                if (this._form.get(formkey)?.invalid) this._form.get(formkey)?.updateValueAndValidity();
            }, 100);
            event.preventDefault();
        }

    }

    export function removeNestedNullUndefined(obj: any) {
        for (const key in obj) {
            if (!obj[key]) delete obj[key];
            else if (typeof obj[key] === 'object') {
                const data = removeNestedNullUndefined(obj[key]);
                !Object.keys(data).length && delete obj[key];
            }
        }

        return obj;
    }

}