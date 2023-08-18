import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ChannelsService } from 'src/app/services/channels.service';

@Component({
  selector: 'app-sitenavigation',
  templateUrl: './sitenavigation.component.html',
  styleUrls: ['./sitenavigation.component.scss']
})
export class SitenavigationComponent implements OnInit {

  constructor(public channelService: ChannelsService) {}

  channels: any;

  selectedChannelId: any = null;

  @Output() switchView = new EventEmitter<string>();

  ngOnInit(): void {
    this.channelService.getAllChannels().subscribe(data => {
      this.channels = data;
    }, error => {
      console.log('error', error);
    });
  }

  setSelectedChannelId(channelid: any){
    if(this.selectedChannelId === channelid) {
      return;
  }
    this.selectedChannelId = channelid;
    this.channelService.setSelectedChannelId(channelid);
    this.switchView.emit('chat');
  }

  switchToMap() {
    this.switchView.emit('map');
  }

  clearSelectedChannel() {
    this.selectedChannelId = null;
}


}
