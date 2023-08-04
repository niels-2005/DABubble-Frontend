import { Component, OnInit } from '@angular/core';
import { UserprofilesService } from 'src/app/services/userprofiles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deleteprofile',
  templateUrl: './deleteprofile.component.html',
  styleUrls: ['./deleteprofile.component.scss']
})
export class DeleteprofileComponent implements OnInit {

  imagePreview: string = './assets/img/avatar-men-1.png';

  email = localStorage.getItem('email');
  password!: string;

  token = localStorage.getItem('token');

  constructor (private userProfileService: UserprofilesService, private router: Router) {}

  ngOnInit(): void {
    this.getProfileDetailsFromBackend();
  }

  getProfileDetailsFromBackend(){
    this.userProfileService.getProfileDetailsFromBackend().then((result) => {
      if (result) {
        this.imagePreview = result.image;
      }
    });
  }

  isPasswordValid() {
    return this.password && this.password.length >= 8;
  }

  switchContainerFromDeleteUserToProfileDetails(){
    this.userProfileService.switchContainerFromDeleteUserToProfileDetails();
  }

  async deleteUser(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token} `);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "email": this.email,
      "password": this.password
    });

    const requestOptions  : RequestInit= {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
};

const resp = await fetch("http://127.0.0.1:8000/userprofiles/delete-user/", requestOptions);

if (resp.ok) {
    const result = await resp.json();
    console.log(result);
    this.router.navigateByUrl('/login');
} else {
    const error = await resp.json();
    console.log('error', error);
}
  }

}
