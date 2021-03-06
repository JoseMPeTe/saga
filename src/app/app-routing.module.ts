import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ChatDialogComponent } from './chat/chat-dialog/chat-dialog.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { AuthGuard } from './core/auth.guard';
import { OnlyAdminGuard } from './core/only-admin.guard';
import { EventosComponent } from './eventos/eventos.component';
import { HomeComponent } from './home/home.component';
import { PlanningComponent } from './planning/planning.component';
import { ReservasUserComponent } from './reservas-user/reservas-user.component';
import { SettingsComponent } from './settings/settings.component';
import { TiendaComponent } from './tienda/tienda.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path:'',component: HomeComponent},
  {path:'tienda',component:TiendaComponent},
  {path:'eventos',component:EventosComponent},
  {path:'users',component:UserComponent,canActivate: [OnlyAdminGuard]},
  {path:'settings',component:SettingsComponent,canActivate: [AuthGuard]},
  {path:'chatbot',component:ChatbotComponent, canActivate: [AuthGuard]},
  {path:'misreservas',component:ReservasUserComponent,canActivate: [AuthGuard]},
  {path:'planning',component:PlanningComponent,canActivate: [OnlyAdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
