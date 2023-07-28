import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-userlockedmessage',
  templateUrl: './userlockedmessage.component.html',
  styleUrls: ['./userlockedmessage.component.scss']
})
export class UserlockedmessageComponent {

  constructor(private messageService: MessageService) {}

  checkedUserLockedMessage(){
    this.messageService.checkedUserLockedMessage();
  }

}
