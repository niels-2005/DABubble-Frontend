import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChannelsService } from 'src/app/services/channels.service';
import { UserprofilesService } from 'src/app/services/userprofiles.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private channelService: ChannelsService, private userProfileService: UserprofilesService) {}

  private subscription: Subscription = new Subscription();

  channelData: any = { messages: [], details: {} };

  messageContent: string = "";

  currentUser = localStorage.getItem('full_name');
  currentUserType = "";

  currentChannel: string = "";

  lastDisplayedDate: string = '';

  @ViewChild('messagesContainer') public messagesContainer!: ElementRef;

  ngOnInit(): void {
    this.getUserInformations();
    this.subscribeToChannelContent();
    this.subscribeToNewMessagesContent();
  }

    getUserInformations(){
    this.subscription.add(
      this.userProfileService.profileData$.subscribe(data => {
        if (data) {
          this.updateProfileData(data);
        }
      })
    );
  }

    private updateProfileData(result: any) {
    this.currentUserType = result.user_type
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
      this.currentChannel = content.details.name;
      console.log('Aktueller Channel', this.currentChannel);
      this.channelData = content;
      this.initializeMessagesDisplayDate(content.messages);
      this.scrollToBottom();
    });
  }

  subscribeToNewMessagesContent(){
    this.subscription.add(
      this.channelService.newMessage$.subscribe(newMessage => {
        if (newMessage && this.channelData.messages) {
          this.channelData.messages.push(newMessage);
          this.scrollToBottom();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  scrollToBottom(): void {
    setTimeout(() => {
        try {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        } catch(err) {
            console.error("Scrolling error:", err);
        }
    }, 0);
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

get firstFiveMembersWithImageAndName() {
  return this.channelData.details.members
    ?.filter((member: any) => member.image_url !== null && member.full_name !== null)
    .slice(0, 5);
}

openSitebarRenderedMembersData() {
  document.getElementById('all-member-rendered-data')?.classList.remove('d-none');
  document.getElementById('unseen-background-container')?.classList.remove('d-none');
}

closeSitebarRenderedMembersData() {
  document.getElementById('all-member-rendered-data')?.classList.add('d-none');
  document.getElementById('unseen-background-container')?.classList.add('d-none');
}

hasWritePermission(): boolean {
  if (this.currentUserType === 'Community Manager' || this.currentUserType === 'Mentor') {
      return true;
  }
  return false;
}



}
