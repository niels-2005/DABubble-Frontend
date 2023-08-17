import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router, private localStorageService: LocalstorageService) { }

  switchContainer(id1: string, id2: string, id3: string, id4: string){
    document.getElementById(id1)?.classList.add('d-none');
    document.getElementById(id2)?.classList.add('d-none');
    document.getElementById(id3)?.classList.remove('d-none');
    document.getElementById(id4)?.classList.remove('d-none');
  }

  async loginUserWithAccessToken(token: string){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "token": token
    });

    const requestOptions : RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    try {
        const resp = await fetch("http://127.0.0.1:8000/auth/verify-token/", requestOptions);

        if (resp.ok) {
            const result = await resp.json();
            console.log(result);
            this.checkTokenValidation(result);
        } else {
            const error = await resp.json();
            console.log('error', error);
        }
    } catch (error) {
        console.log('fetch error', error);
    }
}

  checkTokenValidation(result: any){
    if (result.success){
      this.router.navigateByUrl('/startsite');
    } else {
      this.localStorageService.removeItemsFromLocalStorage();
    }
  }

}
