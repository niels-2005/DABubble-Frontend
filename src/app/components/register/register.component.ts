import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  fullName!: string;
  email!: string;
  password!: string;

  nameError!: string | undefined;
  emailError!: string | undefined;
  passwordError!: string | undefined;

  registerSuccessful = false;
  registerSuccessfulMessage = "";

  dsgvoAccepted = false;

  constructor(private authService: AuthenticationService) {}

  switchContainer(id1: string, id2: string, id3: string, id4: string) {
    this.authService.switchContainer(id1, id2, id3, id4);
  }

  async registerUser(event: Event){
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "full_name": this.fullName,
      "email": this.email,
      "password": this.password
    });

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    const resp = await fetch("http://127.0.0.1:8000/auth/register/", requestOptions)
    if (resp.ok) {
      const result = await resp.json();
      console.log(result);
      this.showRegisterMessageAndRedirectToLogin(result);
    } else {
      const result = await resp.json();
      console.log('error', result);
      this.handleErrors(result);
    }
  }

  showRegisterMessageAndRedirectToLogin(result: any){
    this.registerSuccessful = true;
    this.registerSuccessfulMessage = result.message;
    setTimeout(() => {
      this.switchContainer('',
      'register-container',
      'create-account-container',
      'login-container')
    }, 3000);
  }

  handleErrors(errors: {full_name?: string[], email?: string[], password?: string[]}): void {
    this.nameError = errors.full_name && errors.full_name[0];
    this.emailError = errors.email && errors.email[0];
    this.passwordError = errors.password && errors.password[0];
  }
}
