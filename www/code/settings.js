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
    // the 'url' and 'options' will be passed to L.TileLayer.Cordova, which accepts the usual URL and tileLayer options plus some extras for caching
    // read more https://github.com/gregallensworth/L.TileLayer.Cordova/
    //
    // see also mapsettings.html for the UI where one selects the basemap, as you will want to tailor that to this listing and to your use case
    // (it won't be auto-generated from this list, as we don't know your specific UI use case)
    startingBasemap: 'esritopo',
    basemaps: {
        'osm': {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            options: {
                // the folder where tiles are stored on device, and the "basename" of the stored tile files
                folder: 'MobileMapStarter',
                name: 'osm',
                debug: true,
                // plus the usual L.TileLayer options such as attributions and minZoom/maxZoom
            }
        },
        'esritopo': {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            options: {
                // the folder where tiles are stored on device, and the "basename" of the stored tile files
                folder: 'MobileMapStarter',
                name: 'esritopo',
                debug: true,
                // plus the usual L.TileLayer options such as attributions and minZoom/maxZoom
            }
        },
        'esriimagery': {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            options: {
                // the folder where tiles are stored on device, and the "basename" of the stored tile files
                folder: 'MobileMapStarter',
                name: 'esriimagery',
                debug: true,
                // plus the usual L.TileLayer options such as attributions and minZoom/maxZoom
            }
        },
    },
};
