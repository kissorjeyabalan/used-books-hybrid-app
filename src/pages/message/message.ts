import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Message} from '../../models/message';
import {StripEmail} from '../../pipes/strip-email-pipe';
import {ChatRoom} from '../../models/chatroom';
import {SellBookPage} from '../sellbook/sellbook';
import {InboxPage} from '../inbox/inbox';
import {LoginPage} from '../login/login';
import {HomePage} from '../home/home';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})

export class MessagePage {
  public chatRoomDocument: AngularFirestoreDocument<ChatRoom>;
  public messages: Observable<Message[]>;
  public msgContent: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private af: AngularFirestore) {

    const userId = af.app.auth().currentUser.uid;
    const recipientId = this.navParams.get('recipientId');
    const ridIsChatId: boolean = this.navParams.get('isChatId');
    let chatId = '';

    if (ridIsChatId) {
      chatId = recipientId;
    } else {
      // lager chatroom navn ved hjelp av brukerne sine id, sorterer de alfabetisk slik at id alltid er samme hvis det er samme brukere
      chatId = 'msg_' + (userId < recipientId ? userId + '_' + recipientId : recipientId + '_' + userId);
      af.collection<ChatRoom>('chatrooms').doc(chatId).set({participants: {[userId]: true, [recipientId]: true}});
    }

    this.chatRoomDocument = af.collection<ChatRoom>('chatrooms').doc(chatId);

    this.messages = this.chatRoomDocument.collection<Message>('messages', ref =>
      ref.orderBy('timestamp', 'desc')).snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          return action.payload.doc.data() as Message;
        });
      });
  }

  sendMessage() {
    if (this.msgContent.trim().length > 0) {
      const msgCopy = this.msgContent.trim();
      this.msgContent = '';
      const msg: Message = {
        timestamp: new Date().getTime(),
        username: new StripEmail().transform(this.af.app.auth().currentUser.email),
        content: msgCopy
      };

      // lagre melding også oppdatere sist sendt melding
      this.chatRoomDocument.collection<Message>('messages').add(msg)
        .then(() => {
          this.chatRoomDocument.set({
            lastMessage: msgCopy
          } as ChatRoom, {merge: true});
        });
    }
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

  viewInbox() {
    this.navCtrl.push(InboxPage);
  }

  goHome() {
    this.navCtrl.push(HomePage);
  }
}
