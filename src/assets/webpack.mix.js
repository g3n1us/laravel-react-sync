let mix = require('laravel-mix');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const filename_base = 'LaravelReactSync';
const extension = process.env.NODE_ENV == 'production' ? '.min.js' : '.js';
const filename = filename_base + extension;


mix.webpackConfig({
	output: {
		libraryTarget: "umd",
		library: "LaravelReactSync",
		libraryExport: "default",
		globalObject: 'this'
	}
});

mix.options({
    terser: {
        terserOptions: {
	        mangle: false,
        }
    },
});

mix.babelConfig({
    plugins: ['@babel/plugin-proposal-class-properties'],
});

mix.react('src/main.js', `dist/${filename}`)
mix.react('src/main_sync.js', `dist/Sync${filename}`)
	.setPublicPath('dist')
	.sourceMaps();
