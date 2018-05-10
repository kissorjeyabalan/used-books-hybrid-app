import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SellBookPage} from './sellbook';
import {TextMaskModule} from 'angular2-text-mask';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    SellBookPage
  ],
  imports: [
    IonicPageModule.forChild(SellBookPage),
    TextMaskModule,
    [RoundProgressModule]
  ]
})

export class SellBookPageModule {}
