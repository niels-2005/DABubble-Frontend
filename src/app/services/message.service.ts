import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  checkedWelcomeMessage(){
    document.getElementById('login-opacity-background')?.classList.add('d-none');
    document.getElementById('login-message-container')?.classList.add('d-none');
    localStorage.setItem('checkedWelcomeMessage', 'true');
  }

  checkedUserLockedMessage(){
    document.getElementById('login-opacity-background')?.classList.add('d-none');
    document.getElementById('user-locked-message-container')?.classList.add('d-none');
    localStorage.removeItem('is_locked');
  }

  showUserLockedMessage(){
    document.getElementById('login-opacity-background')?.classList.remove('d-none');
    document.getElementById('user-locked-message-container')?.classList.remove('d-none');
  }

  closeMapInformationsAtCompleteYourProfile(){
    document.getElementById('map-details')?.classList.add('d-none');
  }

}
