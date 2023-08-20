import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  constructor(private http: HttpClient) { }

  token = localStorage.getItem('token');

  public selectedChannelId = new BehaviorSubject<number|null>(null);
  selectedChannelId$ = this.selectedChannelId.asObservable();

  public newMessage = new BehaviorSubject<any|null>(null);
newMessage$ = this.newMessage.asObservable();


  setSelectedChannelId(id: number) {
    this.selectedChannelId.next(id);
  }

  getAllChannels(): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", `Token ${this.token}`);

    // return this.http.get("http://127.0.0.1:8000/chats/channels", { headers: headers })
    return this.http.get("https://celinemueller.pythonanywhere.com/chats/channels/", { headers: headers })
        .pipe(
            tap(data => console.log(data))
        );
}

loadChannelContent(): Observable<any> {
  if (!this.selectedChannelId.value) return of(null);

  const headers = new HttpHeaders().set("Authorization", `Token ${this.token}`);

  // const messages$ = this.http.get(`http://127.0.0.1:8000/chats/channels/${this.selectedChannelId.value}/messages`, { headers: headers });
  // const details$ = this.http.get(`http://127.0.0.1:8000/chats/channels/${this.selectedChannelId.value}`, { headers: headers });

  const messages$ = this.http.get(`https://celinemueller.pythonanywhere.com/chats/channels/${this.selectedChannelId.value}/messages`, { headers: headers });
  const details$ = this.http.get(`https://celinemueller.pythonanywhere.com/chats/channels/${this.selectedChannelId.value}`, { headers: headers });

  return forkJoin({messages: messages$, details: details$});
}


async createNewMessage(messageContent: any){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);
    myHeaders.append("Content-Type", "application/json");

    const body = {
      content: messageContent
  };

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
    };

    // const response = await fetch(`http://127.0.0.1:8000/chats/channels/${this.selectedChannelId.value}/messages/`, requestOptions);

    const response = await fetch(`https://celinemueller.pythonanywhere.com/chats/channels/${this.selectedChannelId.value}/messages/`, requestOptions);

    if (response.ok) {
      const newMessage = await response.json();
      console.log(newMessage);
      this.newMessage.next(newMessage);
    } else {
      const error = await response.json();
      console.log(error);
    }
}


}

