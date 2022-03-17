const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dotenv = require('dotenv')
const webpack = require('webpack')

module.exports = {
    // Create ref of index & about
    entry: {
        index: './src/index.js'
    },
    mode: 'development',
    output: {
        path: path.resolve('./build'),
        filename: "src/js/[name].js",
        chunkFilename: "src/js/[name].chunk.js",
    },
    devServer: {
        port: 8080,
        static: './',
        hot: true,
        watchFiles: ['/*.html']
    },
    module: {
        rules: [{
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            }, {
                // Look for Sass files and process them according to the
                // rules specified in the different loaders
                test: /\.(sa|sc)ss$/,
                // Use the following loaders from right-to-left, so it will
                // use sass-loader first and ending with MiniCssExtractPlugin
                use: [{
                        // Extracts the CSS into a separate file and uses the
                        // defined configurations in the 'plugins' section
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        // Interprets CSS
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    {
                        // Use PostCSS to minify and autoprefix. This loader
                        // uses the configuration in `postcss.config.js`
                        loader: 'postcss-loader'
                    },
                    {
                        // Adds support for Sass files, if using Less, then
                        // use the less-loader
                        loader: 'sass-loader'
                    }
                ]
            },

            {
                // Adds support to load images in your CSS rules. It looks
                // for .png, .jpg, .jpeg and .gif
                test: /\.(png|jpe?g|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        // The image will be named with the original name and
                        // extension
                        name: '[name].[ext]',
                        // Indicates where the images are stored and will use
                        // this path when generating the CSS files.
                        // Example, in main.scss I have
                        // url('../../public/assets/images/venice-italy.jpg')
                        // and when generating the CSS file, it will be
                        // outputted as url(../images/venice-italy.jpg), which
                        // is relative to /styles/main.css
                        publicPath: '../images',
                        // When this option is 'true', the loader will emit
                        // the image to output.path
                        emitFile: false
                    }
                }]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: true,
            chunks: ['index'], // ref to index.js file 
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin(),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
        })
    ]
};