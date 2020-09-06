"use strict";
import './css/softkey.scss';
import { HotelGps } from './hotelgps.js';

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 0,
  maximumAge: 0
};

const app = new HotelGps({
  geolocationOptions: GEOLOCATION_OPTIONS,
});
app.start();
document.addEventListener("keydown", event => {
  app.keydown(event);
});