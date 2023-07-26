import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verifyuser',
  templateUrl: './verifyuser.component.html',
  styleUrls: ['./verifyuser.component.scss']
})
export class VerifyuserComponent implements OnInit {

  userId!: string | null;
  token!: string | null;

  message!: string;
  redirect!: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.token = this.route.snapshot.paramMap.get('token');
    this.verifyUserInBackend();
  }

  async verifyUserInBackend(){
    const requestOptions : RequestInit = {
      method: 'POST',
    };

    const response = await fetch(`http://localhost:8000/auth/verify-email/${this.userId}/${this.token}`, requestOptions);
    const result = await response.json();
    if (response.ok) {
      this.message = result.message;
      this.redirect = result.redirect;
      console.log(result);
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } else {
        console.log('error', result);
    }
  }

}
