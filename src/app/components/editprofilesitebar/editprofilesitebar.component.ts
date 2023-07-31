import { Component, OnInit } from '@angular/core';
import { UserprofilesService } from 'src/app/services/userprofiles.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editprofilesitebar',
  templateUrl: './editprofilesitebar.component.html',
  styleUrls: ['./editprofilesitebar.component.scss']
})
export class EditprofilesitebarComponent implements OnInit {

  fullName = localStorage.getItem('full_name');
  emailAddress = localStorage.getItem('email');

  profileImageUrl: string = "./assets/img/avatar-men-1.png";
  about: string = '';
  city: string = '';
  houseNumber: string = '';
  phoneNumber: string = '';
  street: string = '';
  website: string = '';
  zipCode: string = '';

  private subscriptions: Subscription[] = [];

  constructor(private userProfileService: UserprofilesService) {}

  ngOnInit(): void {
    this.getProfileDetailsFromBackend();
    this.subscriptions.push(
      this.userProfileService.refreshNeeded$.subscribe(() => {
      this.getProfileDetailsFromBackend();
    })
  );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getProfileDetailsFromBackend(){
    this.userProfileService.getProfileDetailsFromBackend().then((result) => {
      if (result) {
        this.about = result.about;
        this.city = result.city;
        this.houseNumber = result.house_number;
        this.profileImageUrl = result.image;
        this.phoneNumber = result.phone_number;
        this.street = result.street;
        this.website = result.website;
        this.zipCode = result.zip_code;
      }
    });
  }

  hideUserProfileDetailsSitebar(){
    this.userProfileService.hideEditProfileAndLogout();
  }

  showChangeProfileDetailsPopup(){
    document.getElementById('opacity-background-profile-details')?.classList.remove('d-none');
    document.getElementById('edit-profile-details-popup')?.classList.remove('d-none');
  }

  hideChangeProfileDetailsPopup(){
    document.getElementById('opacity-background-profile-details')?.classList.add('d-none');
    document.getElementById('edit-profile-details-popup')?.classList.add('d-none');
  }

  }

