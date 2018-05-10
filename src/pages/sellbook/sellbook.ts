import {IonicPage, Loading, LoadingController, NavController} from 'ionic-angular';
import {Component} from '@angular/core';
import {Book, ToastLocation} from '../../common/types';
import {ToastController} from 'ionic-angular';
import {Camera} from '@ionic-native/camera';
import {AngularFirestore} from 'angularfire2/firestore';
import * as shortid from 'shortid';
import {AngularFireStorage} from 'angularfire2/storage';
import {SalesItem} from '../../models/sales-item';
import {AdvertPage} from '../advert/advert';
import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';
import {Geolocation} from '@ionic-native/geolocation';
import {GeocodingProvider} from '../../providers/geocoding-provider';
import {InboxPage} from "../inbox/inbox";


@IonicPage()
@Component({
  selector: 'page-sellbook',
  templateUrl: 'sellbook.html'
})

export class SellBookPage {
  // masking config for bruk av angular2-text-mask npm
  public mask = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/];
  public previewImage: string = '';
  public book: Book = {isbn: '', price: 150};
  public title: string = '';

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private af: AngularFirestore,
              private afStorage: AngularFireStorage,
              private geolocation: Geolocation,
              private geocoding: GeocodingProvider) {}


  updateLocation() {
    return new Promise((resolve) => {
      this.geolocation.getCurrentPosition()
        .then(pos => {
          this.geocoding.getAddressByCoords(
            pos.coords.latitude,
            pos.coords.longitude
          ).then((location) => {
            resolve(location);
          });
        }).catch((err) => {
          console.log(err);
          // returnerer standard, trenger ikke noe rejection
          resolve('Jorda, Verdensrommet');
      });
    });
  }

  sellBook() {
    const isbn: string = this.book.isbn.replace(/-/g, '');
    if (isbn.length <= 12 || this.title.length < 3) {
      this.showToast('Informasjonen du har fylt ut er feil. ISBN må være 13 karakterer og tittel må være minst 3 karakterer.', 'middle');
      return;
    }

    /* Mask modulen jeg har brukt fungerer ikke helt med nåværende versjon av ionic.
     * Henter derfor bare de 13 første tallene. Filnavn for bildet blir generert av shortid modulen.
     * */
    this.book.isbn = isbn.substr(0, 13);

    // start loading indikator
    const loading = this.loadingCtrl.create({
      content: 'Lager annonse...',
      dismissOnPageChange: true
    });

    // hent lokasjon før alt det andre skjer
    loading.present()
      .then(() => {
      this.updateLocation().then((userLocation: string) => {
          const salesItem: SalesItem = {
            title: this.title,
            book: this.book,
            imgUrl: '',
            seller: this.af.app.auth().currentUser.email,
            uid: this.af.app.auth().currentUser.uid,
            location: userLocation
          };

          // kun last opp bilde hvis brukeren faktisk har valgt bilde
          if (this.previewImage !== '') {
            const imgFileName = `${shortid.generate()}.jpg`;

            const task = this.afStorage
              .ref(imgFileName)
              .putString(this.previewImage, 'base64', {contentType: 'image/jpeg'});

            const uploadEvent = task.downloadURL();

            uploadEvent.subscribe((imgUrl) => {
              salesItem.imgUrl = imgUrl;
              this.uploadItem(salesItem, loading);
            });
          } else {
            this.uploadItem(salesItem, loading);
          }
        });
    });
  }


  // last opp SalesItem og send brukeren videre til siden med objektet
  uploadItem(salesItem: SalesItem, loading: Loading) {
    this.af.collection<SalesItem>('sales-items')
      .add(salesItem).then((doc) => {
      salesItem.id = doc.id;
      this.showToast('Varen har blitt lagt ut for salg.', 'bottom');
      this.navCtrl.push(AdvertPage, {salesItem});
    }).catch(err => {
      loading.dismissAll();
      this.showToast(`Det oppstod en feil: ${err}`, 'bottom');
    });
  }

  showToast(msg: string, position: ToastLocation): void {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: position
    });

    toast.present();
  }

  takePicture() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      cameraDirection: this.camera.Direction.BACK,
      correctOrientation: true,
      targetHeight: 300,
      allowEdit: true,
      quality: 80
    }).then(img => {
      this.previewImage = img;
    }).catch(() => {
      // do nothing, user did not select image.
    });
  }

  doLogout() {
    this.af.app.auth().signOut()
      .then(() => {
        this.navCtrl.setRoot(LoginPage);
      });
  }

  goHome() {
    this.navCtrl.push(HomePage);
  }

  viewInbox() {
    this.navCtrl.push(InboxPage);
  }

}
