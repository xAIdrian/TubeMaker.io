import { Injectable } from '@angular/core';
import { formatDistance } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class HumaneDateUtility {
  constructor() {
    /** */
  }
  updateDateToHumanForm(isoDate: string): string {
    let date: Date;
    if (isoDate === null || isoDate === undefined || isoDate === '') {
      date = new Date();
    } else {
      date = new Date(isoDate);
    }
    return formatDistance(date, new Date(), { addSuffix: true });
  }
}
