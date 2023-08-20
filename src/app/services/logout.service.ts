import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private localStorageService: LocalstorageService, private router: Router) { }

  async logoutUser() {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${token}`);

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
    };

    // const resp = await fetch("http://127.0.0.1:8000/auth/logout/", requestOptions);
    const resp = await fetch("https://celinemueller.pythonanywhere.com/auth/logout/", requestOptions)

    if (resp.ok) {
        const result = await resp.json();
        console.log(result);
        this.localStorageService.removeItemsFromLocalStorage();
        this.router.navigateByUrl('/login');
    } else {
        console.log('error', resp.status, resp.statusText);
    }
}


}
