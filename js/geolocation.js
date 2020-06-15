"use strict";

let latitude = document.getElementById('latitude');
let longitude = document.getElementById('longitude');

const GEOLOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 0,
    maximumAge: 0
};

class App  {
    const watch_id = navigator.geolocation.watchPosition(
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
    const Stop = function () {
        navigator.geolocation.clearWatch(watch_id);
    }
    return this;
};


const formatDegree = function (degree) {
    let d = Math.floor(degree);
    let m = (degree - d);
    return `${d.toString().padStart(3, "0")}°${(m * 60).toFixed(6)}`;
}

const formatLatitude = function (latitude) {
    if (latitude > 0) {
        return `N ${formatDegree(latitude)}`;
    } else {
        return `S ${formatDegree(-latitude)}`;
    }
}

const formatLongitude = function (longitude) {
    if (longitude > 0) {
        return "E " + formatDegree(longitude);
    } else {
        return "W " + formatDegree(-longitude);
    }
}

// const watch_id = navigator.geolocation.watchPosition(
//     function (position) {
//         console.log(position);
//         latitude.innerHTML = formatLatitude(position.coords.latitude);
//         longitude.innerHTML = formatLongitude(position.coords.longitude);
//     },
//     function (err) {
//         console.log(err);
//     },
//     GEOLOCATION_OPTIONS
// );