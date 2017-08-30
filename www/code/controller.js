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
        this.selectedBasemap = undefined; // see call to selectBasemap() immediately below
        this.globalmodal = undefined; // see modalMessageShow() to show a global modal prompt
        this.mapFollowMyLocation = false;
        this.offlinecache = {
            filecount: 0,
            filesize: 0.0,
            busy: '',
        };

        // start the map when the element becomes ready; the L.Map is available as this.map
        // also, watch for a page change into 'map' so we can fix Leaflet's hatred of being invisible
        // start geolocation as this.geolocation
        document.addEventListener("deviceready", () => {
            const map_startup_timer = setInterval(() => {
                if (! document.getElementById('map-map')) return; // try again next tick
                clearInterval(map_startup_timer);
                this.initMapAndGeolocation();
            }, 100); // end of map-init timer
        }, false);

        //
        // start watching things
        //

        // geolocation events and toggling of the follow-me flag
        $scope.$watch(() => this.currentPosition, this.handleLocationChange());
        $scope.$watch(() => this.mapFollowMyLocation, this.handleLocationChange());

        // selectedPage changing to "map" should trigger Leaflet to re-assert its size
        $scope.$watch(() => this.selectedPage, (newpage) => {
            if (newpage !== 'map') return;
            if (! this.map) return; // there is no Map yet, so skip it; should never happen

            setTimeout(() => {
                this.map.invalidateSize();
            }, 20);
        });

        // selectedPage changing to "mapsettings" should calculate the tile cache usage
        $scope.$watch(() => this.selectedPage, (newpage) => {
            if (newpage !== 'mapsettings') return;
            this.offlineCacheCalculateUsage();
        });
    }

    initMapAndGeolocation () {
        this.map = L.map('map-map', {
            minZoom: this.SETTINGS.minZoom,
            maxZoom: this.SETTINGS.maxZoom,
        }).fitBounds(this.SETTINGS.startingBounds);

        // create L.TileLayer.Cordova instances for the defined basemap options then select one
        this.map.basemaps = {};
        Object.entries(this.SETTINGS.basemaps).forEach( ([ layername, layeroptions ]) => {
            if (! layeroptions.options.folder || !layeroptions.options.name) throw "Basemaps definitions: L.TileLayer.Cordova requires folder and name";
            this.map.basemaps[layername] = L.tileLayerCordova(layeroptions.url, layeroptions.options);
        });
        this.selectBasemap(this.SETTINGS.startingBasemap);

        // add map control: geocoder
        // for more info see https://github.com/perliedman/leaflet-control-geocoder
        var geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
            collapse: true,
            expand: 'touch',
        })
        .on('markgeocode', (event) => {
            this.handleGeocode(event.geocode);
        })
        .addTo(this.map);

        // begin geolocation tracking
        // see handleLocationChange() and configure it to your use case
        this.map.mylocation = L.marker([ 0, 0 ], {
            icon: L.icon({
                iconUrl: 'images/geolocation.png',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            }),
        });

        this.geolocation = navigator.geolocation.watchPosition(
            (position) => {
                console.log([ 'watchPosition OK', position.coords.latitude, position.coords.longitude ]);
                this.$scope.$apply(() => { // for some reason geolocation means we need to apply() this...
                    this.currentPosition = position;
                });
            },
            (error) => {
                console.log([ 'watchPosition error', error.message ]);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,  // Android quirk: if timeout is not given, error callback won't happen, so supply that
            }
        );
    }

    // when our locations changes OR we toggle track-me-on-the-map behavior, do this...
    // position is a W3C geolocation position object; you may want to massage into a [ lat, lng ] for Leaflet
    // note that platforms and devices vary on how often they will send location-changes; the user may not have moved at all, or have moved only 3 meters
    // note that currentPosition may be null if location services are denied/broken
    handleLocationChange () {
        return () => {
            console.log([ 'handleLocationChange', this.currentPosition ]);
            if (! this.currentPosition) return; // null location, do nothing

            // update our geolocation marker
            // if we are tracking on the map, pan and zoom to that marker
            const latlng = [ this.currentPosition.coords.latitude, this.currentPosition.coords.longitude ];

            this.map.mylocation.setLatLng(latlng).addTo(this.map);

            if (this.mapFollowMyLocation) {
                console.log([ 'mapFollowMyLocation', latlng, this.SETTINGS.mapFollowZoomLevel ]);
                this.map.setView(latlng, this.SETTINGS.mapFollowZoomLevel);
            }

            // add here, other things you'll want to do when lcoation changes: a GPS readout, some search behavior, geofencing, ...
        };
    }

    // simple wrapper to select whichPage() so as to turn pages
    selectPage (which) {
        this.selectedPage = which;
    }

    // simple wrapper to define selectedBasemap and to update the map to use that basemap
    // equally correct, would be to simply set this.selectedBasemap here and have a $watch which updates the map
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

    // handle a geocode result event
    // see the geocoder control instantiation for details as to the geocoder control and its documentation
    // tip: zooming to the result, and also zomoing to yourself with mapFollowMyLocation, may be goofy if used at the same time
    handleGeocode (geocoderesult) {
        this.map.fitBounds(geocoderesult.bbox);
    }

    // utility methods to show a modal with a title + message + OK button
    modalMessageShow(message='', title='', closebutton='OK') {
        this.globalmodal = {
            message,
            title,
            closebutton,
        };
    }
    modalMessageClear () {
        this.globalmodal = undefined;
    }

    // loading the map cache from the current map view
    // and emptying the cache
    offlineCacheLoadCurrentView () {
        // if they're already too far in, then bail
        console.log([ 'offlineCacheLoadCurrentView entry', this.map.getZoom(), this.SETTINGS.offlineCacheMaxZoom, this.SETTINGS.offlineCacheMinZoom ]);
        if (this.map.getZoom() > this.SETTINGS.offlineCacheMaxZoom) {
            this.modalMessageShow('You are zoomed in beyond the level allowed for offline map tiles. Zoom out and try again.', 'Zoom Out');
            return;
        }
        if (this.map.getZoom() < this.SETTINGS.offlineCacheMinZoom) {
            this.modalMessageShow('You are zoomed out beyond the level allowed for offline map tiles. Zoom in and try again.', 'Zoom In');
            return;
        }

        const lon = this.map.getCenter().lng;
        const lat = this.map.getCenter().lat;
        const zmin = this.map.getZoom();
        const zmax = this.SETTINGS.offlineCacheMaxZoom;
        const layers = Object.values(this.map.basemaps);
        console.log([ 'offlineCacheLoadCurrentView params', lon, lat, zmin, zmax ]);

        const seedLayerByIndex = (index) => {
            // done with the last layer, so truly done
            if (index >= layers.length) {
                this.$scope.$apply(() => { // no idea why this is necessary when usually plain assignment works
                    this.offlinecache.busy = "";
                    this.offlineCacheCalculateUsage();
                });
                return;
            }

            const layer = layers[index];
            const layername = layer.options.name;

            const xyzs = layer.calculateXYZListFromPyramid(lat, lon, zmin, zmax);

            const complete_callback = (done, total) => {
                const text = `Done with ${layername}`;
                this.$scope.$apply(() => { // no idea why this is necessary when usually plain assignment works
                    this.offlinecache.busy = text;
                });
                console.log(text);
                seedLayerByIndex(index + 1);
            };
            const progress_callback = (done, total) => {
                const percent = Math.round( 100 * parseFloat(done + 1) / parseFloat(total) );
                const text = `${layername} ${percent}%, ${done + 1} / ${total}`;
                this.$scope.$apply(() => { // no idea why this is necessary when usually plain assignment works
                    this.offlinecache.busy = text;
                });
                console.log(text);
            };
            const error_callback = () => {
                this.modalMessageShow('Could not download map tiles. Please try again.');
            };

            const overwrite = false;
            layer.downloadXYZList(xyzs, overwrite, progress_callback, complete_callback, error_callback);
        };
        seedLayerByIndex(0);
    }

    offlineCachePurge () {
        const layers = Object.values(this.map.basemaps);

        const finished_callback = () => {
            this.offlinecache.busy = "";
            this.offlineCacheCalculateUsage();
        };

        const handleLayerByIndex = (index) => {
            // if we are done with the last, then we're done
            if (index >= layers.length) {
                finished_callback();
                return;
            }

            const tilelayer = layers[index];
            const layername = tilelayer.options.name;
            console.log([ 'offlineCachePurge', 'try' ]);
            this.offlinecache.busy = `Emptying ${layername}`;

            tilelayer.emptyCache( () => {
                // on to the next one
                handleLayerByIndex(index + 1);
            });
        };
        handleLayerByIndex(0);
    }

    offlineCacheCalculateUsage () {
        var filecount = 0;
        var filesize = 0;

        const layers = Object.values(this.map.basemaps);

        const finished_callback = () => {
            this.$scope.$apply(() => { // no idea why this is necessary instead of plain assignment...
                this.offlinecache.filecount = filecount;
                this.offlinecache.filesize = filesize;
            });
        };

        const handleLayerByIndex = (index) => {
            // if we are done with the last, then we're done
            if (index >= layers.length) {
                finished_callback();
                return;
            }

            const tilelayer = layers[index];
            const layername = tilelayer.options.name;
            console.log([ 'offlineCacheCalculateUsage', 'try', layername ]);

            tilelayer.getDiskUsage( (thisfilecount, thisfilesize) => {
                console.log([ 'getDiskUsage', 'got', layername, thisfilecount, thisfilesize ]);
                filecount += thisfilecount;
                filesize += thisfilesize;

                // on to the next one
                handleLayerByIndex(index + 1);
            });
        };
        handleLayerByIndex(0);
    }
}

APP_CONTROLLER.$inject = ['$scope', 'SETTINGS' ];
