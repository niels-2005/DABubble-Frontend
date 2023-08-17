import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getItemsFromLocalStorage(){
    let items = {
      token: localStorage.getItem('token'),
      full_name: localStorage.getItem('full_name'),
      user_id: localStorage.getItem('user_id'),
      email: localStorage.getItem('email'),
      is_locked: localStorage.getItem('is_locked'),
      quiz_attempts: localStorage.getItem('quiz_attempts'),
      quiz_verified: localStorage.getItem('quiz_verified'),
    }

    return items;
}

  removeItemsFromLocalStorage(){
    localStorage.removeItem('token');
    localStorage.removeItem('full_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('quiz_verified');
    localStorage.removeItem('stayLoggedIn');
  }

}
