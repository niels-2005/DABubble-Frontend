import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { FormsModule } from '@angular/forms';
import { VerifyuserComponent } from './components/verifyuser/verifyuser.component';
import { ResetpasswordconfirmComponent } from './components/resetpasswordconfirm/resetpasswordconfirm.component';
import { VerifyuserquizComponent } from './components/verifyuserquiz/verifyuserquiz.component';
import { LoginnewuserwelcomemessageComponent } from './components/loginwelcomemessage/loginnewuserwelcomemessage.component';
import { UserlockedmessageComponent } from './components/userlockedmessage/userlockedmessage.component';
import { CompleteyourprofileComponent } from './components/completeyourprofile/completeyourprofile.component';
import { LogoandprofileheaderComponent } from './components/logoandprofileheader/logoandprofileheader.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { StartsiteComponent } from './components/startsite/startsite.component';
import { EditprofilesitebarComponent } from './components/editprofilesitebar/editprofilesitebar.component';
import { EditprofiledetailsComponent } from './components/editprofiledetails/editprofiledetails.component';
import { DeleteprofileComponent } from './components/deleteprofile/deleteprofile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetpasswordComponent,
    VerifyuserComponent,
    ResetpasswordconfirmComponent,
    VerifyuserquizComponent,
    LoginnewuserwelcomemessageComponent,
    UserlockedmessageComponent,
    CompleteyourprofileComponent,
    LogoandprofileheaderComponent,
    StartsiteComponent,
    EditprofilesitebarComponent,
    EditprofiledetailsComponent,
    DeleteprofileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ImageCropperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
