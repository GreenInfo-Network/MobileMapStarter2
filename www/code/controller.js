export const APP_CONTROLLER = function ($scope, SharedState) {
    //
    // initialization: define the currently-selected page
    // see the whichPage stuff in index.html for switching pages
    //
    SharedState.initialize($scope, "whichPage", 'welcome');

    //
    // initialization: a Leaflet Map in $scope.map
    // has to be done asynchronously since Angular may not have loaded map.html yet
    //
    {
        const map_div_id = 'map-map';
        const timer = setInterval(function () {
            var div = document.getElementById(map_div_id);
            if (! div) return; // try again next tick
            clearInterval(timer); // found it, quit checking and get moving

            $scope.map = L.map(map_div_id, {
            }).setView([ 0, 0 ], 1 );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            }).addTo($scope.map);

            // watch for a page change to 'map' so we can fix Leaflet's hatred of being invisible
            $scope.$on('mobile-angular-ui.state.changed.whichPage', function(e, newVal, oldVal) {
                if (newVal !== 'map') return;
                setTimeout(function () {
                    $scope.map.invalidateSize();
                }, 20);
            });
        }, 100);
    }
};
