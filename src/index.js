"use strict";
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
}

class GpsApp {
  constructor() {
    this.latitude = document.getElementById('latitude');
    this.longitude = document.getElementById('longitude');
    this.time = document.getElementById('time');

    this.watch_id = null;

    this.lastKnownPosition = null;
    this.manOverBoardPosition = null;
  }

  start() {
    this.watch_id = navigator.geolocation.watchPosition(
      function (position) {
        this.lastKnownPosition = position;
        this.latitude.innerHTML = formatLatitude(position.coords.latitude);
        this.longitude.innerHTML = formatLongitude(position.coords.longitude);
        this.time.innerHTML = formatTime(new Date(position.timestamp));
      }.bind(this),
      function (err) {
        console.log(err);
      },
      GEOLOCATION_OPTIONS
    );
  };

  stop() {
    if (this.watch_id != null) {
      navigator.geolocation.clearWatch(this.watch_id);
    }
  };

};


const app = new GpsApp();
app.start();
