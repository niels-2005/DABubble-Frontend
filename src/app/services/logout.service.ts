import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor() { }

  async logoutUser(){
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);

    const requestOptions : RequestInit= {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };

    await fetch("http://127.0.0.1:8000/auth/logout/", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

}
