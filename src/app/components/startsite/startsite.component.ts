import { Component } from '@angular/core';

export enum ViewType {
  MAP = 'map',
  CHAT = 'chat',
  STATISTICS = 'statistics',
  EVENT = 'event'
}

@Component({
  selector: 'app-startsite',
  templateUrl: './startsite.component.html',
  styleUrls: ['./startsite.component.scss']
})
export class StartsiteComponent {

  ViewType = ViewType;

  currentView: ViewType = ViewType.MAP;

  handleSwitchView(view: string) {
    this.currentView = view as ViewType;
  }
}
