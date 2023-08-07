import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserstatusService {

  constructor(private router: Router) { }

  token = localStorage.getItem('token');

  quizVerified = localStorage.getItem('quiz_verified');

  checkIfUserIsAuthenticated(){
    if(!this.token){
      this.router.navigate(['/login']);
    }
  }

  checkIfUserVerifiedQuiz(){
  if(this.quizVerified === 'false'){
    this.router.navigate(['/verify-quiz']);
  }
  }
}
