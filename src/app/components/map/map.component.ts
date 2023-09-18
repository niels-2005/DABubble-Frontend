import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { tileLayer, LatLngTuple, marker, Map, Layer, Icon, LeafletMouseEvent, Marker, icon } from 'leaflet';
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
  eventLayers: Layer[] = [];
  allUsersData: any[] = []; // Hier werden alle Benutzerdaten gespeichert
  filterForm: FormGroup;
  numbers: number[] = Array.from({length: 28}, (_, i) => i + 1);
  selectedNumber: number | null = null;
  selectedModules: number[] = this.numbers;
  user_type = "";
  fullName = localStorage.getItem('full_name');
  displayNumbers: number[] = Array.from({length: 28}, (_, i) => i + 1);
  eventData: any[] = [];
  token = localStorage.getItem('token');
  userId = localStorage.getItem('user_id');
  private lastClickedMarker?: L.Marker;

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoomAnimation: true,
    zoom: 6,
    zoomSnap: 0.99,
    zoomDelta: 0.5,
    center: <[number, number]>[51.1657, 10.4515]
  };

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
      searchingJob: [false],
      event: [true],
    });
  }

  async ngOnInit(): Promise<void> {
    this.userStatusService.checkIfUserIsAuthenticated();
    this.getUserInformations();
    this.checkIfMapNeedsRefreshed();
    this.getAndChangeUserMapInfos();
    (window as any).zoomFromPopup = this.zoomFromPopup.bind(this);
}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    delete (window as any).zoomFromPopup;
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

  checkIfMapNeedsRefreshed(){
    this.subscriptions.add(
      this.mapService.mapRefreshNeeded.subscribe(async () => {
        await this.getAndChangeUserMapInfos();
      })
    );
  }

  async getAndChangeUserMapInfos(){
    let userData;
    let eventData;
    if(this.fullName === 'Guest') {
      userData = await this.mapService.getUserMapInfosForGuest();
  } else {
      userData = await this.mapService.getUserMapInfos();
      eventData = await this.mapService.getEvents();
      this.checkIfEvent(eventData);
      this.checkUserDataArrayAndAddMarkersToMap(userData);
  }
    this.checkMapFilter();
  }

  checkIfEvent(eventData: any){
    if (eventData && eventData.length > 0) {
      this.eventData = eventData;
      for (let event of this.eventData) {
        this.addEventToMap(event);
    }
  }
  }

  checkUserDataArrayAndAddMarkersToMap(userData: any){
    if (Array.isArray(userData)) {
      this.allUsersData = userData;
      this.addMarkersToMap(this.allUsersData);
    }
  }

  checkMapFilter(){
    this.filterForm.valueChanges.subscribe(() => {
      this.clearEventLayerAndRefreshMapBecauseFilter();
      this.clearUserLayerAndRefreshMapBecauseFilter();
    });
  }

  clearUserLayerAndRefreshMapBecauseFilter(){
    this.layers.forEach(layer => this.map?.removeLayer(layer));
    this.layers = [];
    this.addMarkersToMap(this.allUsersData);
  }

  clearEventLayerAndRefreshMapBecauseFilter(){
    this.eventLayers.forEach(eventLayer => this.map?.removeLayer(eventLayer));
    this.eventLayers = [];
    this.addEventToMap(this.eventData[0]);
  }

  onMapReady(map: Map) {
    this.map = map;
    this.addMarkersToMap(this.allUsersData);
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

  clearAllMarkers() {
    this.layers.forEach(layer => this.map?.removeLayer(layer));
    this.layers = [];
}

zoomFromPopup() {
  const clickedMarker = this.lastClickedMarker;
  if (clickedMarker) {
    this.flyToMarker(clickedMarker);
  }
}

zoomToMarker(event: LeafletMouseEvent) {
  const clickedMarker: Marker = event.target;

  this.lastClickedMarker = clickedMarker;

  this.map?.closePopup();

  const userData = this.allUsersData.find(user =>
      user.latitude === clickedMarker.getLatLng().lat && user.longitude === clickedMarker.getLatLng().lng
  );

  if (userData) {
    const popupContent = this.returnPopupContentHTML(userData, clickedMarker);
    clickedMarker.unbindPopup();
    clickedMarker.bindPopup(popupContent).openPopup();
  }
}


returnPopupContentHTML(userData: any, clickedMarker: any): string {
  const isCommunityMember = this.getCommunityLogo(userData);
  const userImage = this.getUserImage(userData);
  const searchingJob = this.getSearchingJob(userData);
  const courseAndModule = this.getCourseAndModule(userData);
  const email = this.getEmail(userData);
  const about = this.getAbout(userData);
  const websiteLink = this.getWebsiteLink(userData);

  return `
    <div class="popup-content">
        ${isCommunityMember}
        <h2 class="user-name"> ${userData.user} (${userData.user_type})</h2>
        ${userImage}
        ${searchingJob}
        ${courseAndModule}
        ${email}
        ${about}
        ${websiteLink}
        <button id="zoomToMarkerButton" class="zoom-button" onclick="zoomFromPopup()">Zum Marker</button>
    </div>
  `;
}

flyToMarker(clickedMarker: any){
  this.map?.flyTo(clickedMarker.getLatLng(), 13, { duration: 0.5 });
}

getCommunityLogo(userData: any){
  if(userData.community_member == true){
    return `<img src="./assets/img/da-community-icon.png" class="community-icon-image">`
  }
  return "";
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

// Events Content

  addEventToMap(eventData: any) {
    const eventFilterValue = this.filterForm.get('event')?.value;
    if (!eventData || !this.map || !eventFilterValue) return;

    const eventIconUrl = './assets/img/da-community-icon.png';
    const eventIcon = this.createEventIcon(eventIconUrl);
    const eventMarker = marker([eventData.latitude, eventData.longitude], { icon: eventIcon })
        .bindTooltip(`${eventData.title} (Event)`)
        .addTo(this.map)
        .on('click', (event: LeafletMouseEvent) => this.zoomToEventMarker(event));
    this.eventLayers.push(eventMarker);
}

createEventIcon(iconUrl: string): Icon {
  return icon({
    iconUrl: iconUrl,
    iconSize: [40, 40],
    iconAnchor: [0, 0],
    className: 'animated-icon'
  });
}

zoomToEventMarker(event: LeafletMouseEvent) {
  const clickedMarker: Marker = event.target;
  this.lastClickedMarker = clickedMarker;
  const eventData = this.eventData.find(ev =>
      ev.latitude === clickedMarker.getLatLng().lat && ev.longitude === clickedMarker.getLatLng().lng
  );

  if (eventData) {
      this.setPopupContent(clickedMarker, eventData);

      setTimeout(() => {
          this.joinEventButtonFunctionality(eventData);
          this.leaveEventButtonFunctionality(eventData);
          this.toggleParticipantsList();
          this.cancelTheEvent(eventData);
          this.changeEventInfo(eventData);
          this.toggleInformationContainer(eventData);
      }, 0);
  }
}

setPopupContent(clickedMarker: Marker, eventData: any) {
  const popupContent = this.returnEventPopupContentHTML(eventData);
  clickedMarker.unbindPopup();
  clickedMarker.bindPopup(popupContent).openPopup();
}

joinEventButtonFunctionality(eventData: any) {
  const joinEventButton = document.getElementById(`joinEventButton_${eventData.id}`);
  joinEventButton?.addEventListener('click', () => {
      this.joinEvent(eventData.id);
  });
}

leaveEventButtonFunctionality(eventData: any) {
  const buttonId = `leaveEventButton_${eventData.id}`;
  const button = document.getElementById(buttonId);

  if (button) {
    button.addEventListener('click', () => {
      this.leaveEvent(eventData.id);
    });
  }
}

toggleParticipantsList() {
  const toggleParticipants = document.getElementById('toggle-participants');
  const backToInfo = document.getElementById('back-to-info');

  const toggleContentVisibility = () => {
      const contentInfo = document.getElementById('popup-content-informations');
      const contentParticipants = document.getElementById('popup-content-participants');

      if (contentInfo && contentParticipants) {
          contentInfo.classList.toggle('d-none');
          contentParticipants.classList.toggle('d-none');
      }
  };

  toggleParticipants?.addEventListener('click', toggleContentVisibility);
  backToInfo?.addEventListener('click', toggleContentVisibility);
}

cancelTheEvent(eventData: any) {
  const cancelEventButton = document.getElementById(`cancelEventButton_${eventData.id}`);
  const confirmCancelContainer = document.getElementById('confirmCancelContainer');
  const eventCrudButtonContainer = document.getElementById('crudButtonContainer');

  cancelEventButton?.addEventListener('click', () => {
      if (eventCrudButtonContainer && confirmCancelContainer) {
          eventCrudButtonContainer.classList.add('d-none');
          confirmCancelContainer.classList.remove('d-none');
      }
  });

  const cancelConfirmEventButton = document.getElementById(`cancelConfirmEventButton_${eventData.id}`);
  cancelConfirmEventButton?.addEventListener('click', () => {
      this.cancelEvent(eventData.id);
  });
}

changeEventInfo(eventData: any) {
  const eventId = eventData.id;
  const saveChangesButton = document.getElementById(`saveChangesButton_${eventId}`);
  saveChangesButton?.addEventListener('click', () => {
      const updatedEventData = {
          id: eventId,  // Event-ID hinzufügen
          title: (<HTMLInputElement>document.getElementById('eventTitleInput')).value,
          description: (<HTMLInputElement>document.getElementById('eventDescriptionInput')).value,
          date: (<HTMLInputElement>document.getElementById('eventDateInput')).value,
          start_time: (<HTMLInputElement>document.getElementById('eventStartTimeInput')).value,
          end_time: (<HTMLInputElement>document.getElementById('eventEndTimeInput')).value,
          location_plz: (<HTMLInputElement>document.getElementById('eventPlzInput')).value,
          location_city: (<HTMLInputElement>document.getElementById('eventCityInput')).value,
          location_street: (<HTMLInputElement>document.getElementById('eventStreetInput')).value,
          location_house_number: (<HTMLInputElement>document.getElementById('eventHouseNumberInput')).value
      };
      this.changeEventInformations(updatedEventData);
  });
}

toggleInformationContainer(eventData: any) {
  const changeEventButton = document.getElementById(`changeEventButton_${eventData.id}`);
  changeEventButton?.addEventListener('click', () => {
      const popupContentInformations = document.getElementById('popup-content-informations');
      const popupContentChangeInformations = document.getElementById('popup-content-change-informations');

      if (popupContentInformations && popupContentChangeInformations) {
          popupContentInformations.classList.add('d-none');
          popupContentChangeInformations.classList.remove('d-none');
      }
  });
}

returnEventPopupContentHTML(eventData: any): string {
  const formattedDate = this.formatDate(eventData.date);
  const joinEventButton = this.getJoinEventButton(eventData);
  const leaveEventButton = this.getLeaveEventButton(eventData);
  const changeEventButton = this.getChangeEventButton(eventData);
  const cancelEventButton = this.getCancelEventButton(eventData);
  const eventType = this.checkEventType(eventData);
  const totalParticipants = eventData.participants.length + 1;

  let participantsList = `<div class="user-about"><b>1.</b> ${eventData.organisatorName} (Organisator)</div>`;

  for (let i = 0; i < eventData.participants.length; i++) {
    participantsList += `<div class="user-about"><b>${i + 2}.</b> ${eventData.participants[i].full_name}</div>`;
  }

  if(eventData.is_cancelled == true) {
    return `
    <div id="eventPopupContainer">
        <div class="popup-content" id="popup-content-informations">
            <h2>${eventData.title} <span>(abgesagt!)</span></h2>
            <p class="user-about">${formattedDate}</p>
            <p class="user-about"><b>Start:</b> ${eventData.start_time} <b>Ende:</b> ${eventData.end_time}</p>
            <p class="user-about"><b>Organisiert von:</b> ${eventData.organisatorName}</p>
        </div>
      </div>
    `;
  } else {
    return `
    <div>
        <div class="popup-content" id="popup-content-informations">
            <h2>${eventData.title} ${eventType}</h2>
            <p class="user-about">${eventData.description}</p>
            <p class="user-about">${formattedDate}</p>
            <p class="user-about"><b>Start:</b> ${eventData.start_time} <b>Ende:</b> ${eventData.end_time}</p>
            <p class="user-about"><b>PLZ, Stadt:</b> ${eventData.location_plz} ${eventData.location_city}</p>
            <p class="user-about"><b>Straße, Hausnr.:</b> ${eventData.location_street} ${eventData.location_house_number}</p>
            <p class="user-about"><b>Organisiert von:</b> ${eventData.organisatorName}</p>
            <p class="event-participants" id="toggle-participants">Teilnehmer : ${totalParticipants}</p>
            <div class="event-join-button-container">
              ${joinEventButton} ${leaveEventButton}
            </div>
            <div class="event-crud-button-container" id="crudButtonContainer">
              ${changeEventButton} ${cancelEventButton}
            </div>
            <div class="event-sure-button-container d-none"  id="confirmCancelContainer">
              <button id="cancelConfirmEventButton_${eventData.id}">Sicher?</button>
            </div>
            <button id="zoomToMarkerButton" class="zoom-button" onclick="zoomFromPopup()">Zum Marker</button>
        </div>
          <div class="d-none position-relative-popup" id="popup-content-participants">
          <img src="./assets/img/arrow-back-black.png" id="back-to-info">
          <h2 class="participants-list-headline">Alle Teilnehmer</h2>
          <div class="popup-content-participants">
          ${participantsList}
          </div>
          </div>
          <div class="popup-content-change-informations d-none" id="popup-content-change-informations">
              <input type="text" value="${eventData.title}" id="eventTitleInput" placeholder="Event Titel"/>
              <textarea id="eventDescriptionInput" placeholder="Beschreibung">${eventData.description}</textarea>
              <input type="date" value="${eventData.date}" id="eventDateInput" placeholder="Datum"/>
              <div class="start-end-time-container">
            <div>
              <label><b>Start:</b></label>
              <input type="time" value="${eventData.start_time}" id="eventStartTimeInput" placeholder="Startzeit"/>
            </div>
            <div>
              <label><b>Ende:</b></label>
              <input type="time" value="${eventData.end_time}" id="eventEndTimeInput" placeholder="Endzeit"/>
          </div>
          </div>
          <input type="text" value="${eventData.location_plz}" id="eventPlzInput" placeholder="PLZ"/>
          <input type="text" value="${eventData.location_city}" id="eventCityInput" placeholder="Stadt"/>
          <input type="text" value="${eventData.location_street}" id="eventStreetInput" placeholder="Straße"/>
          <input type="text" value="${eventData.location_house_number}" id="eventHouseNumberInput" placeholder="Hausnummer"/>
          <p class="user-about"><b>Organisiert von:</b> ${eventData.organisatorName}</p>
          <button id="saveChangesButton_${eventData.id}" data-id="${eventData.id}">Änderungen speichern</button>
        </div>
      </div>
    `;
  }
}

formatDate(inputDate: string): string {
  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni",
                      "Juli", "August", "September", "Oktober", "November", "Dezember"];

  const [year, month, day] = inputDate.split('-');

  return `Wann? <b>${parseInt(day)}. ${monthNames[parseInt(month) - 1]} ${year}</b>`;
}


getJoinEventButton(eventData: any): string {
  const isParticipant = eventData.participants.some((participant: any) => participant.full_name === this.fullName);

  if (eventData.organisatorName !== this.fullName && !isParticipant) {
    return `<button id="joinEventButton_${eventData.id}" class="joinEventButton">Trag mich ein!</button>`;
  }

  return "";
}

getLeaveEventButton(eventData: any) {
  const isParticipant = eventData.participants.some((participant: any) => participant.full_name === this.fullName);

  if (eventData.organisatorName !== this.fullName && isParticipant) {
    return `<button id="leaveEventButton_${eventData.id}" class="joinEventButton">Trag mich aus!</button>`;
  }
  return "";
}

getChangeEventButton(eventData: any){
  if(this.fullName === eventData.organisatorName) {
    return `<button id="changeEventButton_${eventData.id}" class="change-event-button">Event ändern?</button>`;
  }
  return "";
}

getCancelEventButton(eventData: any) {
  if(this.fullName === eventData.organisatorName) {
    return `<button id="cancelEventButton_${eventData.id}" class="cancel-event-button">Event absagen?</button>`;
  }
  return "";
}

checkEventType(event: any) {
  if(event.is_online === true) {
    return "(Online Event)"
  }
  return ""
}

async joinEvent(eventId: any){
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${this.token}`);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "user_id": this.userId
  });

  const requestOptions : RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  // await fetch(`http://127.0.0.1:8000/events/create/join/${eventId}/`, requestOptions)
  const resp = await fetch(`https://celinemueller.pythonanywhere.com/events/create/join/${eventId}/`, requestOptions)
  if (resp.ok) {
    const result = await resp.json();
    console.log(result);
    if (this.lastClickedMarker) {
      const popupContent = this.returnEventPopupContentHTML(result);
      this.lastClickedMarker.unbindPopup();
      this.lastClickedMarker.bindPopup(popupContent).openPopup();
  }
  } else {
    const error = await resp.json();
    console.log(error);
  }
}

async leaveEvent(eventId: any){
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${this.token}`);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "user_id": this.userId
  });

  const requestOptions : RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  // await fetch(`http://127.0.0.1:8000/events/create/join/${eventId}/`, requestOptions)
  const resp = await fetch(`https://celinemueller.pythonanywhere.com/events/create/leave/${eventId}/`, requestOptions)
  if (resp.ok) {
    const result = await resp.json();
    console.log(result);
    if (this.lastClickedMarker) {
      const popupContent = this.returnEventPopupContentHTML(result);
      this.lastClickedMarker.unbindPopup();
      this.lastClickedMarker.bindPopup(popupContent).openPopup();
  }
  } else {
    const error = await resp.json();
    console.log(error);
  }
}

async cancelEvent(eventId: any){
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${this.token}`);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "is_cancelled": true
  });

  const requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
  };

  const response = await fetch(`https://celinemueller.pythonanywhere.com/events/change/${eventId}/`, requestOptions)

  if(response.ok) {
    const result = await response.json();
    console.log(result);
    if (this.lastClickedMarker) {
      const popupContent = this.returnEventPopupContentHTML(result);
      this.lastClickedMarker.unbindPopup();
      this.lastClickedMarker.bindPopup(popupContent).openPopup();
  }
  } else {
    const error = await response.json();
    console.log(error);
  }
}

  async changeEventInformations(eventData: any){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "title": eventData.title,
      "date": eventData.date,
      "start_time": eventData.start_time,
      "end_time": eventData.end_time,
      "location_plz": eventData.location_plz,
      "location_city": eventData.location_city,
      "location_street": eventData.location_street,
      "location_house_number": eventData.location_house_number,
      "description": eventData.description
  });

    const requestOptions : RequestInit = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(`https://celinemueller.pythonanywhere.com/events/change/${eventData.id}/`, requestOptions);

    if(response.ok){
      const result = await response.json();
      console.log(result);
      if (this.lastClickedMarker) {
        const popupContent = this.returnEventPopupContentHTML(result);
        this.lastClickedMarker.unbindPopup();
        this.lastClickedMarker.bindPopup(popupContent).openPopup();
    }
    } else {
      const error = await response.json();
      console.log(error);
    }
  }

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
