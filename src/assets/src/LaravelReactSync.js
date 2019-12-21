import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import qs from 'qs';
import Async from 'react-promise';
import Model from './src/Model';

const REACT_SYNC_DATA = window[window.ReactSyncGlobal];
// This component maps specifically to a Laravel model.

Async.defaultPending = (
  <span>loading...</span>
)


ModelComponent.addModel = function(M){
	ModelComponent.models = ModelComponent.models || {};
	if(!(M.name in ModelComponent.models))
		ModelComponent.models[M.name] = M;

}






