/*
 * SETTINGS AND CONSTANTS for your app, e.g. which page to show first, the maps starting view
 */
export const SETTINGS = {
    // which page should be shown when we first start?
    // see the whichPage scope avriable ,and index.html for the page-turning behavior
    startingPage: 'welcome',

    // for the map: the starting extent: southwest lat, lng and northeast lat, lng
    startingBounds: [
        [ 34, -124 ],
        [ 66, -90 ]
    ],

    // for the map, the mininmum and maximum zoom
    minZoom:1,
    maxZoom: 16,

    // when zooming to your geolocation on the map, use this zoom level
    mapFollowZoomLevel: 14,

    // for the map, the list of basemap options and which basemap is shown at startup
    // these will be used to create L.TileLayer and L.TileLayer.Cordova instances to form the basemaps
    // if offlineCache is true, then L.TileLayer.Cordova will be used; otherwise L.TileLayer will be used
    // the 'url' will be passed as the URL templatem and 'options' will be passed as the second param for tile layer configuration as usual
    //
    // for more info https://github.com/gregallensworth/L.TileLayer.Cordova/
    //
    // see also mapsettings.html for the UI where one selects the basemap, as you will want to tailor that to this listing and to your use case
    // (the UI will not be auto-generated from this list, as we don't know your specific UI use case and that may not be what you want at all)
    startingBasemap: 'opentopo',
    basemaps: {
        'opentopo': {
            offlineCache: true,
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            options: {
                // the folder where tiles are stored on device, and the "basename" of the stored tile files
                folder: 'MobileMapStarter',
                name: 'opentopo',
                debug: false,
                // plus the usual L.TileLayer options such as attributions and minZoom/maxZoom
            }
        },
        'esriroad': {
            offlineCache: true,
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            options: {
                // the folder where tiles are stored on device, and the "basename" of the stored tile files
                folder: 'MobileMapStarter',
                name: 'esriroad',
                debug: false,
                // plus the usual L.TileLayer options such as attributions and minZoom/maxZoom
            }
        },
        'esriimagery': {
            offlineCache: true,
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            options: {
                // the folder where tiles are stored on device, and the "basename" of the stored tile files
                folder: 'MobileMapStarter',
                name: 'esriimagery',
                debug: false,
                // plus the usual L.TileLayer options such as attributions and minZoom/maxZoom
            }
        },
    },

    // offline tile caching
    // how deep should we cache tiles for offline use?
    // you may want this to be the same as maxZoom, but be careful that deeper = more tiles = longer waits = higher tile traffic
    // you may want the whole world from level 0 to 18, but is it really a good idea?
    offlineCacheMinZoom: 10,
    offlineCacheMaxZoom: 16,
};
