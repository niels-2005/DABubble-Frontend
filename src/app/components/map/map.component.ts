import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { tileLayer, LatLngTuple, marker, Map, Layer, Icon, LeafletMouseEvent, LatLng, Marker } from 'leaflet';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {

  map?: Map;
  layers: Layer[] = [];  // Hier werden die Marker gespeichert

  constructor(private mapService: MapService) { }


  async ngOnInit(): Promise<void> {
    const userData = await this.mapService.getUserMapInfos();
    if (Array.isArray(userData)) {
      this.addMarkersToMap(userData);
    }
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
    this.addMarkersToMap();
  }


  addMarkersToMap(userData?: any[]) {
    if (!userData || !this.map) return;

    userData.forEach(user => {
      const iconUrl = this.getIconUrlByUserType(user.user_type);
      const customIcon = this.createCustomIcon(iconUrl);
      const m = marker([user.latitude, user.longitude], { icon: customIcon })
        .bindTooltip(`${user.user.split(' ')[0]} (${user.user_type})`)
        .addTo(this.map!)
        .on('click', (event: LeafletMouseEvent) => this.zoomToMarker(event));
      this.layers.push(m);
    });
  }


  zoomToMarker(event: LeafletMouseEvent) {
    const marker: Marker = event.target;
    this.map?.setView(marker.getLatLng(), 15);
  }
}
