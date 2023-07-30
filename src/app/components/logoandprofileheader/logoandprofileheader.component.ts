import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
      const username = localStorage.getItem('full_name');
      this.userFullName = username || '';
      this.getProfileDetailsFromBackend();
  }

  async getProfileDetailsFromBackend(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);

    const requestOptions : RequestInit = {
    method: 'GET',
    headers: myHeaders,
    };

    try {
      // const response = await fetch(`https://celinemueller.pythonanywhere.com/userprofiles/profile/${this.userId}/`, requestOptions);
      const response = await fetch(`http://127.0.0.1:8000/userprofiles/profile/${this.userId}/`, requestOptions);

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if (result && result.image) {
          this.profileImageUrl = result.image;
        }
      } else {
        const errorResult = await response.json();
        console.log('Error response:', errorResult);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

}
