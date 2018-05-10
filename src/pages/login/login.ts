import {IonicPage} from 'ionic-angular';
import {Component} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {User} from '../../common/types';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  public user: User = {name: '', password: ''};
  public formError: string;

  constructor(private af: AngularFirestore) {}

  /**
   * Disse to metodene logger inn og registerer bruker.
   * &commat;usedbooks.tds blir hardkodet inn bak det brukeren skriver inn.
   * Dette fordi jeg ikke gidder sette opp autentisering av typen telefon, gmail, fb osv.
   * Deretter fanger jeg rejections, hvis noe går galt, og skriver det til formError, slik at bruker kan se
   * hva feilen er.
   */
  login() {
    this.af.app.auth()
      .signInWithEmailAndPassword(`${this.user.name}@usedbooks.tds`, this.user.password)
      .catch(err => { this.formError = err; });
  }

  register() {
    this.af.app.auth()
      .createUserWithEmailAndPassword(`${this.user.name}@usedbooks.tds`, this.user.password)
      .catch(err => this.formError = err);
  }
}
