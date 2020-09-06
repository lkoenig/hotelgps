"use strict";

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

class PositionPane {
  constructor(element) {
    console.log(element);
    this.latitude = document.querySelector('#latitude');
    this.longitude = document.querySelector('#longitude');
    this.time = document.querySelector('#time');
    this.accuracy = document.querySelector('#accuracy');
    this.sog = document.querySelector('#SOG');
    this.cog = document.querySelector('#COG');
    this.trip_distance = document.querySelector('#distance');
  };

  updateView(info) {
    this.latitude.innerHTML = formatLatitude(info.position.coords.latitude);
    this.longitude.innerHTML = formatLongitude(info.position.coords.longitude);
    this.time.innerHTML = formatTime(new Date(info.position.timestamp));
    this.accuracy.innerHTML = `Accuracy: ${info.position.coords.accuracy.toFixed(1)} m`;
    const heading = info.position.coords.heading === null ? 'n/a' : info.position.coords.heading.toFixed(0);
    this.cog.innerHTML = `COG: ${heading} °`;
    this.sog.innerHTML = `SOG: ${(info.position.coords.speed * 3600 / 1852).toFixed(1)} Kn`;
    this.trip_distance.innerHTML = `Trip: ${info.distance.toFixed(3)} NM`;
  };

  keydown(event) {
    console.log(event);
  };

};

export { PositionPane };