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

        // Calculate the difference between the given date and the current date
        const daysDiff = now.diff(date, 'days');

        if (daysDiff === 0) {
            // Today
            return `${date.format('h:mm A')}`; // Correct usage of moment.format
        } else if (daysDiff === 1) {
            // Yesterday
            return `Yesterday at ${date.format('h:mm A')}`; // Correct usage of moment.format
        } else if (daysDiff < 7) {
            // Within the last week
            return `${date.format('dddd, D/M/YY h:mm A')}`; // Day, Date, and Time in 12-hour format
        } else {
            // Older than a week
            return date.format('D/M/YY'); // Correct usage of moment.format
        }
    }

}
