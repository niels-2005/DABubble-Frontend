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
import { EditprofilesitebarComponent } from './components/editprofilesitebar/editprofilesitebar.component';
import { EditprofiledetailsComponent } from './components/editprofiledetails/editprofiledetails.component';
import { DeleteprofileComponent } from './components/deleteprofile/deleteprofile.component';
import { MapComponent } from './components/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ReactiveFormsModule } from '@angular/forms';
import { MapwelcomemessageComponent } from './components/mapwelcomemessage/mapwelcomemessage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SitenavigationComponent } from './components/sitenavigation/sitenavigation.component';
import { ChatComponent } from './components/chat/chat.component';
import { StartsiteComponent } from './components/startsite/startsite.component';
import { MapsettingsComponent } from './components/mapsettings/mapsettings.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { EventComponent } from './components/event/event.component';

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
    EditprofilesitebarComponent,
    EditprofiledetailsComponent,
    DeleteprofileComponent,
    MapComponent,
    MapwelcomemessageComponent,
    SitenavigationComponent,
    ChatComponent,
    StartsiteComponent,
    MapsettingsComponent,
    StatisticsComponent,
    EventComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ImageCropperModule,
    LeafletModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChartModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
