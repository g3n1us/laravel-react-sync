import React from 'react';
import Trait from './Trait';
import Model from '../Model';
import * as models from '../../models/models';
const pluralize = require('pluralize');
import { app_get, pluralToClassName } from '../../helpers';


/**
@kind mixin
@extends Trait
*/
class HasRelations extends Trait{

	constructor(targetClass){
		super(targetClass);
	}

	/** */
	HasMany(relationship_definition_from_schema){
		const { related, localKey, foreignKey } = relationship_definition_from_schema;
		const M = Model.getModel(related);
		return M.where(foreignKey, this.props[localKey]);
	}

	/** */
	HasManyThrough(relationship_definition_from_schema){
		throw new Error(`HasManyThrough not defined!`);

		return <div>Relation: { relationship_definition_from_schema.HasManyThrough.relationName }</div>
	}


	/** */
	HasOneThrough(relationship_definition_from_schema){


/*
farParent: "DataPoint"
firstKey: "data_point_id"
localKey: "id"
parent: "DataFormat"
related: "DataSource"
secondKey: "data_format_id"
secondLocalKey: "id"
throughParent: "DataFormat"
withDefault: null
*/
		const { relation_name, related, firstKey, localKey, secondKey, secondLocalKey, parent } = relationship_definition_from_schema;
		const RelatedModel = Model.models[related].find(this.props[localKey]);
		const RelatedRelatedModel = Model.models[parent].find(RelatedModel.props[secondKey]);
		let plural = pluralize(relation_name);

		console.log(this, relationship_definition_from_schema);

		throw new Error(`HasOneThrough not defined!`);

		return <div>Relation: { relationship_definition_from_schema.relationName }</div>
	}


	/** */
	HasOne(relationship_definition_from_schema){
		const { related, foreignKey, localKey } = relationship_definition_from_schema;
		const M = Model.getModel(related);
		return M.firstWhere(foreignKey, this.props[localKey]);
/*

		throw new Error(`HasOne not defined!`);

		return <div>Relation: { relationship_definition_from_schema.HasOne.relationName }</div>
*/
	}

	/** */
	BelongsToMany(relationship_definition_from_schema){
// 		throw new Error(`BelongsToMany not defined!`);
		return <div>Relation: {relationship_definition_from_schema.relationName}</div>
	}

	/** */
	BelongsTo(relationship_definition_from_schema){
		const { relationName, foreignKey } = relationship_definition_from_schema;
		let plural = pluralize(relationName);
		let related_id = this.props[foreignKey];
		let Class_ = Model.models[pluralToClassName(relationName)];
		let found_item = app_get(`${plural}.${related_id}`);
		if(found_item instanceof Model){
			return found_item;
		}
// 		console.log('found_item', found_item, found_item instanceof Model);
		return <Class_ {...app_get(`${plural}.${related_id}`)}/>

	}

	/** */
	MorphTo(relationship_definition_from_schema){
		return <div>Relation: {relationship_definition_from_schema.relationName}</div>
	}

}

export default HasRelations;
