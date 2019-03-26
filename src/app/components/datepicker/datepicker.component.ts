import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgSwitch} from '@angular/common';
import {DatepickerService} from './datepicker.service';
import {DatepickerLanguage} from './datepicker-language';

// import Date from ''

@Component({
    selector: 'app-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
    providers: [DatepickerLanguage, NgSwitch]
})


export class DatePickerComponent implements OnInit {



    dateSettings: {
        startDate: Date,
        minDate: Date,
        maxDate: Date,
        selectedDate: Date,
        today: Date
    } = {
        startDate: new Date(),
        minDate: new Date(1,1 ,1),
        maxDate: new Date(3000, 1, 1),
        selectedDate: new Date(),
        today: new Date()
    };

    public mustBlock = {
        prevMonth: false,
        nextMonth: false,
        prevYear: false,
        nextYear: false
    };

    public monthData: {
        first: Date,
        isYear: number
        isMonth: number,
        isDay: number,
        days: Array<number>,
        daysBefore: Array<number>
        daysAfter: Array<number>
        prevMonthDays: number
    } = {
        first: new Date(),
        isMonth: 0,
        isYear: 0,
        isDay: 0,
        days: [0],
        daysBefore: [],
        daysAfter: [],
        prevMonthDays: 0,
    };

    public showCalendar: boolean;


    @Input() startDate: Date | string;
    @Input() maxDate: Date | string;
    @Input() minDate: Date | string;
    @Input() datepickerId: string;
    @Input() seperatedControls = false;
    @Input() language = 'de';

    @Output() selectedDate: EventEmitter<object> = new EventEmitter;

    constructor(public languageData: DatepickerLanguage,
                private datepickerService: DatepickerService) {
        this.datepickerService.registerDatepicker(this);
    }

    ngOnInit() {
        this.checkInputData();
        this.emitAndRefresh();
        this.checkBlocking(this.dateSettings.startDate);
        this.onToggleCalendar();
        console.log(this.seperatedControls);
    }

    /**
     * checks if input data is given and will initiate the correct parsing
     */
    private checkInputData(): void {
        if (this.startDate === undefined) {
            this.startDate = new Date();
        }
        this.dateSettings.selectedDate = this.dateSettings.startDate = this.parseDate(this.startDate);

        if (this.maxDate) {
            this.dateSettings.maxDate = this.parseDate(this.maxDate);
        }
        if (this.minDate) {
            this.dateSettings.minDate = this.parseDate(this.minDate);
        }
    }

    /**
     * checks the type of given Date and parses the date if it is type of string
     * @param date
     * @return Date
     */
    private parseDate(date: Date | string): Date {
        if (typeof date === 'string') {
            return new Date(Date.parse(date));
        }
        return date;
    }

    /**
     * function creates an Array of all days according to given Month
     * calls This.hasMissingDays()
     * @param date
     */
    private getMonthData(date: Date): void {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const amount = this.getDaysInMonth(year, month);

        this.monthData.days = [];
        for (let i = 0; i < amount; i++) {
            this.monthData.days.push(i + 1);
        }

        this.monthData.isDay = day;
        this.monthData.isMonth = month;
        this.monthData.isYear = year;
        this.monthData.first = new Date(year, month, 1);
        this.hasMissingDays();
    }

