import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserstatusService } from 'src/app/services/userstatus.service';

@Component({
  selector: 'app-completeyourprofile',
  templateUrl: './completeyourprofile.component.html',
  styleUrls: ['./completeyourprofile.component.scss']
})
export class CompleteyourprofileComponent implements OnInit {

  @ViewChild('defaultImage') defaultImage!: ElementRef;

  userFullName: string = "";

  selectedImage: any = null;

  imagePreview: string = './assets/img/avatar-men-1.png';

  token = localStorage.getItem('token');
  userId = localStorage.getItem('user_id');

  errors: any = {};

  constructor(private router: Router, private userStatusService: UserstatusService) { }

  ngOnInit(): void {
    this.userStatusService.checkIfUserIsAuthenticated();
      const username = localStorage.getItem('full_name');
      this.userFullName = username || ""
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];

    this.imagePreview = URL.createObjectURL(this.selectedImage);
}

  street = "";
  house_number = "";
  zip_code = "";
  city = "";
  phone_number = "";
  website = "";
  about = "";
  users_type = "";
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
      "user_type": this.users_type,
      "user_id": this.userId,
      "show_on_map": this.showOnMap
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: rawBody,
    };

    try {
      // const response = await fetch(`https://celinemueller.pythonanywhere.com/userprofiles/profile/${this.userId}/`, requestOptions);
      const response = await fetch(`http://127.0.0.1:8000/userprofiles/profile/${this.userId}/`, requestOptions);

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        this.checkIfImageIsGiven();
      } else {
        const result = await response.json();
        console.log(result);
        this.errors = result;
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  checkIfImageIsGiven(){
    if(this.selectedImage){
      this.sendImageToBackend();
    } else {
      this.router.navigateByUrl('map');
    }
  }

  async sendImageToBackend() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);

    const formData = new FormData();
    formData.append("image", this.selectedImage);

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
    };

    try {
      // const response = await fetch(`https://celinemueller.pythonanywhere.com/images/upload/`, requestOptions);
      const response = await fetch(`http://127.0.0.1:8000/images/upload/`, requestOptions);

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        this.router.navigateByUrl('startsite');
      } else {
        const result = await response.json();
        console.log(result);
        this.errors = result;
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  switchContainerToCompleteYourProfile(){
    document.getElementById('welcome-to-community-text')?.classList.add('d-none');
    document.getElementById('complete-your-profile-details')?.classList.remove('d-none');
  }

  openMapInformations(){
    document.getElementById('map-details')?.classList.remove('d-none');
  }
}
