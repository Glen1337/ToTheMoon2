/* eslint-disable no-param-reassign */
import { Injectable } from "@angular/core";
import { formatDate } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DateConverter {

    public ConvertDateTime(date?: Date): string {
        return date ? new Date(date).toLocaleString() : '';
    }

    public ConvertDateRemoveTime(date?: Date): string {
        return date ? new Date(date).toLocaleDateString() : '';
    }

    public GetMonthAndDay(inputDate: Date): string {
        let date = new Date(inputDate);
        let month = date?.getMonth() + 1;
        let day = date?.getDate();
        return `${month}/${day}`;
    }

    public formatDate(input: any): string {
        //remove these ifs?
        if (!input) {
            return '';
        }
        if (typeof input === typeof Date) {
            input = input.toLocaleString('');
        }
        //let tempDate: Date = new Date(input);
        //return `${tempDate.getUTCMonth()+1}/${tempDate.getUTCDate()}/${tempDate.getUTCFullYear()}`
        return formatDate(input, 'MM/dd/yyyy', 'en-US', 'UTC')
        // return formatDate(date , 'MM/dd/yyyy hh:mm aa', 'en-US', 'UTC');
    }

}
