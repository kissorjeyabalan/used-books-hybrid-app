import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AdvertPage} from './advert';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AdvertPage
  ],
  imports: [
    IonicPageModule.forChild(AdvertPage),
    PipesModule
  ]
})

export class AdvertPageModule {}
