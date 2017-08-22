/*
 * Webpack configuration and build scripts for use with MobileMapStarter2
 * August 2017
 * Greg "Gregor" Allensworth, GreenInfo Network   gregor@greeninfo.org
 */

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const WebpackShellPlugin = require("webpack-shell-plugin");

module.exports = {
    entry: __dirname + '/www/index.js',
    output: {
        path: __dirname + '/www/',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            /*
             * run JavaScript files through Babel + ES2015 + JSHint
             */
            {
                test: /\.js$/,
                use: [
                    { loader: 'babel-loader', options: { presets: ['es2015'] } },
                    { loader: 'jshint-loader', options: { esversion: 6, emitErrors: true, failOnHint: true } }
                ],
                exclude: /node_modules/
            },

            /*
             * CSS-as-is files and also SASS-to-CSS all go into bundle.css
             */
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true, url: false } }
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true, url: false } },
                        { loader: 'sass-loader', options: { sourceMap:true } },
                    ],
                    fallback: 'style-loader'
                })
            },

            /*
             * HTML Files have no effect on the output, but we do want to require() them so they are dependencies
             * so that watch mode will automatically recompile if the HTML files change
             */
            {
                test: /\.html$/,
                loader: 'ignore-loader'
            },

            /*
             * Files to ignore, notably from CSS, e.g. background-image SVG, PNGs, JPEGs, fonts, ...
             * webpack needs a handler for all file suffixes, even if we just ignore them
             */
            {
                test: /\.(svg|gif|jpg|jpeg|png)$/,
                loader: 'ignore-loader'
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                loader: 'ignore-loader'
            }
        ]
    },


    /*
     * enable source maps, applicable to both JS and CSS
     */
    devtool: "nosources-source-map",

    /*
     * plugins for the above
     */
    plugins: [
        // CSS output from the CSS + LESS handlers above
        new ExtractTextPlugin({
            disable: false,
            filename: 'bundle.css'
        }),
        // now that we have rebuilt our HTML/JS source, run "cordova prepare" so the mobile app bundle is rebuilt
        new WebpackShellPlugin({
            dev: false, // without this, it only compiles once even in watch mode
            onBuildEnd: [
                'echo Cordova prepare...',
                'cordova prepare',
                'echo Done',
                'date',
            ]
        })
    ]
};
