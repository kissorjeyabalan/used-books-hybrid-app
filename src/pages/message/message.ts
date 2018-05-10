import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Message} from '../../models/message';
import {StripEmail} from '../../pipes/strip-email-pipe';
import {ChatRoom} from "../../models/chatroom";

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
              private af: AngularFirestore,
              private stripEmail: StripEmail) {

    const userId = af.app.auth().currentUser.uid;
    const recipientId = this.navParams.get('recipientId');

    // lager chatroom navn ved hjelp av brukerne sine id, sorterer de alfabetisk slik at id alltid er samme hvis det er samme brukere
    const chatId = 'msg_' + (userId < recipientId ? userId + '_' + recipientId : recipientId + '_' + userId);

    this.chatRoomDocument = af.collection<ChatRoom>('rooms').doc(chatId);

    // oppdater participants, brukes for å hente chatter en bruker er en del av
    this.chatRoomDocument.set({
      participant1: (userId < recipientId ? userId : recipientId),
      participant2: (userId < recipientId ? recipientId : userId)
    } as ChatRoom, {merge: true});


    this.messages = this.chatRoomDocument.collection<Message>('messages').snapshotChanges()
      .map(actions => {
        return actions.map(action => {
          return action.payload.doc.data() as Message;
        });
      });
  }

  sendMessage() {
    if (this.msgContent.length > 0) {
      const msg: Message = {
        timestamp: new Date().getTime(),
        username: this.stripEmail.transform(this.af.app.auth().currentUser.email),
        content: this.msgContent
      };

      // lagre melding også oppdatere sist sendt melding
      this.chatRoomDocument.collection<Message>('messages').add(msg)
        .then(() => {
          this.chatRoomDocument.set({
            lastMessage: this.msgContent
          } as ChatRoom, {merge: true});
        });
      this.msgContent = '';
    }
  }
}
