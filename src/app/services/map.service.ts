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

  eventData: any[] = [];

private eventDataSubject = new BehaviorSubject<any[]>([]);
public eventData$ = this.eventDataSubject.asObservable();

setEventData(data: any[]) {
  this.eventDataSubject.next(data);
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
  .then(data => {
    console.log('Backend Data:', data);  // Hier wird das Backend-Daten-Logging hinzugefügt
    return data;
  })
  .catch(error => {
    console.log('error', error);
    throw error;
  });
  }

  async getUserMapInfosForGuest(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token} `);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    return await fetch("https://celinemueller.pythonanywhere.com/userprofiles/guest/users-on-map/", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);  // Hier wird das Backend-Daten-Logging für Gäste hinzugefügt
        return data;
      })
      .catch(error => {
        console.log('error', error);
        throw error;
      });
  }

  async getEvents() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);

    const requestOptions : RequestInit = {
      method: 'GET',
      headers: myHeaders,
    };

    try {
        // const response = await fetch("http://127.0.0.1:8000/events/create/", requestOptions);
        const response = await fetch("https://celinemueller.pythonanywhere.com/events/create/", requestOptions);
        const result = await response.json();
        console.log('Event', result);
        this.eventData = result;
        this.setEventData(result);
        return result;
    } catch(error) {
        console.log('error', error);
        return [];
    }
}



}
