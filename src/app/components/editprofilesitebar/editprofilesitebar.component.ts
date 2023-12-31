import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserprofilesService } from 'src/app/services/userprofiles.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editprofilesitebar',
  templateUrl: './editprofilesitebar.component.html',
  styleUrls: ['./editprofilesitebar.component.scss']
})
export class EditprofilesitebarComponent implements OnInit, OnDestroy {

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
  user_type: string = "";
  isSearchingForJob!: boolean;
  selectedCourse: string = "";
  selectedNumber: string = "";
  isCommunityMember: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private userProfileService: UserprofilesService) {}

  ngOnInit(): void {
    this.getUserInformations();
    this.checkIfUserInformationsArrived();
    this.checkIfUserInformationsChanged();
  }

  getUserInformations(){
    this.subscriptions.push(
      this.userProfileService.profileData$.subscribe(data => {
        if (data) {
          this.updateProfileData(data);
        }
      })
    );
  }

  checkIfUserInformationsArrived(){
    if (!this.userProfileService.profileData.value) {
      this.userProfileService.getProfileDetailsFromBackend();
    }
  }

  checkIfUserInformationsChanged(){
    this.subscriptions.push(
      this.userProfileService.refreshNeeded$.subscribe(() => {
        this.userProfileService.getProfileDetailsAgainFromBackend();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private updateProfileData(result: any) {
    this.isCommunityMember = result.community_member;
    this.about = result.about;
    this.city = result.city;
    this.houseNumber = result.house_number;
    if (result.image_url) {
      this.profileImageUrl = result.image_url;
    }
    this.phoneNumber = result.phone_number;
    this.street = result.street;
    this.website = result.website;
    this.zipCode = result.zip_code;
    this.user_type = result.user_type
    this.isSearchingForJob = result.searching_job;
    this.selectedCourse = result.course;
    this.selectedNumber = result.module;
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
