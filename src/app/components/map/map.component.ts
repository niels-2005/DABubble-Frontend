import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { tileLayer, LatLngTuple, marker, Map, Layer, Icon, LeafletMouseEvent, Marker } from 'leaflet';
import { MapService } from 'src/app/services/map.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { UserstatusService } from 'src/app/services/userstatus.service';
import { UserprofilesService } from 'src/app/services/userprofiles.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {

  map?: Map;
  layers: Layer[] = [];  // Hier werden die Marker gespeichert
  allUsersData: any[] = []; // Hier werden alle Benutzerdaten gespeichert

  filterForm: FormGroup;

  numbers: number[] = Array.from({length: 28}, (_, i) => i + 1);
  selectedNumber: number | null = null;
  selectedModules: number[] = this.numbers;

  user_type = "";

  fullNameGuest = localStorage.getItem('full_name');

  displayNumbers: number[] = Array.from({length: 28}, (_, i) => i + 1);

  private subscriptions: Subscription = new Subscription();

  constructor(private mapService: MapService, private fb: FormBuilder, private userStatusService: UserstatusService, private userProfileService: UserprofilesService) {
    this.filterForm = this.fb.group({
      mentor: [true],
      schuler: [true],
      alumni: [true],
      com_manager: [true],
      frontend: [true],
      backend: [true],
      fullstack: [true],
      modules: [this.numbers],
      searchingJob: [false]
    });
  }

  async ngOnInit(): Promise<void> {
    this.userStatusService.checkIfUserIsAuthenticated();
    this.getUserInformations();
    this.subscriptions.add(
      this.mapService.mapRefreshNeeded.subscribe(async () => {
        await this.getAndChangeUserMapInfos();
        console.log('Refreshed!');
      })
    );
    await this.getAndChangeUserMapInfos();
}


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUserInformations(){
    this.subscriptions.add(
      this.userProfileService.profileData$.subscribe((data: any) => {
        if (data) {
          this.updateProfileData(data);
        }
      })
    );
  }

  private updateProfileData(result: any) {
    this.user_type = result.user_type;
  }

  async getAndChangeUserMapInfos(){
    let userData;
    if(this.fullNameGuest === 'Guest') {
      userData = await this.mapService.getUserMapInfosForGuest();
  } else {
      userData = await this.mapService.getUserMapInfos();
  }
    if (Array.isArray(userData)) {
      this.allUsersData = userData;
      this.addMarkersToMap(this.allUsersData);
    }
    this.filterForm.valueChanges.subscribe(() => {
      this.updateMapBasedOnFilters();
    });
  }

  updateMapBasedOnFilters() {
    this.layers.forEach(layer => this.map?.removeLayer(layer));
    this.layers = [];
    this.addMarkersToMap(this.allUsersData);
  }

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoomAnimation: true,
    zoom: 6.5,
    zoomSnap: 0.99,
    zoomDelta: 0.5,
    center: <[number, number]>[51.1657, 10.4515]
  };

  getIconUrlByUserType(userType: string): string {
    switch (userType) {
      case 'Mentor':
        return './assets/img/red-marker.png';
      case 'Schüler':
        return './assets/img/green-marker.png';
      case 'Alumni':
        return './assets/img/blue-marker.png';
      case 'Community Manager':
        return './assets/img/black-marker.png';
      default:
        return './assets/img/green-marker.png';
    }
  }

  createCustomIcon(iconUrl: string): Icon {
    return new Icon({
      iconUrl: iconUrl,
      iconSize: [25, 25],
      iconAnchor: [0, 0],
    });
  }

  onMapReady(map: Map) {
    this.map = map;
    this.addMarkersToMap(this.allUsersData); // Die Benutzerdaten beim Laden der Karte hinzufügen
  }

  addMarkersToMap(userData?: any[]) {
    this.clearAllMarkers();
    if (!userData || !this.map) return;

    const filters = this.filterForm.value;

    const filteredData = userData.filter(user => {
        switch(user.user_type) {
            case 'Mentor':
                if (!filters.mentor) return false;
                break;
            case 'Schüler':
                if (!filters.schuler) return false;
                break;
            case 'Alumni':
                if (!filters.alumni) return false;
                break;
            case 'Community Manager':
                if (!filters.com_manager) return false;
                break;
            default:
                return false;
        }

        if (user.course && !filters[user.course.toLowerCase()]) return false;

        if (user.module && !filters.modules.includes(user.module)) return false;

        if (filters.searchingJob && !user.searching_job) return false;

        return true;
    });

    filteredData.forEach(user => {
        const iconUrl = this.getIconUrlByUserType(user.user_type);
        const customIcon = this.createCustomIcon(iconUrl);
        const m = marker([user.latitude, user.longitude], { icon: customIcon })
            .bindTooltip(`${user.user} (${user.user_type})`)
            .addTo(this.map!)
            .on('click', (event: LeafletMouseEvent) => this.zoomToMarker(event));
        this.layers.push(m);
    });
}

  clearAllMarkers() {
    this.layers.forEach(layer => this.map?.removeLayer(layer));
    this.layers = [];
}

