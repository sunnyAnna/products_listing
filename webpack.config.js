const webpack = require('webpack');
const indexer = require('html-webpack-plugin');
const extractor = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		app: __dirname + "/src/index.jsx",
		style: __dirname + "/src/styles/style.css"
	},
	output: {
		filename: "[name].bundle.js",
		path: __dirname + "/dest",
		chunkFilename: "bundle.js"
	},
	watch: true,
	plugins: [
		new indexer({
			inject: 'body',
			hash: false,
			cache: true,
			template: 'src/index.html',
			showErrors: false
		}),
		new extractor('styles.css'),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			debug: true,
			minimize: true,
			sourceMap: false,
			comments: false,
			compress: {
				warnings: false
			},
			mangle: {
				except: ['$', 'webpackJsonp'],
				screw_ie8: true,
				keep_fnames: true
			}
		})],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react'],
					plugins: 'react-hot-loader/babel'
				}
			 },
			{
				test: /\.html$/,
				loader: "html"
			},
			{
				test: /\.css$/,
				loader: extractor.extract("style-loader", "css-loader")
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
}
