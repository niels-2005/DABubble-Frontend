import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent {

  email!: string;

  isEmailSent = false;
  emailSentMessage = '';

  constructor(private authService: AuthenticationService) {}

  switchContainer(id1: string, id2: string, id3: string, id4: string){
    this.authService.switchContainer(id1, id2, id3, id4);
  }

  async sendPasswordResetMail(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": this.email
    });

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    try {
      const response = await fetch("https://celinemueller.pythonanywhere.com/auth/password-reset/", requestOptions);
        // const response = await fetch("http://127.0.0.1:8000/auth/password-reset/", requestOptions);
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            this.isEmailSent = true;
            this.emailSentMessage = result.detail;
        } else {
            const error = await response.json();
            console.log(error);
            this.showPasswordResetErrors(error);
        }
    } catch (error) {
        console.log('error', error);
    }
}

  showPasswordResetErrors(error: any){
    const errorElement = document.querySelector('.reset-password-error');
            if (errorElement && error.email) {
                errorElement.innerHTML = typeof error.email === 'string' ? error.email : error.email.join(' ');
            }
  }

}
