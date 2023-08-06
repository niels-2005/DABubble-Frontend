import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { VerifyuserComponent } from './components/verifyuser/verifyuser.component';
import { ResetpasswordconfirmComponent } from './components/resetpasswordconfirm/resetpasswordconfirm.component';
import { VerifyuserquizComponent } from './components/verifyuserquiz/verifyuserquiz.component';
import { CompleteyourprofileComponent } from './components/completeyourprofile/completeyourprofile.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'verify/:userId/:token', component: VerifyuserComponent},
  {path: 'reset-password/:userId/:token', component: ResetpasswordconfirmComponent},
  {path: 'verify-quiz', component: VerifyuserquizComponent},
  {path: 'complete-your-profile', component: CompleteyourprofileComponent},
  {path: 'map', component: MapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
