import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { FormsModule } from '@angular/forms';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { WorkspacecontentleftComponent } from './components/workspacecontentleft/workspacecontentleft.component';
import { WorkspaceheadercontentComponent } from './components/workspaceheadercontent/workspaceheadercontent.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetpasswordComponent,
    WorkspaceComponent,
    WorkspacecontentleftComponent,
    WorkspaceheadercontentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
