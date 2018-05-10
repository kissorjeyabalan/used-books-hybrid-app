import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {AngularFireModule} from 'angularfire2';
import {firebaseConfig} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {HttpClientModule} from '@angular/common/http';
import {Geolocation} from '@ionic-native/geolocation';
import {GeocodingProvider} from '../providers/geocoding-provider';
import {LoginPageModule} from '../pages/login/login.module';
import {SellBookPageModule} from '../pages/sellbook/sellbook.module';
import {Camera} from '@ionic-native/camera';
import {AdvertPageModule} from '../pages/advert/advert.module';
import {BookDetailsProvider} from '../providers/book-details-provider';
import {HomePageModule} from '../pages/home/home.module';
import {PipesModule} from '../pipes/pipes.module';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    LoginPageModule,
    SellBookPageModule,
    AdvertPageModule,
    HomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    GeocodingProvider,
    Camera,
    BookDetailsProvider
  ]
})
export class AppModule {}
