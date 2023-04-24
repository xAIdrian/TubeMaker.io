import { AbstractControl } from "@angular/forms";
import { Observable } from "rxjs/internal/Observable";
import { Observer } from "rxjs/internal/types";
import { of } from "rxjs/internal/observable/of";

export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    if (typeof(control.value) === 'string') {
        return of({})
    }
    
    const file = control.value as File;
    const fileReader = new FileReader();

    var isValid = false;

    const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
        fileReader.addEventListener("loadend", () => {
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
            }
            if (isValid) {
                observer.next({});
            } else {
                observer.next({ invalidMimeType: true });
            }
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
        
    });
    return frObs
}