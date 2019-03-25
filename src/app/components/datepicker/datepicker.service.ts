import {
    Injectable
} from '@angular/core';
import {
    DatePickerComponent
} from './datepicker.component';


/**
 * DatepickerService - Service used to interact with the Datepicker Component
 */
@Injectable()

export class DatepickerService {
    private datepickers: Array<DatePickerComponent>;

    constructor() {
        this.datepickers = [];
    }

    /**
     * registerDatepicker - Registers all Datepicker components being used on initialization
     * @param { Object } newDatepicker The new Datepicker to add to the array of available Datepickers
     */
    public registerDatepicker(newDatepicker: DatePickerComponent): void {
        const Datepicker = this.findDatepicker(newDatepicker.datepickerId);
        if (Datepicker) {
            this.datepickers.splice(this.datepickers.indexOf(Datepicker), 1);
        }

        this.datepickers.push(newDatepicker);
    }

    /**
     * findDatepicker - Locates the specified Datepicker in the Datepickers array
     * @param { String } datepickerId The id of the Datepicker to find
     */
    private findDatepicker(datepickerID: string): DatePickerComponent {
        return this.datepickers.find((datepicker) => {
            return datepicker.datepickerId === datepickerID;
        });
    }

    /**
     * getDatepickers - Returns every registered Datepicker
     */
    public getDatepickers(): Object {
        return this.datepickers;
    }

    /**
     * Set the datepickers start date to the given input
     * @param datepickerId - Id of the datepicker which attributes should be changed
     * @param date {Date | String} either a Date Object or a string has to be given, string Date has to be formatted "yyyy-mm-dd"
     */
    public setStartDate(datepickerId: string, date: Date | string): void {
        const datepicker = this.findDatepicker(datepickerId);
        datepicker.setStartDate(date);
    }

    /**
     * Set the datepickers minimal date, which should not be fallen below, to the given input
     * @param datepickerId - Id of the datepicker which attributes should be changed
     * @param date {Date | String} either a Date Object or a string has to be given, string Date has to be formatted "yyyy-mm-dd"
     */

    public setMinDate(datepickerId: string, date: Date | string): void {
        const datepicker = this.findDatepicker(datepickerId);
        datepicker.setMinDate(date);
    }


    /**
     * Set the datepickers maximal date, which should not be overrun, to the given input
     * @param datepickerId - Id of the datepicker which attributes should be changed
     * @param date {Date | String} either a Date Object or a string has to be given, string Date has to be formatted "yyyy-mm-dd"
     */
    public setMaxDate(datepickerId: string, date: Date | string): void {
        const datepicker = this.findDatepicker(datepickerId);
        if (datepicker) {
            datepicker.setMaxDate(date);
        }

    }

    /**
     * Set the shown names to the given language
     * @param datepickerId {string}- Id of the datepicker which attributes should be changed
     * @param lang {string} - the desired language
     */
    public setLanguage(datepickerId: string, lang: string): void {
        const found = this.findDatepicker(datepickerId);

        if (found) {
            found.setLanguage(lang);
        }
    }

}
