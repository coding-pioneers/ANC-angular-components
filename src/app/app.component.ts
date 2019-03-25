import {
    Component,
    OnInit
} from '@angular/core';
import {
    AppService
} from './app.service';
import {
    DatepickerService
} from './components/datepicker/datepicker.service';
import {
    TranslateService
} from '@ngx-translate/core';


@Component({
    selector: 'cp-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    minDate = new Date(2019,2,8);
    maxDate = new Date (2019,8,18);

    constructor(private service: AppService,
                private calendarService: DatepickerService,
                translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

    ngOnInit() {

    }
}
