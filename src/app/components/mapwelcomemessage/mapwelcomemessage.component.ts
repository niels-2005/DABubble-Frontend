import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-mapwelcomemessage',
  templateUrl: './mapwelcomemessage.component.html',
  styleUrls: ['./mapwelcomemessage.component.scss']
})
export class MapwelcomemessageComponent {

  constructor(private messageService: MessageService) {}

  closeMapDetails(){
    this.messageService.closeMapInformationsAtCompleteYourProfile();
  }

}
