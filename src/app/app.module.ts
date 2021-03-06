import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CarouselComponent } from './carousel/carousel.component';
import { TiendaComponent } from './tienda/tienda.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventosComponent } from './eventos/eventos.component';
import { LoginComponent } from './login/login.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { UserComponent } from './user/user.component';
import { AuthService } from './core/auth.service';
import { FireDBService } from './core/fire-db.service';
import { FirestorageService } from './core/firestorage.service';
import { SettingsComponent } from './settings/settings.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './core/auth.guard';


import { NbThemeModule, NbLayoutModule, NbChatModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbIconModule } from '@nebular/theme';
import { ReservasUserComponent } from './reservas-user/reservas-user.component';
import { PlanningComponent } from './planning/planning.component';
import { ActivityListComponent } from './planning/activity-list/activity-list.component';
import { ActivityComponent } from './planning/activity/activity.component';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CarouselComponent,
    TiendaComponent,
    CabeceraComponent,
    RegisterComponent,
    EventosComponent,
    LoginComponent,
    UserComponent,
    SettingsComponent,
    ChatbotComponent,
    ReservasUserComponent,
    PlanningComponent,
    ActivityListComponent,
    ActivityComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center'
     }), // ToastrModule added
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    HttpClientModule,
     NbThemeModule.forRoot({ name: 'default' }),
     NbLayoutModule,
     NbEvaIconsModule,
     NbIconModule,
     NbChatModule,
     NbSpinnerModule,
     AngularFireFunctionsModule,

  ],
  providers: [AuthService, FireDBService, FirestorageService,AuthGuard,{ provide: REGION, useValue: 'europe-west6' } ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

