import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SalesItem} from '../../models/sales-item';
import {BookDetail} from '../../common/types';
import {BookDetailsProvider} from '../../providers/book-details-provider';
import {SellBookPage} from '../sellbook/sellbook';
import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';
import {AngularFirestore} from 'angularfire2/firestore';
import {MessagePage} from '../message/message';
import {InboxPage} from "../inbox/inbox";

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

  isSeller(): boolean {
    const uid = this.af.app.auth().currentUser.uid;
    if (uid === undefined) return true;
    return this.advert.uid === uid;
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

  viewInbox() {
    this.navCtrl.push(InboxPage);
  }

  contactSeller(uid: string) {
    this.navCtrl.push(MessagePage, {recipientId: uid, isChatId: false});
  }
}
