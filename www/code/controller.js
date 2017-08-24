export const APP_CONTROLLER = function ($scope) {
    //
    // the currently-visible page, so only one of the panels is visible at a time
    // see selectPage() and use it in ng-click directives, to link between panels
    // ngRoute and ui.router have some undesirable behaviors such as lazy-loading and auto-unloading
    // which are poison for maps and other expensive operations
    // and mobile-angular-ui's SharedState service doesn't propagate to $scope to work with ng-switch for example, without more workarounds
    //
    $scope.selectedPage = 'welcome';
    $scope.selectPage = function (which) {
        $scope.selectedPage = which;
    };

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
            $scope.$watch('selectedPage', function(newVal, oldVal) {
                if (newVal !== 'map') return;
                setTimeout(function () {
                    $scope.map.invalidateSize();
                }, 20);
            });
        }, 100);
    }
};
