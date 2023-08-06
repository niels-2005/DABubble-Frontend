import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { tileLayer, LatLngTuple, marker, Map, Layer, Icon, LeafletMouseEvent, Marker } from 'leaflet';
import { MapService } from 'src/app/services/map.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

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

  private subscriptions: Subscription = new Subscription();

  constructor(private mapService: MapService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      mentor: [true],
      schuler: [true],
      alumni: [true]
    });
  }

  async ngOnInit(): Promise<void> {
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

  async getAndChangeUserMapInfos(){
    const userData = await this.mapService.getUserMapInfos();
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
    zoom: 6.5,
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
      default:
        return './assets/img/red-marker.png';
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
          return filters.mentor;
        case 'Schüler':
          return filters.schuler;
        case 'Alumni':
          return filters.alumni;
        default:
          return false;
      }
    });

    filteredData.forEach(user => {
      const iconUrl = this.getIconUrlByUserType(user.user_type);
      const customIcon = this.createCustomIcon(iconUrl);
      const m = marker([user.latitude, user.longitude], { icon: customIcon })
        .bindTooltip(`${user.user.split(' ')[0]} (${user.user_type})`)
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
    const marker: Marker = event.target;
    this.map?.setView(marker.getLatLng(), 15);
  }

  toggleCheckbox(controlName: string) {
    const currentVal = this.filterForm.get(controlName)?.value;
    this.filterForm.get(controlName)?.setValue(!currentVal);
  }


}
