import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

@Pipe({
    name: 'cpDate'
})
export class CpDatePipe implements PipeTransform {

    constructor(private translate: TranslateService) {
    }

    public transform(value: any, format?: string, timezone?: string, locale?: string): string | null {
        const ngPipe = new DatePipe(this.translate.currentLang);
        return ngPipe.transform(value, format, timezone, locale);
    }
}
