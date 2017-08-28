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
    constructor ($scope, SETTINGS) {
        // injections we want to pass into other methods (sigh)
        this.$scope = $scope; // typically, just assign to "this" to assign to scope, but you may need to access $scope.$watch
        this.SETTINGS = SETTINGS;

        // starting state: selected page, map variables, ...
        this.selectedPage = this.SETTINGS.startingPage;
        this.selectedBasemap = undefined; // see selectBasemap immediately below

        // start the map when the element becomes ready
        // watch for a page change into 'map' so we can fix Leaflet's hatred of being invisible
        const map_div_id = 'map-map';
        const map_startup_timer = setInterval(() => {
            var div = document.getElementById(map_div_id);
            if (! div) return; // try again next tick
            clearInterval(map_startup_timer); // found it, quit checking and get moving

            this.map = L.map(map_div_id, {
                minZoom: this.SETTINGS.minZoom,
                maxZoom: this.SETTINGS.maxZoom,
            }).fitBounds(this.SETTINGS.startingBounds);

            this.map.basemaps = this.SETTINGS.basemaps;

            this.selectBasemap(this.SETTINGS.startingBasemap);
        }, 100);

        $scope.$watch(() => this.selectedPage, this.watchPageChangeForMapResize());
    }

    watchPageChangeForMapResize () {
        return (newpage) => {
            if (newpage !== 'map') return;
            if (! this.map) return; // there is no Map yet, so skip it; should never happen

            setTimeout(() => {
                this.map.invalidateSize();
            }, 20);
        };
    }

    selectPage (which) {
        this.selectedPage = which;
    }

    selectBasemap (which) {
        this.selectedBasemap = which;
        Object.entries(this.map.basemaps).forEach(([name, maplayer]) => {
            if (name == which) {
                this.map.addLayer(maplayer);
            }
            else {
                this.map.removeLayer(maplayer);
            }
        });
    }
}

APP_CONTROLLER.$inject = ['$scope', 'SETTINGS' ];
