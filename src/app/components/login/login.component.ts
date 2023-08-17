import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email!: string;
  password!: string;
  hidePassword = true;

  stayLoggedInCheckbox : boolean = false;

  emailError!: string | undefined;
  passwordError!: string | undefined;

  constructor(private authService: AuthenticationService, private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
      this.checkIfUserStayedLogin();
      this.checkWelcomeMessageStatus();
      this.checkIfUserIsLocked();
  }

  checkIfUserStayedLogin(){
    const stayLoggedIn = localStorage.getItem('stayLoggedIn');
    const token = localStorage.getItem('token');
    if (stayLoggedIn === "true" && token) {
      this.authService.loginUserWithAccessToken(token);
    }
  }

  checkWelcomeMessageStatus(){
    const welcomeMessage =  localStorage.getItem('checkedWelcomeMessage');
    if (welcomeMessage){
      this.messageService.checkedWelcomeMessage();
  } else {
    document.getElementById('login-opacity-background')?.classList.remove('d-none');
  }
}

  checkIfUserIsLocked(){
    const userLocked = localStorage.getItem('is_locked');
    if(userLocked){
      this.messageService.showUserLockedMessage();
    }
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

    // const resp = await fetch("https://celinemueller.pythonanywhere.com/auth/login/", requestOptions)
    const resp = await fetch("http://127.0.0.1:8000/auth/login/", requestOptions)
    if (resp.ok) {
      const result = await resp.json();
      console.log(result);
      this.setItemsToLocalStorage(result);
      this.checkQuizVerifiedStatus(result);
    } else {
        const result = await resp.json();
        console.log('error', result);
        this.ifUserIsLockedShowMessage(result);
        this.handleErrors(result);
    }
  }

  setItemsToLocalStorage(result: any){
    localStorage.setItem('token', result.token);
    localStorage.setItem('full_name', result.full_name);
    localStorage.setItem('user_id', result.user_id);
    localStorage.setItem('email', result.email);
    localStorage.setItem('quiz_verified', result.quiz_verified);
  }

  checkQuizVerifiedStatus(result: any){
    if(result.quiz_verified === false){
      this.router.navigate(['/verify-quiz']);
    } else {
      this.router.navigate(['/startsite']);
    }
  }

  ifUserIsLockedShowMessage(result: any){
    if(result.user_locked){
    localStorage.setItem('is_locked', 'true');
    this.checkIfUserIsLocked();
  }
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

  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onCheckboxChange() {
    localStorage.setItem('stayLoggedIn', this.stayLoggedInCheckbox.toString());
}



}
