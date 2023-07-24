import { Component } from '@angular/core';

@Component({
  selector: 'app-workspacecontentleft',
  templateUrl: './workspacecontentleft.component.html',
  styleUrls: ['./workspacecontentleft.component.scss']
})
export class WorkspacecontentleftComponent {


  editWorkspaceSrc = './assets/img/edit-workspace-black.png'

  showChannels(){
    document.getElementById('all-channels')?.classList.toggle('d-none');
  }

}
