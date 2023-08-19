import { Component, OnInit } from '@angular/core';
import { UserprofilesService } from 'src/app/services/userprofiles.service';

@Component({
  selector: 'app-mapsettings',
  templateUrl: './mapsettings.component.html',
  styleUrls: ['./mapsettings.component.scss']
})
export class MapsettingsComponent implements OnInit {

  constructor(private userProfileService: UserprofilesService) {}

  website = "";
  about = "";
  userType = "";
  selectedCourse: string = '';
  selectedNumber: number | null = null;
  isSearchingForJob: boolean = false;
  imagePreview: string = './assets/img/avatar-men-1.png';
  userFullName = localStorage.getItem('full_name');
  userEmail = localStorage.getItem('email');

  dialogImage: boolean = true;
  dialogSearchingJob: boolean = true;
  dialogCourseAndModule: boolean = true;
  dialogEmail: boolean = true;
  dialogAboutMe: boolean = true;
  dialogPortfolio: boolean = true;

  showTooltip = false;

  token = localStorage.getItem('token');

  ngOnInit(): void {
    this.getDialogOptionsInformations();
    this.getProfileInformationsFromUserProfileService();
    this.checkIfProfileInformationsComeFromUserProfileService();
  }

  async getDialogOptionsInformations(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const resp = await fetch("http://127.0.0.1:8000/userprofiles/map-settings/", requestOptions);

    if (resp.ok) {
      const result = await resp.json();
      console.log(result);
      this.changeVariablesToBackendValue(result)
    } else {
      console.log('error', resp.statusText);
}
  }

  changeVariablesToBackendValue(result: any){
    this.dialogImage = result.show_profile_image
    this.dialogSearchingJob = result.show_searching_job
    this.dialogCourseAndModule = result.show_module
    this.dialogEmail = result.show_email
    this.dialogAboutMe = result.show_about
    this.dialogPortfolio = result.show_website
  }

  getProfileInformationsFromUserProfileService(){
    this.userProfileService.profileData$.subscribe(data => {
      if (data) {
        this.updateProfileData(data);
      }
    });
  }

  checkIfProfileInformationsComeFromUserProfileService(){
    if (!this.userProfileService.profileData.value) {
      this.userProfileService.getProfileDetailsFromBackend();
    }
  }

  private updateProfileData(result: any) {
    this.about = result.about;
    if (result.image_url) {
      this.imagePreview = result.image_url;
    }
    this.website = result.website;
    this.userType = result.user_type;
    this.isSearchingForJob = result.searching_job;
    this.selectedCourse = result.course;
    this.selectedNumber = result.module;
  }

  switchContainerFromMapSettingsToProfileDetails(){
    this.userProfileService.switchContainerFromMapSettingsToProfileDetails();
  }

  async saveUserMapSettings(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "show_profile_image": this.dialogImage,
      "show_searching_job": this.dialogSearchingJob,
      "show_course": this.dialogCourseAndModule,
      "show_module": this.dialogCourseAndModule,
      "show_email": this.dialogEmail,
      "show_about": this.dialogAboutMe,
      "show_website": this.dialogPortfolio
    });

    const requestOptions : RequestInit = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
    };

    await fetch("http://127.0.0.1:8000/userprofiles/map-settings/", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }


}
