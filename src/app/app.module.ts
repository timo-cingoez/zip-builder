import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {AppComponent} from './app.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {FormsModule} from "@angular/forms";
import {ConfigService} from "../services/config.service";
import { CommitListEntryComponent } from './commit-list-entry/commit-list-entry.component';

export function initializeApp(configService: ConfigService) {
  return () => configService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    CommitListEntryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ScrollingModule,
    FormsModule
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
