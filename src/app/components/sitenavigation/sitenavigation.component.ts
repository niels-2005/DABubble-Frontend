import { Component, OnInit } from '@angular/core';
import { ChannelsService } from 'src/app/services/channels.service';

@Component({
  selector: 'app-sitenavigation',
  templateUrl: './sitenavigation.component.html',
  styleUrls: ['./sitenavigation.component.scss']
})
export class SitenavigationComponent implements OnInit {

  constructor(public channelService: ChannelsService) {}

  channels: any;

  ngOnInit(): void {
    this.channelService.getAllChannels().subscribe(data => {
      this.channels = data;
    }, error => {
      console.log('error', error);
    });
  }



}
