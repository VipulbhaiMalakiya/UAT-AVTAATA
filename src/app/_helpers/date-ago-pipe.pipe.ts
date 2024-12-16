import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
    name: 'dateAgo',
    pure: true
})
export class DateAgoPipePipe implements PipeTransform {

    transform(value: any): any {
        const date = moment(value).tz('Asia/Kolkata'); // Adjust to Indian Standard Time
        const now = moment().tz('Asia/Kolkata'); // Get the current time in IST

        // Strip time components for accurate "yesterday" comparison
        const today = now.clone().startOf('day');
        const yesterday = today.clone().subtract(1, 'days');

        // Calculate the difference between the given date and the current date
        if (date.isSame(today, 'day')) {
            // Today
            return `${date.format('h:mm A')}`; // Correct usage of moment.format
        } else if (date.isSame(yesterday, 'day')) {
            // Yesterday
            return `Yesterday ${date.format('h:mm A')}`; // Correct usage of moment.format
        } else if (now.diff(date, 'days') < 7) {
            // Within the last week
            return `${date.format('D/M/YY h:mm A')}`; // Day, Date, and Time in 12-hour format
        } else {
            // Older than a week
            return date.format('D/M/YY h:mm A'); // Correct usage of moment.format
        }
    }



}
