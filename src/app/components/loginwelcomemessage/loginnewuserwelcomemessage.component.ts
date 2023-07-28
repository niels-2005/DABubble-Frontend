import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-loginnewuserwelcomemessage',
  templateUrl: './loginnewuserwelcomemessage.component.html',
  styleUrls: ['./loginnewuserwelcomemessage.component.scss']
})
export class LoginnewuserwelcomemessageComponent {

  constructor(private messageService: MessageService) {}

  checkedWelcomeMessage(){
    this.messageService.checkedWelcomeMessage();
  }

}
