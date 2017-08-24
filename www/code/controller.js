/*
 * Some design decisions
 *
 * The controller is a ES2015 class, to improve readability.
 * https://blog.thoughtram.io/angularjs/es6/2015/01/23/exploring-angular-1.3-using-es6.html
 * This greatly improves readability, but means a few style changes:
 * - Injected services which you'll want to use throughout your controller-class, are assigned into this (e.g. this.$http) so as to be accessible in methods.
 * - $watch takes a IEFE syntax and a callback which returns a function; look below and you'll see what I mean
 * - In the HTML, Controller assignment is "controller as app" and scope stuff is prefixed with app.
 * This is all a bit of a variation from the usual Angular coding style, but the payoff is increased readability as this thing grows.
 *
 * Consider using () => {} syntax for functions, in order to preserve the value of "this"
 * e.g. within timeout callbacks and ajax callbacks
 * It improves readability.
 *
 * Page-turning uses a good ol' scope variable selectedPage and a wrapper method selectPage()
 * ngRoute and ui.router have some undesirable behaviors such as lazy-loading and auto-unloading, which are poison for initializing maps
 * and re-initializing them in the partial view every time one revisits that panel.
 */


export class APP_CONTROLLER {
    //
    // constructor
    // match this argument list to the $inject list provided below... or weird things will happen
    //
    constructor ($scope) {
        // injections we want to pass into other methods (sigh)
        this.$scope = $scope; // typically, just assign to "this" to assign to scope, but you may need to access $scope.$watch

        // starting state: selected page, map variables, ...
        this.selectedPage = 'welcome';

        // start the map when the element becomes ready
        // watch for a page change into 'map' so we can fix Leaflet's hatred of being invisible
        const map_div_id = 'map-map';
        const map_startup_timer = setInterval(() => {
            var div = document.getElementById(map_div_id);
            if (! div) return; // try again next tick
            clearInterval(map_startup_timer); // found it, quit checking and get moving

            this.map = L.map(map_div_id, {
            }).setView([ 0, 0 ], 1 );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            }).addTo(this.map);
        }, 100);

        $scope.$watch(() => this.selectedPage, this.watchPageChangeForMapResize());
    }

    watchPageChangeForMapResize () {
        return (newVal) => {
            if (newVal !== 'map') return;
            if (! this.map) return; // there is no Map yet, so skip it; should never happen

            setTimeout(() => {
                this.map.invalidateSize();
            }, 20);
        };
    }

    //
    // method for switching between pages
    //
    selectPage (which) {
        this.selectedPage = which;
    }
}

APP_CONTROLLER.$inject = ['$scope' ];
