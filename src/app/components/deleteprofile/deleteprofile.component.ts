import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserprofilesService } from 'src/app/services/userprofiles.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deleteprofile',
  templateUrl: './deleteprofile.component.html',
  styleUrls: ['./deleteprofile.component.scss']
})
export class DeleteprofileComponent implements OnInit, OnDestroy {

  imagePreview: string = './assets/img/avatar-men-1.png';
  email = localStorage.getItem('email');
  password!: string;
  token = localStorage.getItem('token');

  private subscriptions: Subscription[] = [];

  constructor (private userProfileService: UserprofilesService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.userProfileService.profileData$.subscribe(data => {
        if (data) {
          this.imagePreview = data.image_url;
        }
      })
    );

    if (!this.userProfileService.profileData.value) {
      this.userProfileService.getProfileDetailsFromBackend();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
