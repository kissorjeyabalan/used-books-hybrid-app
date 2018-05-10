import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {SalesItem} from '../../models/sales-item';
import {Observable} from 'rxjs/Observable';
import {AdvertPage} from '../advert/advert';
import {SellBookPage} from '../sellbook/sellbook';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public salesItemCollection: AngularFirestoreCollection<SalesItem>;
  public adverts: Observable<SalesItem[]>;

  constructor(public navCtrl: NavController,
              private af: AngularFirestore) {
    this.salesItemCollection = af.collection<SalesItem>('sales-items');
    this.adverts = this.salesItemCollection.snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          const content = action.payload.doc.data() as SalesItem;
          const id = action.payload.doc.id;
          return {id, ...content};
        });
      });
  }


  goToAdvertDetails(ad: SalesItem) {
    this.navCtrl.push(AdvertPage, {salesItem: ad});
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
}
