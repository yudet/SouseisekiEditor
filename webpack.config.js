var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: ['./src/app/typescripts/main.ts'],

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},

	module: {
		rules: [{
			test: /\.ts$/,
			loader: 'ts-loader',
			options: {
				appendTsSuffixTo: [/\.vue$/]
			},
			exclude:['./node_modules/','./src/electron/']
		}, {
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				esModule: true,
				loaders: {
					css: 'vue-style-loader!css-loader'
				}
			}
		}, {
			test: /\.css$/,
			loaders: [
				'style-loader',
				'css-loader',
			],
		}, {
			test: /\.scss$/,
			loaders: [
				'style-loader',
				'css-loader',
				'sass-loader',
			],
		}, {
			test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
			loader: 'url-loader',
		}, {
			test: /\.json5$/,
			loader: 'json5-loader',
		},],
	},

	resolve: {
		extensions: ['.ts', '.js', '.json', '.ts']
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: '!!pug-loader!./src/app/index.pug',
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
			template: '!!pug-loader!./src/app/mltbrowser.pug',
			filename: 'mltbrowser.html'
		}),
		new HtmlWebpackPlugin({
			template: '!!pug-loader!./src/app/config.pug',
			filename: 'config.html'
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			Tether: "tether",
			"window.Tether": "tether",
			Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
			Button: "exports-loader?Button!bootstrap/js/dist/button",
			Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
			Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
			Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
			Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
			Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
			Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
			Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
			Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
			Util: "exports-loader?Util!bootstrap/js/dist/util",
		})
	],
	target: 'electron-renderer',

	devtool: 'source-map',
};
