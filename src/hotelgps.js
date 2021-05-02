import './css/hotel.scss';

import { distanceGreatCircle } from "./great_circle.js";
import { PositionPane } from './position_pane.js';

class HotelGps {
  constructor(options) {
    this.geolocationOptions = options.geolocationOptions;
    this.pages = document.querySelectorAll('div.page');
    this.positionPane = new PositionPane(this.pages[0]);
    
    this.current_theme = 0;
    this.themes = [
      'day',
      'night',
    ];
    const this_time = new Date();
    if(this_time.getHours() >= 18 || this_time.getHours() <= 7) {
      this.current_theme = 1;
    }
    document.documentElement.setAttribute('data-theme', this.themes[this.current_theme]);

    /**
     * @type integer
     * @private
     */
    this.selected = 0;
    this.pages[this.selected].classList.add('visible');

    this.watch_id = null;

    /**
     * @type boolean
     * @private
     */
    this.geolocation_error = true;

    /**
    * @type number
    * @private
    */
    this.distance = 0;
    /**
    * @type GeolocationPosition
    * @private
    */
    this.lastKnownPosition = null;
    /**
    * @type GeolocationPosition
    * @private
    */
    this.manOverBoardPosition = null;
  }

  positionChanged_(position) {
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
  };

  positionError_(error) {
    this.geolocation_error = true;
    console.log(error);
    this.updateView();
  }

  start() {
    this.watch_id = navigator.geolocation.watchPosition(
      this.positionChanged_.bind(this),
      this.positionError_.bind(this),
      this.geolocationOptions
    );
  };

  stop() {
    if (this.watch_id != null) {
      navigator.geolocation.clearWatch(this.watch_id);
    }
  };

  keydown(event) {
    // Usefull keys:
    // case "ArrowRight":
    // case "ArrowLeft":
    switch (event.key) {
      case "1":
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
      case "3":
        {
          const currentPage = this.pages[this.selected];
          currentPage.classList.remove('visible');
          this.selected = (this.selected + 1) % this.pages.length;
          const nextPage = this.pages[this.selected];
          nextPage.classList.add('visible');
          return;
        }
      case "#":
        {
          this.current_theme = (this.current_theme + 1) % this.themes.length;
          console.log("Switching to: " + this.themes[this.current_theme]);
          document.documentElement.setAttribute('data-theme', this.themes[this.current_theme]);
        }
    }
    this.positionPane.keydown(event);
  }

  updateView() {
    if (this.lastKnownPosition == null) {
      return;
    }
    const info = {
      position: this.lastKnownPosition,
      distance: this.distance,
    };
    this.positionPane.updateView(info);
  };

};

export { HotelGps };