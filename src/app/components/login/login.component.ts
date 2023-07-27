import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email!: string;
  password!: string;

  emailError!: string | undefined;
  passwordError!: string | undefined;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
      this.checkWelcomeMessageStatus();
  }

  checkWelcomeMessageStatus(){
    const welcomeMessage =  localStorage.getItem('checkedWelcomeMessage');
    if (welcomeMessage){
      this.checkedWelcomeMessage();
  }
}

  checkedWelcomeMessage(){
    document.getElementById('login-opacity-background')?.classList.add('d-none');
    document.getElementById('login-message-container')?.classList.add('d-none');
    localStorage.setItem('checkedWelcomeMessage', 'true');
  }

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
    localStorage.setItem('is_locked', result.is_locked);
    localStorage.setItem('quiz_attempts', result.quiz_attempts);
    localStorage.setItem('quiz_verified', result.quiz_verified);
  }

  handleErrors(errors: {email?: string[], password?: string[], message?: string}): void {
    this.emailError = errors.email && errors.email[0];

    let errorMessages = [];
    if (errors.password) {
      errorMessages.push(errors.password[0]);
    }
    if (errors.message) {
      errorMessages.push(errors.message);
    }
    this.passwordError = errorMessages.join(' ');
  }



}
