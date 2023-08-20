import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resetpasswordconfirm',
  templateUrl: './resetpasswordconfirm.component.html',
  styleUrls: ['./resetpasswordconfirm.component.scss']
})
export class ResetpasswordconfirmComponent implements OnInit {

  userId!: string | null;
  token!: string | null;

  new_password1!: string;
  new_password2!: string;

  errorMessage: string = '';

  passwordChanged = false;
  passwordChangedMessage = "";

  hidePassword = true;

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.token = this.route.snapshot.paramMap.get('token');
  }

  constructor(private router: Router, private route: ActivatedRoute) {}

  switchToLogin(){
    this.router.navigate(['/login']);
  }

  async changePassword(){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "new_password1": this.new_password1,
      "new_password2": this.new_password2,
      "uidb64": this.userId,
      "token": this.token
    });

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    const url = `https://celinemueller.pythonanywhere.com/auth/password-reset-confirm/${this.userId}/${this.token}/`;
    // const url = `http://127.0.0.1:8000/auth/password-reset-confirm/${this.userId}/${this.token}/`;

    const response = await fetch(url, requestOptions);

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      this. showMessageAndRedirectToLogin(result)
    } else {
      const result = await response.json();
      console.log(result);
      this.showPasswortResetConfirmErrorMessages(result);
  }
}

  showMessageAndRedirectToLogin(result: any){
    this.passwordChanged = true;
    this.passwordChangedMessage = result.detail;
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

  showPasswortResetConfirmErrorMessages(result: any){
    if (result.new_password1) {
      this.errorMessage = result.new_password1[0];
  } else if (result.new_password2) {
      this.errorMessage = result.new_password2[0];
}
  }

  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  }

}
