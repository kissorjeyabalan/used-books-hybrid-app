import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {StripEmail} from './strip-email-pipe';

@NgModule({
  declarations: [
    StripEmail
  ],
  imports: [],
  exports: [
    StripEmail
  ]
})

export class PipesModule {}
