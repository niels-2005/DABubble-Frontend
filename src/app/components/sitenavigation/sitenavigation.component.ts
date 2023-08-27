import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ChannelsService } from 'src/app/services/channels.service';
import { Subscription } from 'rxjs';
import { UserprofilesService } from 'src/app/services/userprofiles.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-sitenavigation',
  templateUrl: './sitenavigation.component.html',
  styleUrls: ['./sitenavigation.component.scss']
})
export class SitenavigationComponent implements OnInit {

  constructor(public channelService: ChannelsService, private userProfileService: UserprofilesService, private mapService: MapService) {}

  channels: any;

  selectedChannelId: any = null;

  user_type: string = "";

  userFullName = localStorage.getItem('full_name');

  eventData: any[] = [];

  isOrganisatorOfEvent: boolean = false;


  @Output() switchView = new EventEmitter<string>();

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.channelService.getAllChannels().subscribe(data => {
      this.channels = data;
    }, error => {
      console.log('error', error);
    });
    this.getUserInformations();
    this.mapService.eventData$.subscribe(data => {
      this.eventData = data;
      this.isOrganisatorOfEvent = this.eventData.some(event => event.organisatorName === this.userFullName);
      console.log('Eventdaten in Sitenavigation', this.eventData);
  });

  }

  getUserInformations(){
    this.subscriptions.push(
      this.userProfileService.profileData$.subscribe(data => {
        if (data) {
          this.updateProfileData(data);
        }
      })
    );
  }

  private updateProfileData(result: any) {
    this.user_type = result.user_type
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

  switchToStatistics(){
    this.switchView.emit('statistics');
  }

  switchToEvent(){
    this.switchView.emit('event');
  }

  clearSelectedChannel() {
    this.selectedChannelId = null;
}


}
