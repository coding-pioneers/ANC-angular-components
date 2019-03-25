import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';


import {AppComponent} from './app.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppService} from './app.service';
import {CpDatePipe} from './helpers/pipes/cp-date.pipe';
import {CpIterablePipe} from './helpers/pipes/cp-iterable-pipe';
import {DatepickerService} from './components/datepicker/datepicker.service';
import {DatePickerComponent} from './components/datepicker/datepicker.component';
import {PaginationComponent} from './components/pagination/pagination.component';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        CpDatePipe,
        CpIterablePipe,
        DatePickerComponent,
        PaginationComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        AppService,
        DatepickerService,
        CpIterablePipe,
        CpDatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
