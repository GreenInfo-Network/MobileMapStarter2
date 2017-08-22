## SETUP

You will want to run `yarn install` in this folder, to install the pieces for webpack to compile your ES2015 and SASS code.

You will also want to run `yarn install` in the `www/` folder, to install the components used by the web app.

If you are setting up this project, run `cordova prepare` to fetch plugins and platforms.

Recommended settings for iOS, done via Xcode.
* Open the project file in Xcode.
* In its General tab:
  * Device Orientation = check all 4
  * Deployment target = 8.1 or later
  * Hide Status Bar = checked
* In its Info tab, set/create the following.
  * Status bar is initially hidden = YES
  * View controller-based status bar appearance = NO

You will also want to edit `config.xml` and `package.json` to reflect you app's name, author, etc.



## DEVELOPMENT OVERVIEW AND CONVENTIONS

This app uses webpack to compile ES2015 code into JavaScript, and to compile SASS into CSS. The output files are *bundle.css* and *bundle.js* but you should instead make your changes to the `index.*` entry points. See the Quick Start for an overview of the files.

The basic HTML/JS framework is *mobile-angular-ui* This is basically AngularJS and an optimzied build of Bootstrap 3.

For internal hyperlinks, *angular-ui-router* is used. This means that in your HTML should use `ui-sref` tags and the `$stateProvider` To navigate to a page programatically, use `$state.go()`



## DEVELOPMENT QUICK START

The essential commands:
`npm run build`
`npm run watch`

An overview of the files:
* `www/index.js` -- The entry point for webpack
  * This should act as an entry point to `require()` your SCSS, HTML, etc.
  * Basic entry points would be controller.js, index.scss, etc. but if you use watch mode you may also want to add the templates under `html/` so the watch will recompile when those change.  
* `code/controller.js` -- The starting point for this application's code (your code!).
  * Write your own code here: Angualar module, routes, controller, directives, etc.
  * This will be treated as ES2015 code and run through webpack, so you may require and import as usual.
* `www/index.html` -- The skeleton of the app's HTML rendering.
  * This includes the various script and link tags for loading CSS and JS libraries, and provides the basic layout.
  * For the most part, this is a skeleton and you'll want to work within the `html/*.html` templates for specific panels/pages within your app.
* `www/html/*.html` -- Partial view templates interpolated into the `ng-view` section of `index.html`.
  * This is closely connected to the `angular-ui-router` system, and to routes defined in `index.js` You will probably have one partial view per route.
  * You may want to `require()` these in `index.js` Webpack won't do anything with them, but if you use watch mode and it is listed, then changing the file will trigger a recompile.
* `www/index.scss` -- SASS stylesheet starting point.
  * The entry point for SASS styles. Depending on your preference, you may want to have it `@import` in a modular fashion from the `style/*.scss` files.
* `style/*.scss` -- SASS stylesheets.
  * Provided as a convention, in case your workflow fits well with breaking up a monolithic `index.scss` insto smaller chunks.



## OTHER DETAILS AND NOTES

The app directory has a *yarn.lock* file for installing packages related to webpack and compiling JS/SASS. The `www/` folder has a separate `yarn.lock` file, for dependencies used in the web app. Keeping them separate makes for easier maintainability of the www components versus the build system, should you have your own preferred build system. For your use case, perhaps merging and then require()'ing the libs makes sense.

After making changes to the HTML/CSS/JS files, the apps won't be rebuilt by Cordova (and thus visible to Xcode et al) until you issue a `cordova prepare` If you're using the provided webpack config, there is already a shell command which will run this for you.
