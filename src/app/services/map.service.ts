import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  token = localStorage.getItem('token');

  async getUserMapInfos(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token} `);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    return await fetch("http://127.0.0.1:8000/userprofiles/users-on-map/", requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.log('error', error);
    throw error;
  });
  }

}