zoomToMarker(event: LeafletMouseEvent) {
  const clickedMarker: Marker = event.target;
  const userData = this.allUsersData.find(user =>
      user.latitude === clickedMarker.getLatLng().lat && user.longitude === clickedMarker.getLatLng().lng
  );

  if (userData) {
    const popupContent = this.returnPopupContentHTML(userData);
    clickedMarker.unbindPopup();
    clickedMarker.bindPopup(popupContent).openPopup();
  }
  this.map?.flyTo(clickedMarker.getLatLng(), 13, { duration: 0.5 });

}

returnPopupContentHTML(userData: any): string {
  const userImage = this.getUserImage(userData);
  const searchingJob = this.getSearchingJob(userData);
  const courseAndModule = this.getCourseAndModule(userData);
  const email = this.getEmail(userData);
  const about = this.getAbout(userData);
  const websiteLink = this.getWebsiteLink(userData);

  return `
    <div class="popup-content">
        <h2 class="user-name">${userData.user} (${userData.user_type})</h2>
        ${userImage}
        ${searchingJob}
        ${courseAndModule}
        ${email}
        ${about}
        ${websiteLink}
    </div>
  `;
}

getUserImage(userData: any): string {
  if (userData.image_url) {
    return `<img class="user-image" src="${userData.image_url}" alt="User Image">`;
  }
  return '';
}

getSearchingJob(userData: any): string {
  if (userData.searching_job === true) {
    return `
      <div class="active-jobsearch-container">
        <img src="./assets/img/laptop.png">
        <span>Aktiv auf Jobsuche</span>
      </div>`;
  }
  return '';
}

getCourseAndModule(userData: any): string {
  if (userData.user_type === 'Schüler' && userData.course && userData.module) {
    return `<p class="user-about"><b>${userData.course}</b> in Modul <b>${userData.module}</b></p>`;
  } else if (userData.user_type === 'Alumni' && userData.course){
    return `<p class="user-about"><b>${userData.course}</b> erfolgreich abgeschlossen</p>`;
  }
  return '';
}

getEmail(userData: any): string {
  if (userData.email) {
    return `<p class="user-email">${userData.email}</p>`;
  }
  return '';
}

getAbout(userData: any): string {
  if (userData.about) {
    return `<p class="user-about">${userData.about}</p>`;
  }
  return '';
}

getWebsiteLink(userData: any): string {
  if (userData.website && userData.website !== '') {
    return `<a href="${userData.website}" class="user-website" target="_blank" rel="noopener noreferrer">Portfolio</a>`;
  }
  return '';
}

//      <button class="user-button">Nachricht schreiben</button>

  toggleCheckbox(controlName: string) {
    const currentVal = this.filterForm.get(controlName)?.value;
    this.filterForm.get(controlName)?.setValue(!currentVal);
  }

  selectNumber(num: number) {
    this.selectedNumber = num;
  }

  toggleModule(moduleNumber: number) {
    if (this.selectedModules.includes(moduleNumber)) {
        const index = this.selectedModules.indexOf(moduleNumber);
        this.selectedModules.splice(index, 1);
    } else {
        this.selectedModules.push(moduleNumber);
    }
    this.filterForm.get('modules')?.setValue(this.selectedModules);
}


}
