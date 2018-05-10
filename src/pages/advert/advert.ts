import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SalesItem} from '../../models/sales-item';
import {BookDetail} from '../../common/types';
import {BookDetailsProvider} from '../../providers/book-details-provider';
import {SellBookPage} from '../sellbook/sellbook';
import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';
import {AngularFirestore} from 'angularfire2/firestore';

@IonicPage()
@Component({
  selector: 'page-advert',
  templateUrl: 'advert.html'
})

export class AdvertPage {
  public advert: SalesItem;
  public bookDetail: BookDetail;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public af: AngularFirestore,
              private bookProvider: BookDetailsProvider,
              private loadingCtrl: LoadingController) {
    this.advert = this.navParams.get('salesItem');
    const loading = this.loadingCtrl.create({content: 'Laster inn informasjon om bok...'});
    loading.present().then(() => {
      bookProvider.getBookDetails(this.advert.book.isbn)
        .then((book: BookDetail) => {
          this.bookDetail = book;
          loading.dismissAll();
        });
    });
  }

  doLogout() {
    this.af.app.auth().signOut()
      .then(() => {
        this.navCtrl.setRoot(LoginPage);
      });
  }

  viewSellBook() {
    this.navCtrl.push(SellBookPage);
  }

  goHome() {
    this.navCtrl.push(HomePage);
  }
}
