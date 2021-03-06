require('es6-promise').polyfill();
var path = require('path');
var webpack = require('webpack');
var join = path.join.bind(path, __dirname);
var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';
module.exports = {

    devtool: 'source-map',
    entry: {
        app: './public/app.jsx'
    },
	output:{
        path:join('.build'),
        filename: 'app.[hash].js'
    },
	target:"web",
    stats: {
        colors: true,
        reasons: true
    },
    module: {
        loaders: [
            {
                test: /\.js(x)?$/,
                exclude: [
                    /node_modules\/(?!(subschema-builder|component-playground|react-))/,
                    /babel-core/
                ],
                loaders: ['babel-loader?stage=0']
            },
            {test: /\.(png|jpe?g|mpe?g|gif)$/, loader: 'url-loader?limit=100000'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"},
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.css$/,
                // loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loaders: ['style','css','less']
            }
        ]
    },

    postcss: [
        require('autoprefixer'),
        require('postcss-color-rebeccapurple')
    ],
    resolve: {
        extensions:['','.js','.jsx'],
        alias: {
            'subschema': join('src/index.jsx'),
            'subschema-styles':join('src/styles'),
            'react': join('node_modules/react')
            //   'component-playground':join('node_modules/component-playground')
        }
    },

    plugins: [
        new webpack.ProvidePlugin({
            CodeMirror: "codemirror",
            "window.CodeMirror": "codemirror"
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        function () {
            this.plugin("done", function (stats) {
                stats = stats.toJson();
                console.error(JSON.stringify({
                    assetsByChunkName: stats.assetsByChunkName
                }));
            });
        }
    ]

};

