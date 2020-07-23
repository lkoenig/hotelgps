"use strict";

import {distanceGreatCircle} from "./great_circle.js";

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

class GpsApp {
  constructor() {
    this.latitude = document.getElementById('latitude');
    this.longitude = document.getElementById('longitude');
    this.time = document.getElementById('time');

    this.watch_id = null;
    this.geolocation_error = true;

    this.distance = 0;
    this.lastKnownPosition = null;
    this.manOverBoardPosition = null;
  }

  start() {
    this.watch_id = navigator.geolocation.watchPosition(
      function (position) {
        if(lastKnownPosition != null) {
          this.distance += distanceGreatCircle(this.lastKnownPosition, position);
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

  updateView() {
    if (this.lastKnownPosition == null) {
      return;
    }
    this.latitude.innerHTML = formatLatitude(this.lastKnownPosition.coords.latitude);
    this.longitude.innerHTML = formatLongitude(this.lastKnownPosition.coords.longitude);
    this.time.innerHTML = formatTime(new Date(this.lastKnownPosition.timestamp));
  };

};


const app = new GpsApp();
app.start();
