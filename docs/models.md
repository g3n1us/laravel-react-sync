# Laravel React Sync

## Models/Eloquent.js

- [Introduction](#introduction)

<a name="introduction"></a>
Models in LRS function similar to what you are familiar with. 
Here is an example to better explain:

You can and should create models using the built in LRS artisan command:

```
php artisan make:react_model
```

You will be interactively asked for a model name and both a JavaScript and PHP model will be created in `app/Models`

Using the model name `Cheetah` you would, have:
`app/Models/Cheetah.js` 
```
import React, { Component } from 'react';
import { Model } from 'laravel_react_sync';
/**
@extends Model
*/
class Cheetah extends Model{

	static get defaultProps(){
		return {
			...Model.defaultProps,
			// name: 'value',
		};
	}


	/** */
	static get editable_props(){
		return [
			//
		];
	}

    renderDefault(){
		return (<h2>{this.constructor.name}</h2>);
    }

}

export default Cheetah;
```

and
`app/Models/Cheetah.php`

```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cheetah extends Model
{
    //
}

```

Your JS component extends the standard React component. It allows you to save back to the database, receive updates when the application state changes and query similar to the way Eloquent works on the Laravel side.

Here are some examples of querying:

```
// Note in all of the following, the `renderDefault` method will be rendered
// Retrieves a cheetah model with the id of 4
<Cheetah find={4} />

// Returns a paginated array of cheetahs:
<Pagination />
<Cheetah all />

// Cheetahs with few spots
<Cheetah where={['spots', '<', 30]} />
```
