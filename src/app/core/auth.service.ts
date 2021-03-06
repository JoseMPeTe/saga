import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
import { FireDBService } from './fire-db.service';
import { ToastrService } from 'ngx-toastr';
import { of, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  authUser: any = null;
  arrayAdmins: any[] = [];
  //dirección a la que redirecciona el link del correo de verificación
  actionCodeSettings = {
    url: 'https://saga-1f81f.web.app/',
  };
  adminSubscription: Subscription;
  imageURL: any = null;
  darkForm: any;
  isLogged: boolean;
  userId: string;
  constructor(
    public afAuth: AngularFireAuth, //atributo publico de la clase del tipo AngularFireAuth
    private router: Router,
    private firedb: FireDBService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  //Observador para asegurar que la autenticación no está en proceso. Asyncpipe desde template
  user: any = this.afAuth.authState.pipe(
    map((authState) => {
      //console.log('authState: ', authState);
      if (authState) {
        this.authUser = authState;
        this.isLogged = true;
        this.userId = authState.uid;
        this.authUser.getIdTokenResult().then((idTokenResult) => {
          this.authUser.admin = idTokenResult.claims.admin;
        });
        return this.authUser;
      } else {
        this.isLogged = false;
        if (this.adminSubscription) {
          this.adminSubscription.unsubscribe();
        }
        return null;
      }
    })
  );

  getIsLogged() {
    console.log(this.isLogged);
    return this.isLogged;
  }

  // Send email verification when new user sign up

  resendVerification() {
    this.authUser
      .sendEmailVerification(this.actionCodeSettings)
      .then(() => {
        this.toastr.success(
          'Hemos enviado un correo de verificacion a ' + this.authUser.email,
          'Compruebe su correo antes entrar'
        ),
          {
            timeOut: 10000,
          };
      })
      .then(() => {
        this.logout();
      });
  }

  /**
   * Registro con usuario y contraseña y manda email de verificacion
   * @param value
   */
  doRegister(value) {
    //createUserWithEmailAndPassword comprueba formato email y contraseña (6 caracteres mínimo)
    //Si es correcto devuelve objeto user
    //Documentacion https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          (user) => {
            this.authUser = user.user;
            console.log('user logado con mail: ', user.user.email);
            console.log(user.user.emailVerified);
            user.user.sendEmailVerification(this.actionCodeSettings);

            resolve(user);
          },
          (err) => reject(err)
        );
    });
  }

  login(value) {
    console.log('Login!!');

    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password).then(
        (res) => {
          console.log('user logado con mail: ', res.user.email);
          console.log(res.user.emailVerified);
          this.userId = res.user.uid;
          this.firedb.updateUserData(res.user);
          this.arrayAdmins = [''];
          this.isLogged = true;

          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }
  /**
   * Registra y verifica con cuenta google
   */
  glogin() {
    return new Promise<any>((resolve, reject) => {
      console.log('google login!');
      let provider = new firebase.auth.GoogleAuthProvider();

      provider.addScope('profile');
      provider.addScope('email');

      this.afAuth.signInWithPopup(provider).then(
        (res) => {
          console.log('user logado: ', res);
          this.userId = res.user.uid;
          this.firedb.updateUserData(res.user);
          this.arrayAdmins = [''];
          this.isLogged = true;

          resolve(res);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }
  /**
   * El usuario deja de estar autenticado en la aplicacion
   */
  logout() {
    console.log(this.authUser.email + ' logout!');
    this.router.navigate(['/']);
    this.isLogged = false;
    this.userId = '';
    this.afAuth.signOut();
  }

  /**
   * TABLA USERS
   * queda escuchando si es admin en la base de datos
   *y rellena un array con admins
   */
  fillAdmins() {
    this.adminSubscription = this.firedb.getAdmins().subscribe((snap) => {
      this.arrayAdmins = [];
      snap.forEach((u) => {
        const admin: any = u.payload.val();
        admin.key = u.key;

        this.arrayAdmins.push(admin);
        console.log(u);
      });
      console.log('admins: ', this.arrayAdmins);
    });
  }
  /**
   * Comprueba si un user es admin en el array del metodo fillAdmins
   * que se rellenó a partir de la base de datos.
   * En la tabla users devolverá true, si el user es admin
   * @param val
   * @returns
   */
  checkAdmin(val) {
    const isMatch = this.arrayAdmins.filter((obj) => obj.email == val);
    let res: boolean = false;
    //console.log(isMatch); //si coincide devuelve un array con el objeto de length=1, si no coincide length=0
    if (isMatch.length != 0) {
      res = true;
    } else {
      res = false;
    }
    return res;
  }
  //set y get imageURL, para usar este servicio auth para comunicar este valor entre componentes
  setImageURL(value) {
    this.imageURL = value;
  }
  getImageURL() {
    return this.imageURL;
  }
  //Set y get switch para usar este servicio para comunicar switch entre componentes (fondo chat dark)
  setSwitch(value) {
    this.darkForm = value;
  }
  getSwitch() {
    return this.darkForm;
  }
  getUserId() {
    return this.userId;
  }
}
