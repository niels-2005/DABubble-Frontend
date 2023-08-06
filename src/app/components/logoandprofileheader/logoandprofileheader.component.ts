import { Component, OnInit } from '@angular/core';
import { LogoutService } from 'src/app/services/logout.service';
import { UserprofilesService } from 'src/app/services/userprofiles.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

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

  private subscriptions: Subscription[] = [];

  constructor(private logoutService: LogoutService, private userProfileService: UserprofilesService, private router: Router) {}

  ngOnInit(): void {
    const username = localStorage.getItem('full_name');
    this.userFullName = username || '';

    this.subscribeToUserProfileInfos();
    this.subscribeToChangedUserProfileInfos();
}

subscribeToUserProfileInfos(){
  this.subscriptions.push(
    this.userProfileService.profileData$.subscribe(data => {
        if (data && data.image_url) {
            this.profileImageUrl = data.image_url;
        }
    })
);

if (!this.userProfileService.profileData.value) {
    this.userProfileService.getProfileDetailsFromBackend();
}
}

subscribeToChangedUserProfileInfos(){
  this.subscriptions.push(
    this.userProfileService.refreshNeeded$.subscribe(() => {
        this.userProfileService.getProfileDetailsAgainFromBackend();
    })
);
}

loadProfileImage(): void {
  this.userProfileService.getProfileDetailsFromBackend().then((result) => {
      if (result && result.image_url) {
          this.profileImageUrl = result.image_url;
      }
  });
}


ngOnDestroy(): void {
  for (const sub of this.subscriptions) {
      sub.unsubscribe();
  }
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

  navigateToUserMap(){
    this.router.navigateByUrl('/map');
  }

}
