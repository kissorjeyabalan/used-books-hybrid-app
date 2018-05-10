import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {ChatRoom} from "../../models/chatroom";
import {AngularFirestore} from "angularfire2/firestore";

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html'
})

export class InboxPage {
  public chatRooms: Observable<ChatRoom[]>;

  constructor(public navCtrl: NavController,
              private af: AngularFirestore) {
  }
}
