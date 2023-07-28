import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-completeyourprofile',
  templateUrl: './completeyourprofile.component.html',
  styleUrls: ['./completeyourprofile.component.scss']
})
export class CompleteyourprofileComponent implements OnInit {

  userFullName: string = "";

  ngOnInit(): void {
      const username = localStorage.getItem('full_name');
      this.userFullName = username || ""
  }

}
