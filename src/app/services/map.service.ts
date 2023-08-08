import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  token = localStorage.getItem('token');

  public mapRefreshNeeded$ = new Subject<void>();

  get mapRefreshNeeded(): Observable<any> {
      return this.mapRefreshNeeded$.asObservable();
  }


  async getUserMapInfos(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token} `);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    return await fetch("https://celinemueller.pythonanywhere.com/userprofiles/users-on-map/", requestOptions)
    // return await fetch("http://127.0.0.1:8000/userprofiles/users-on-map/", requestOptions)
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
