import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
      const username = localStorage.getItem('full_name');
      this.userFullName = username || ""
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
  user_type = "";

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
      "user_type": this.user_type,
      "user_id": this.userId,
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
        this.sendImageToBackend(); // Nachdem die Profildaten erfolgreich gesendet wurden, sende das Bild separat
      } else {
        const result = await response.json();
        console.log(result);
        this.errors = result;
      }
    } catch (error) {
      console.log('error', error);
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
      // const response = await fetch(`https://celinemueller.pythonanywhere.com/userprofiles/profile/${this.userId}/`, requestOptions);
      const response = await fetch(`http://127.0.0.1:8000/userprofiles/profile/${this.userId}/`, requestOptions);

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



}
