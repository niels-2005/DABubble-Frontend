import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserprofilesService {

  constructor() { }

  token = localStorage.getItem('token');
  userId = localStorage.getItem('user_id');

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$.asObservable();
  }

  refreshProfileData() {
    this._refreshNeeded$.next();
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
        return result;
      } else {
        const errorResult = await response.json();
        console.log('Error response:', errorResult);
        return null;
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  showUserProfileDetailsSitebar(){
    document.getElementById('user-profile-sitebar')?.classList.remove('d-none');
  }

  hideEditProfileAndLogout(){
    document.getElementById('edit-profile-and-logout')?.classList.add('d-none');
    document.getElementById('edit-profile-and-logout-background')?.classList.add('d-none');
    document.getElementById('user-profile-sitebar')?.classList.add('d-none');
  }

  hideChangeProfileDetailsPopup(){
    document.getElementById('opacity-background-profile-details')?.classList.add('d-none');
    document.getElementById('edit-profile-details-popup')?.classList.add('d-none');
    document.getElementById('userprofile-delete-container')?.classList.add('d-none');
    document.getElementById('userprofile-details-container')?.classList.remove('d-none');
  }

  switchContainerFromDeleteUserToProfileDetails(){
    document.getElementById('userprofile-details-container')?.classList.remove('d-none');
    document.getElementById('userprofile-delete-container')?.classList.add('d-none');
  }


}
