import {
    Component,
    OnInit,
    Output,
    Input,
    EventEmitter,
} from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
    /**
     * data: must be type of number or Array
     * Specifices number of paginationPositon elments
     */
    @Input() data: number | Array<any>;
    @Input() blockAllNextButton = false;
    @Input() previousButtonText = '<';
    @Input() nextButtonText = '>';
    @Input() previousSkipButtonText = '<<';
    @Input() nextSkipButtonText = '>>';
    @Input() position: string;
    @Input() size: string;
    @Input() rounded: boolean;
    @Input() hasSkipButtons: boolean;
    @Input() skippingRange: number | Array<number>;

    /**
     * indicates the number of pages to be viewed
     * has to be an odd number otherwise the next bigger odd number will be set as range size
     */
    @Input() range = 3;

    rangeStart: number;
    rangeEnd: number;
    step: number;
    isPrevButtonDisabled: boolean;
    isNextButtonDisabled: boolean;
    currentPage = 0;
    pages: number;
    skipSteps: Array<number> = [];
    blockedPage: number;


    /**
     * emits selected page index
     */
    @Output() selectedPage: EventEmitter<number> = new EventEmitter;


    constructor() {

    }

    ngOnInit() {
        this.checkInputData();
        this.rangeStartandEnd();
    }

    private checkInputData() {
        this.pages = typeof this.data !== 'number' ? this.data.length : this.data;
        this.skipSteps = [];
        this.blockedPage = (typeof this.blockedPage !== undefined) ? this.pages - 1 : this.blockedPage;
        this.step = Math.round((this.range - 1) / 2);

        if (typeof this.skippingRange === 'undefined') {
            this.skippingRange = this.range;
        }

        if (typeof this.skippingRange === 'number') {
            this.skipSteps.push(this.skippingRange);
        } else {
            this.skippingRange.forEach(range => {
                this.skipSteps.push(range);
            });
        }
    }

    /**
     * increments the currentPage by 1, stops at pages - 1
     */
    public onNextButton(): void {
        this.currentPage = (this.currentPage < this.pages - 1) ? this.currentPage += 1 : this.currentPage;
        this.emitSelectedPage();
    }

    /**
     *  decrements the currentPage by 1, stops at 0
     */
    public onPreviousButton(): void {
        this.currentPage = (this.currentPage >= 0) ? this.currentPage -= 1 : this.currentPage;
        this.emitSelectedPage();
    }

    /**
     * will increment the currentPage by the given value , stops at pages-1
     * @param value :  button value
     */
    public onSkipNextButton(value: number): void {
        this.currentPage += value;
        this.currentPage = (this.currentPage >= this.pages - 1) ? this.pages - 1 : this.currentPage;
        this.emitSelectedPage();
    }

    /**
     * will decrement the currentPage by , stops at 0
     * @param value :  button value
     */
    public onSkipPreviousButton(value: number): void {
        this.currentPage -= value;
        this.currentPage = (this.currentPage < 0) ? 0 : this.currentPage;
        this.emitSelectedPage();
    }

    /**
     * will set the currentPage to the clicked value
     * @param page clicked button value
     */
    public onPageSelect(page: number): void {
        if (!this.blockAllNextButton) {
            this.currentPage = page;
        } else {
            this.currentPage = (page < this.blockedPage) ? page : this.blockedPage;
        }
        this.emitSelectedPage();
    }

    /**
     * emits the current selected page
     */
    private emitSelectedPage(): void {
        this.selectedPage.emit(this.currentPage + 1);
        this.rangeStartandEnd();
    }

    /**
     *   determines the value of rangeStart and rangeEnd by the given range
     */
    private rangeStartandEnd(): void {
        this.rangeStart = this.currentPage - this.step;
        this.rangeEnd = this.currentPage + this.step;

        if (this.currentPage >= 0 && this.currentPage < (this.range - this.step)) {
            this.rangeStart = 0;
            this.rangeEnd = this.range - 1;
        }

        if (this.currentPage >= (this.pages - 1) - this.step) {
            this.rangeStart = (this.pages) - this.range;
            this.rangeEnd = this.pages - 1;
        }
        this.hasButtonsToBeBlocked();
    }

    /**
     * checks if the buttons have to be blocked, when reaching one of the paginationPositon ends
     */
    private hasButtonsToBeBlocked(): void {
        this.isPrevButtonDisabled = (this.currentPage === 0);
        if (!this.blockAllNextButton) {
            this.isNextButtonDisabled = (this.currentPage === this.pages - 1);
            return;
        }
        this.isNextButtonDisabled = true;
    }
}
