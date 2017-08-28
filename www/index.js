//
// some polyfills e.g. Object.entries()
//
require('core-js/fn/object/entries');

//
// include the root SCSS file, which may @import from styles/*.scss
// this will form bundle.css
//
require('./index.scss');

//
// require our HTML files
// these are ignored by webpack, but having them listed as dependencies means that watch mode will recompile the app (cordova prepare)
// when these change
//
require('./index.html');
require('./html/about.html');
require('./html/map.html');
require('./html/mapsettings.html');
require('./html/navbar-bottom.html');
require('./html/navbar-top.html');
require('./html/sidebar.html');
require('./html/welcome.html');

//
// now our real app
//

import { APP_CONTROLLER } from './code/controller';
import { SETTINGS } from './code/settings';

angular.module('mobileApp', [
    'mobile-angular-ui',
    'mobile-angular-ui.gestures',
    'ui.toggle',
])
.constant('SETTINGS', SETTINGS)
.controller('appController', APP_CONTROLLER);
