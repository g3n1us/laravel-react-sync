import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ReactSync, helpers, collect, Reducer } from 'laravel_react_sync';
import * as pages from 'pages';
import * as models from 'models';
// import { collect } from 'collect.js';

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React, LaravelReactSync and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel + LaravelReactSync.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const ReactSyncInstance = new ReactSync;
ReactSyncInstance.boot({pages: pages});

ReactDOM.render(<App ref={ReactSync.setAppRef} {...ReactSyncInstance.page_data} page_props={Reducer()} />, document.createElement('div'));
