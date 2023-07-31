import { Component, OnInit } from '@angular/core';
import { LogoutService } from 'src/app/services/logout.service';
import { UserprofilesService } from 'src/app/services/userprofiles.service';

@Component({
  selector: 'app-logoandprofileheader',
  templateUrl: './logoandprofileheader.component.html',
  styleUrls: ['./logoandprofileheader.component.scss']
})
export class LogoandprofileheaderComponent implements OnInit {

  userFullName = "";

  profileImageUrl: string = "./assets/img/avatar-men-1.png";

  token = localStorage.getItem('token');
  userId = localStorage.getItem('user_id');

  constructor(private logoutService: LogoutService, private userProfileService: UserprofilesService) {}

  ngOnInit(): void {
    const username = localStorage.getItem('full_name');
    this.userFullName = username || '';
    this.userProfileService.getProfileDetailsFromBackend().then((result) => {
      if (result && result.image) {
        this.profileImageUrl = result.image;
      }
    });
  }

  showEditProfileAndLogout(){
    document.getElementById('edit-profile-and-logout')?.classList.remove('d-none');
    document.getElementById('edit-profile-and-logout-background')?.classList.remove('d-none');
  }

  hideEditProfileAndLogout(){
    document.getElementById('edit-profile-and-logout')?.classList.add('d-none');
    document.getElementById('edit-profile-and-logout-background')?.classList.add('d-none');
    document.getElementById('user-profile-sitebar')?.classList.add('d-none');
  }

  logoutUser(){
    this.logoutService.logoutUser();
  }

  showUserProfile(){
    this.userProfileService.showUserProfileDetailsSitebar();
  }

}
