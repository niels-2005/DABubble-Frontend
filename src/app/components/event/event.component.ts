import { Component } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {

  eventTitle: string = ""
  eventDate: string = "";
  eventStartTime: string = "";
  eventEndTime: string = "";
  eventLocationPLZ: string = "";
  eventLocationCity: string = "";
  eventLocationStreet: string = "";
  eventLocationHouseNumber: string = "";
  eventDescription: string = "";
  userId = localStorage.getItem('user_id');

  eventOrganisator = localStorage.getItem('full_name');

  token = localStorage.getItem('token');

  eventTitleError: string = "";
  eventPLZError: string = "";
  eventCityError: string = "";
  eventStreetError: string = "";
  eventHouseNumberError: string = "";
  eventDescriptionError: string = "";

  async createEvent(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "title": this.eventTitle,
      "date": this.eventDate,
      "start_time": this.eventStartTime,
      "end_time": this.eventEndTime,
      "location_plz": this.eventLocationPLZ,
      "location_city": this.eventLocationCity,
      "location_street": this.eventLocationStreet,
      "location_house_number": this.eventLocationHouseNumber,
      "description": this.eventDescription,
      "organisator": this.userId,
      "organisatorName": this.eventOrganisator,
    });

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    // const resp = await fetch("http://127.0.0.1:8000/events/create/", requestOptions)
    const resp = await fetch("https://celinemueller.pythonanywhere.com/events/create/", requestOptions);

    if(resp.ok) {
      const result = await resp.json();
      console.log(result);
    } else {
      const error = await resp.json();
      console.log('error', error);
      this.showErrors(error);
    }
}

  showErrors(error: any){
    this.eventTitleError = error.title;
    this.eventPLZError = error.location_plz;
    this.eventCityError = error.location_street;
    this.eventStreetError = error.location_street;
    this.eventHouseNumberError = error.location_house_number;
    this.eventDescriptionError = error.description;
  }

  enableCreateEventButton(): boolean {
    return this.eventTitle.length >= 5 &&
      this.eventDate !== "" &&
      this.eventStartTime !== "" &&
      this.eventEndTime !== "" &&
      this.eventLocationPLZ !== "" &&
      this.eventLocationCity !== "" &&
      this.eventLocationStreet !== "" &&
      this.eventLocationHouseNumber !== "" &&
      (this.eventDescription.split(" ").length >= 15) &&
      this.userId !== null;
  }


}
