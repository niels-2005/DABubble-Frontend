import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logoandprofileheader',
  templateUrl: './logoandprofileheader.component.html',
  styleUrls: ['./logoandprofileheader.component.scss']
})
export class LogoandprofileheaderComponent implements OnInit {

  userFullName = "";

  ngOnInit(): void {
      const username = localStorage.getItem('full_name');
      this.userFullName = username || '';
  }

}
