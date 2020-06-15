"use strict";
const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 0,
    maximumAge: 0
};

let latitude = document.getElementById('latitude');
let longitude = document.getElementById('longitude');

const formatDegree = function (degree) {
    let d = Math.floor(degree);
    let m = (degree - d);
    return `${d.toString().padStart(3, "0")}°${(m * 60).toFixed(3)}`;
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

class GpsApp {
    constructor() {
        this.watch_id = null;
    }

    Start() {
        this.watch_id = navigator.geolocation.watchPosition(
            function (position) {
                console.log(position);
                latitude.innerHTML = formatLatitude(position.coords.latitude);
                longitude.innerHTML = formatLongitude(position.coords.longitude);
            },
            function (err) {
                console.log(err);
            },
            GEOLOCATION_OPTIONS
        );
    };

    Stop() {
        if (this.watch_id != null) {
            navigator.geolocation.clearWatch(this.watch_id);
        }
    };

};


const app = new GpsApp();
app.Start();
