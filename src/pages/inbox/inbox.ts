import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {ChatRoom} from '../../models/chatroom';
import {AngularFirestore} from 'angularfire2/firestore';
import {SellBookPage} from '../sellbook/sellbook';
import {LoginPage} from '../login/login';
import {MessagePage} from "../message/message";

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html'
})

export class InboxPage {
  public chatRooms: Observable<ChatRoom[]>;

  constructor(public navCtrl: NavController,
              private af: AngularFirestore) {

    // query etter alle chat som brukeren er en del av
    const fieldPath = `participants.${af.app.auth().currentUser.uid}`;
    this.chatRooms =
      af.collection('chatrooms', ref => ref.where(fieldPath, '==', true))
        .snapshotChanges().map(actions => {
          return actions.map(action => {
            const content = action.payload.doc.data() as ChatRoom;
            const id = action.payload.doc.id;
            return {id, ...content};
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

  viewMessage(chatId: string) {
    this.navCtrl.push(MessagePage, {recipientId: chatId, isChatId: true});
  }
}
