import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email!: string;
  password!: string;

  emailError!: string | undefined;
  passwordError!: string | undefined;

  constructor(private authService: AuthenticationService) {}

  switchContainer(id1: string, id2: string, id3: string, id4: string){
    this.authService.switchContainer(id1, id2, id3, id4);
  }

  async loginUser(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": this.email,
      "password": this.password
    });

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
};

    const resp = await fetch("http://127.0.0.1:8000/auth/login/", requestOptions)
    if (resp.ok) {
      const result = await resp.json();
      console.log(result);
      this.setItemsToLocalStorage(result);
    } else {
        const result = await resp.json();
        console.log('error', result);
        this.handleErrors(result);
    }
  }

  setItemsToLocalStorage(result: any){
    localStorage.setItem('token', result.token);
    localStorage.setItem('full_name', result.full_name);
    localStorage.setItem('user_id', result.user_id);
    localStorage.setItem('email', result.email);
  }

  handleErrors(errors: {email?: string[], password?: string[]}): void {
    this.emailError = errors.email && errors.email[0];
    this.passwordError = errors.password && errors.password[0];
  }

}
