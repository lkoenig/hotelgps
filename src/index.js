"use strict";
import './css/hotel.scss';
import './css/softkey.scss';
import { distanceGreatCircle } from "./great_circle.js";

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 0,
  maximumAge: 0
};

const formatDegree = function (degree) {
  let d = Math.floor(degree);
  let m = (degree - d);
  return `${d}°${(m * 60).toFixed(3)}`;
};

const formatLatitude = function (latitude) {
  if (latitude > 0) {
    return `N ${formatDegree(latitude)}`;
  } else {
    return `S ${formatDegree(-latitude)}`;
  }
};

const formatLongitude = function (longitude) {
  if (longitude > 0) {
    return "E " + formatDegree(longitude);
  } else {
    return "W " + formatDegree(-longitude);
  }
};

const formatTime = function (time) {
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`
};

class HotelGps {
  constructor() {
    this.pages = document.querySelectorAll('div.page');
    this.selected = 0;
    this.pages[this.selected].classList.add('visible');


    this.latitude = document.querySelector('#latitude');
    this.longitude = document.querySelector('#longitude');
    this.time = document.querySelector('#time');
    this.accuracy = document.querySelector('#accuracy');
    this.sog = document.querySelector('#SOG');
    this.cog = document.querySelector('#COG');
    this.trip_distance = document.querySelector('#distance');

    this.watch_id = null;
    this.geolocation_error = true;

    this.distance = 0;
    this.lastKnownPosition = null;
    this.manOverBoardPosition = null;
  }

  start() {
    this.watch_id = navigator.geolocation.watchPosition(
      function (position) {
        if (this.lastKnownPosition != null) {
          if (this.lastKnownPosition.coords.accuracy < 10 && position.coords.accuracy < 10) {
            this.distance += distanceGreatCircle(this.lastKnownPosition, position);
          } else {
            console.log('Position not accurate enough');
          }
        }
        this.lastKnownPosition = position;
        this.geolocation_error = false;
        this.updateView();
      }.bind(this),
      function (err) {
        this.geolocation_error = true;
        console.log(err);
        this.updateView();
      }.bind(this),
      GEOLOCATION_OPTIONS
    );
  };

  stop() {
    if (this.watch_id != null) {
      navigator.geolocation.clearWatch(this.watch_id);
    }
  };

  keydown(event) {
    // console.log(event);
    switch (event.key) {
      case "ArrowRight":
        {
          const currentPage = this.pages[this.selected];
          currentPage.classList.remove('visible');
          this.selected = (this.selected + 1) % this.pages.length;
          const nextPage = this.pages[this.selected];
          nextPage.classList.add('visible');
          return;
        }
      case "ArrowLeft":
        {
          const currentPage = this.pages[this.selected];
          currentPage.classList.remove('visible');
          if (this.selected == 0) {
            this.selected = this.pages.length - 1;
          } else {
            this.selected = (this.selected - 1) % this.pages.length;
          }
          const nextPage = this.pages[this.selected];
          nextPage.classList.add('visible');
          return;
        }
    }
  }

  updateView() {
    if (this.lastKnownPosition == null) {
      return;
    }
    this.latitude.innerHTML = formatLatitude(this.lastKnownPosition.coords.latitude);
    this.longitude.innerHTML = formatLongitude(this.lastKnownPosition.coords.longitude);
    this.time.innerHTML = formatTime(new Date(this.lastKnownPosition.timestamp));
    this.accuracy.innerHTML = `Accuracy: ${this.lastKnownPosition.coords.accuracy.toFixed(1)} m`;
    const heading = this.lastKnownPosition.coords.heading === null ? 'n/a' : this.lastKnownPosition.coords.heading.toFixed(0);
    this.cog.innerHTML = `COG: ${heading} °`;
    this.sog.innerHTML = `SOG: ${(this.lastKnownPosition.coords.speed * 3600 / 1852).toFixed(1)} Kn`;
    this.trip_distance.innerHTML = `Trip: ${this.distance.toFixed(3)} NM`;

  };

};


const app = new HotelGps();
app.start();
document.addEventListener("keydown", event => {
  app.keydown(event);
});