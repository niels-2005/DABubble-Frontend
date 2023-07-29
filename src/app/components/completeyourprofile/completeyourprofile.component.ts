import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-completeyourprofile',
  templateUrl: './completeyourprofile.component.html',
  styleUrls: ['./completeyourprofile.component.scss']
})
export class CompleteyourprofileComponent implements OnInit {

  @ViewChild('defaultImage') defaultImage!: ElementRef;

  userFullName: string = "";

  imageChangedEvent: any = '';
  croppedImage: any = '';

  token = localStorage.getItem('token');
  userId = localStorage.getItem('user_id');

  ngOnInit(): void {
      const username = localStorage.getItem('full_name');
      this.userFullName = username || ""
  }

  onFileSelected(event: any) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: any) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  async sendProfileDetailsToBackend(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "street": "",
      "house_number": "",
      "zip_code": "",
      "city": "",
      "phone_number": "",
      "website": "",
      "about": "",
      "image": ""
    });

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    await fetch(`http://127.0.0.1:8000/userprofiles/profile/${this.userId}/`, requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

}
