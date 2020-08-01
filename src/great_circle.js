"use strict"

const degToRad = function (x) {
  return x / 180 * Math.PI;
};

const square = function (x) {
  return x * x;
};

const distRadianToNauticalMiles = function (x) {
  // None 1 Nautical Miles is is 1 minute of angle in Latitude so 1/60 of degree. 
  return ((180 * 60) / Math.PI) * x;
};

// According to http://edwilliams.org/avform.htm#Dist
const distanceGreatCircle = function (a, b) {
  let lat_a = degToRad(a.coords.latitude);
  let lat_b = degToRad(b.coords.latitude);
  let lon_a = degToRad(a.coords.longitude);
  let lon_b = degToRad(b.coords.longitude);
  // let d = Math.acos(Math.sin(lat_a) * Math.sin(lat_b) + Math.cos(lat_a) * Math.cos(lat_b) * Math.cos(lon_a - lon_b));
  let d = 2 * Math.asin(Math.sqrt(square(Math.sin((lat_a - lat_b) * 0.5)) +
    Math.cos(lat_a) * Math.cos(lat_b) * square(Math.sin((lon_a - lon_b) * 0.5))));
  return distRadianToNauticalMiles(d);
}

export {distanceGreatCircle};