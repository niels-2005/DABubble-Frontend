import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent {

  constructor(private authService: AuthenticationService) {}

  switchContainer(id1: string, id2: string, id3: string, id4: string){
    this.authService.switchContainer(id1, id2, id3, id4);
  }

}