    /**
     * Returns the number of days in searched month
     * @param year
     * @param month
     * @return number
     */
    private getDaysInMonth(year: number, month: number): number {
        return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    /***
     * checks if the given Year is a leap year
     * @param year
     * @return boolean
     */
    private isLeapYear(year: number): boolean {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    /**
     * checks if current month is starting or ending midweek and get amount of days to fill the week row
     */
    private hasMissingDays(): void {
        const weekstart = this.languageData.DATA[this.language].weekStart;
        const weekday = this.monthData.first.getDay();
        this.getDaysBefore(weekstart, weekday);

        this.getDaysAfter();
    }

    /**
     * get the starting day of the week due to local differences and will check how many
     * days are needed to fill the first week row
     * @param weekstart
     * @param weekday
     */
    private getDaysBefore(weekstart: number, weekday: number): void {
        this.monthData.daysBefore = [];
        if (weekstart === 2) {
            weekday += 1;
        }
        let days = weekday - 1;
        const monthDaysAmount = this.getDaysInMonth(this.monthData.isYear, this.monthData.isMonth - 1);

        for (days; days >= 1; --days) {
            this.monthData.daysBefore.push(monthDaysAmount - days + 1);
        }
    }

    /**
     * Checks if the month ended on the last of week or will set how many days are missing to fill
     * the week row
     */
    private getDaysAfter(): void {
        this.monthData.daysAfter = [];
        let daysAfter = 7 - (this.monthData.days.length + this.monthData.daysBefore.length) % 7;

        if (daysAfter === 7) {
            return;
        }
        for (let i = 1; i <= daysAfter; i++) {
            this.monthData.daysAfter.push(i);
        }

    }

    /**
     * toggles the view for the calendar, datepicker is always visible
     */
    public onToggleCalendar(): void {
        this.showCalendar = !this.showCalendar;
    }

    public onPrevMonth(): void {
        if (!this.mustBlock.prevMonth) {
            this.monthData.isMonth -= 1;

            if (this.monthData.isMonth === 0) {
                this.monthData.isMonth = 12;
            }

            let prevMonth = new Date(this.monthData.isYear, this.monthData.isMonth, this.monthData.isDay)
            this.checkBlocking(prevMonth);
        }
    }

    public onNextMonth(): void {
        if (!this.mustBlock.nextMonth) {
            this.monthData.isMonth += 1;
            if (this.monthData.isMonth > 12) {
                this.monthData.isMonth = 1;
            }
            let nextMonth = new Date(this.monthData.isYear, this.monthData.isMonth, this.monthData.isDay);
            this.checkBlocking(nextMonth);
        }
    }

    public onPrevYear(): void {
        if (this.monthData.isYear > this.dateSettings.minDate.getFullYear() ||
            this.dateSettings.minDate.getFullYear() === undefined) {

            this.monthData.isYear -= 1;
            this.getMonthData(new Date(this.monthData.isYear, this.monthData.isMonth, this.monthData.isDay));
            this.checkBlocking(this.monthData.first)
        }

    }

    public onNextYear(): void {
        console.log(this.dateSettings.maxDate.getFullYear());
        if (this.monthData.isYear < this.dateSettings.maxDate.getFullYear()
            || this.dateSettings.maxDate.getFullYear() === undefined) {
            this.monthData.isYear += 1;
            this.getMonthData(new Date(this.monthData.isYear, this.monthData.isMonth, this.monthData.isDay));
            this.checkBlocking(this.monthData.first)
        }
    }

    /**
     * emits the clicked value, after creating a new Date
     * refreshes the calendar afterwards
     * @param day
     */
    public onDateClick(day: number): void {
        this.dateSettings.selectedDate = new Date(this.monthData.isYear, this.monthData.isMonth, day);
        this.emitAndRefresh();
    }

    public onToday(): void {
        this.dateSettings.selectedDate = this.dateSettings.today;
        this.emitAndRefresh();
    }

    private emitAndRefresh(): void {
        this.selectedDate.emit(this.dateSettings.selectedDate);
        this.getMonthData(this.dateSettings.selectedDate);
        this.onToggleCalendar();
    }

    /**
     * @param language : string
     */
    public setLanguage(language: string): void {
        this.language = language;
    }

    /**
     * @param date : Date | string
     */
    public setMaxDate(date: Date | string): void {
        this.dateSettings.maxDate = this.parseDate(this.maxDate);
    }

    /**
     * @param date : Date | string
     */
    public setMinDate(date: Date | string): void {
        this.dateSettings.minDate = this.parseDate(this.minDate);
    }

    /**
     * @param date : Date | string
     */
    public setStartDate(date: Date | string): void {
        this.dateSettings.startDate = this.parseDate(this.startDate);
    }

    /**
     * checks if the given day is today
     * @param day : number
     */
    public isToday(day: number): boolean {
        const date = new Date(this.monthData.isYear, this.monthData.isMonth, day);
        return date.getFullYear() === this.dateSettings.today.getFullYear() &&
            date.getMonth() === this.dateSettings.today.getMonth() &&
            date.getDate() === this.dateSettings.today.getDate();
    }

    /***
     * checks if the day is in the range of allowed clickable Dates
     * @param day : number
     * @param month : number
     * @return boolean
     */
    public isDisabled(day: number, month: number): boolean {
        let year = this.monthData.isYear;
        if (month < 0) {
            month = 11;
            year -= 1;
        }
        if (month > 11) {
            month = 0;
            year += 1;
        }
        const date = new Date(year, month, day);

        if (this.minDate !== undefined && this.maxDate !== undefined) {
            return (date < this.dateSettings.minDate || date > this.dateSettings.maxDate);
        }
        return false;

    }


    public isActive(day: number): boolean {
        const date = new Date(this.monthData.isYear, this.monthData.isMonth, day);
        return date.getFullYear() === this.dateSettings.selectedDate.getFullYear() &&
            date.getMonth() === this.dateSettings.selectedDate.getMonth() &&
            date.getDate() === this.dateSettings.selectedDate.getDate();
    }


    public checkBlocking(date: Date): void {
        let month = date.getMonth();
        let year = date.getFullYear();

        console.log(this.dateSettings);
        if (this.dateSettings.minDate !== undefined) {
            this.mustBlock.prevMonth = (this.dateSettings.minDate.getMonth() >= month);
            this.mustBlock.prevYear = (this.dateSettings.minDate.getFullYear() >= date.getFullYear());
        }

        if (this.dateSettings.maxDate !== undefined) {
            this.mustBlock.nextMonth = (month >= this.dateSettings.maxDate.getMonth());
            this.mustBlock.nextYear = (year >= this.dateSettings.maxDate.getFullYear());
        }


        console.log(this.mustBlock);

    }

}
