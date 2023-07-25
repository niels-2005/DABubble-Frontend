import { Component } from '@angular/core';

@Component({
  selector: 'app-workspaceheadercontent',
  templateUrl: './workspaceheadercontent.component.html',
  styleUrls: ['./workspaceheadercontent.component.scss']
})
export class WorkspaceheadercontentComponent {

  showProfileLogoutContainer(){
    document.getElementById('opacity-background')?.classList.remove('d-none');
    document.getElementById('profile-logout')?.classList.remove('d-none');
  }

  hideProfileLogoutContainer(){
    document.getElementById('opacity-background')?.classList.add('d-none');
    document.getElementById('profile-logout')?.classList.add('d-none');
  }

  showProfileDetailsContainer(){
    document.getElementById('opacity-background-profile-details')?.classList.remove('d-none');
    document.getElementById('profile-details')?.classList.remove('d-none');
  }

  hideProfileDetailsContainer(){
    document.getElementById('opacity-background-profile-details')?.classList.add('d-none');
    document.getElementById('profile-details')?.classList.add('d-none');
    document.getElementById('edit-profile')?.classList.add('d-none');
  }

  showEditProfileContainer(){
    document.getElementById('profile-details')?.classList.add('d-none');
    document.getElementById('edit-profile')?.classList.remove('d-none');
  }


}
