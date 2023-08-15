import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelsService } from 'src/app/services/channels.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private channelService: ChannelsService) {}

  private subscription: Subscription = new Subscription();

  channelData: any = { messages: [], details: {} };

  messageContent: string = "";

  currentUser = localStorage.getItem('full_name');

  lastDisplayedDate: string = '';

  ngOnInit(): void {
    console.log(this.currentUser);
    this.subscribeToChannelContent();
    this.subscribeToNewMessagesContent();
  }

  subscribeToChannelContent(){
    this.subscription.add(
      this.channelService.selectedChannelId$.subscribe(channelId => {
        if (channelId !== null) {
          this.loadChannelContent();
          console.log(channelId, "ausgeführt!");
        }
      })
    );
  }

  loadChannelContent() {
    this.channelService.loadChannelContent().subscribe(content => {
      console.log('Channel Daten', content);
      this.channelData = content;
      this.initializeMessagesDisplayDate(content.messages);
    });
  }

  subscribeToNewMessagesContent(){
    this.subscription.add(
      this.channelService.newMessage$.subscribe(newMessage => {
        if (newMessage && this.channelData.messages) {
          this.channelData.messages.push(newMessage);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initializeMessagesDisplayDate(messages: any[]): void {
    let lastDisplayedDate = '';

    for (const message of messages) {
        const messageDate = this.formatDate(message.timestamp);

        if (messageDate !== lastDisplayedDate) {
            lastDisplayedDate = messageDate;
            message.displayDate = true;
        } else {
            message.displayDate = false;
        }
    }
}


  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
  };
    return date.toLocaleDateString('de-DE', options);
  }


  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
}

createNewMessage(){
  this.channelService.createNewMessage(this.messageContent);
  this.messageContent = "";
}

get firstThreeMembers() {
  return this.channelData.details.members?.slice(0, 3);
}

}
