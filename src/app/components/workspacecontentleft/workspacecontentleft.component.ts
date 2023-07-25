import { Component } from '@angular/core';

@Component({
  selector: 'app-workspacecontentleft',
  templateUrl: './workspacecontentleft.component.html',
  styleUrls: ['./workspacecontentleft.component.scss']
})
export class WorkspacecontentleftComponent {


  editWorkspaceSrc = './assets/img/edit-workspace-black.png'

  showCreateChannelSrc = './assets/img/plus-symbol-black.png'

  showChannels(){
    document.getElementById('all-channels')?.classList.toggle('d-none');
  }

  showCreateChannelContainer(){
    document.getElementById('create-channel-opacity-background')?.classList.remove('d-none');
    document.getElementById('create-channel-container')?.classList.remove('d-none');
  }

  hideCreateChannelContainer(){
    document.getElementById('create-channel-opacity-background')?.classList.add('d-none');
    document.getElementById('create-channel-container')?.classList.add('d-none');
  }

}
