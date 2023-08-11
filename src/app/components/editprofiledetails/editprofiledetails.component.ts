import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MapService } from 'src/app/services/map.service';
import { UserprofilesService } from 'src/app/services/userprofiles.service';

@Component({
  selector: 'app-editprofiledetails',
  templateUrl: './editprofiledetails.component.html',
  styleUrls: ['./editprofiledetails.component.scss']
})
export class EditprofiledetailsComponent {

  @ViewChild('defaultImage') defaultImage!: ElementRef;

  userFullName: string = "";

  selectedImage: any = null;

  imagePreview: string = './assets/img/avatar-men-1.png';

  token = localStorage.getItem('token');
  userId = localStorage.getItem('user_id');

  errors: any = {};

  private originalShowOnMap!: boolean;

  constructor(private router: Router, private userProfileService: UserprofilesService, private mapService: MapService) { }

  ngOnInit(): void {
    const username = localStorage.getItem('full_name');
    this.userFullName = username || "";

    this.userProfileService.profileData$.subscribe(data => {
      if (data) {
        this.updateProfileData(data);
      }
    });

    if (!this.userProfileService.profileData.value) {
      this.userProfileService.getProfileDetailsFromBackend();
    }
  }

  private updateProfileData(result: any) {
    this.about = result.about;
    this.city = result.city;
    this.house_number = result.house_number;
    if (result.image_url) {
      this.imagePreview = result.image_url;
    }
    this.phone_number = result.phone_number;
    this.street = result.street;
    this.website = result.website;
    this.zip_code = result.zip_code;
    this.userType = result.user_type;
    this.originalShowOnMap = result.show_on_map;
    this.showOnMap = result.show_on_map;
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];

    // Erstellt eine URL, die das ausgewählte Bild repräsentiert
    this.imagePreview = URL.createObjectURL(this.selectedImage);
}

  street = "";
  house_number = "";
  zip_code = "";
  city = "";
  phone_number = "";
  website = "";
  about = "";
  userType = "";
  showOnMap: boolean = false;

  async sendProfileDetailsToBackend() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);
    myHeaders.append("Content-Type", "application/json");

    const rawBody = JSON.stringify({
      "street": this.street,
      "house_number": this.house_number,
      "zip_code": this.zip_code,
      "city": this.city,
      "phone_number": this.phone_number,
      "website": this.website,
      "about": this.about,
      "user_id": this.userId,
      "show_on_map": this.showOnMap,
      "user_type": this.userType,
    });

    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: myHeaders,
      body: rawBody,
    };

    try {
      // const response = await fetch(`https://celinemueller.pythonanywhere.com/userprofiles/profile/${this.userId}/`, requestOptions);
      const response = await fetch(`http://127.0.0.1:8000/userprofiles/profile/${this.userId}/`, requestOptions);

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        console.log("originalShowOnMap", this.originalShowOnMap);
        console.log("showOnMap", this.showOnMap);
        if (this.originalShowOnMap !== this.showOnMap) {
          this.mapService.mapRefreshNeeded$.next();
      }
        this.checkIfImageNeedsPatched();
      } else {
        const result = await response.json();
        console.log(result);
        this.errors = result;
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  checkIfImageNeedsPatched(){
    if (this.selectedImage) {
      this.sendImageToBackend();
  } else {
    this.hideChangeProfileDetailsPopup();
    this.userProfileService.refreshProfileData();
  }
  }

  async sendImageToBackend() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);

    const formData = new FormData();
    formData.append("image", this.selectedImage);

    const requestOptions: RequestInit = {
      method: 'PATCH',
      headers: myHeaders,
      body: formData,
    };

    try {
      // const response = await fetch(`https://celinemueller.pythonanywhere.com/images/upload/`, requestOptions);
      const response = await fetch(`http://127.0.0.1:8000/images/upload/`, requestOptions);

      if (response.ok) {
        const result = await response.json();
        console.log(result);
          this.hideChangeProfileDetailsPopup();
          this.userProfileService.refreshProfileData();
      } else {
        const result = await response.json();
        console.log(result);
        this.errors = result;
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  hideChangeProfileDetailsPopup(){
    this.userProfileService.hideChangeProfileDetailsPopup();
  }

  switchContainerToDeleteUser(){
    document.getElementById('userprofile-details-container')?.classList.add('d-none');
    document.getElementById('userprofile-delete-container')?.classList.remove('d-none');
  }


}
