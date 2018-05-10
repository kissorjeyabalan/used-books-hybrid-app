import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InboxPage} from './inbox';

@NgModule({
  declarations: [
    InboxPage
  ],
  imports: [
    IonicPageModule.forChild(InboxPage)
  ]
})

export class InboxPageModule {}
