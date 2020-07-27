<?php

use Illuminate\Filesystem\Filesystem;
use G3n1us\LaravelReactSync\ReactSyncPreset;
use G3n1us\LaravelReactSync\Paths;
use \G3n1us\LaravelReactSync\Utils;


Artisan::command('make:react_model {name?}', function($name = null){
	ReactSyncPreset::ensurePagesModelsDirectoriesExist();
	if($name === null){
		$name = $this->ask('What is your name of the model?');
	}
    $namespace = config('react_sync.namespace');
    $name_plural = str_plural($name);
    $tablename = str_plural(snake_case($name));
	$model_tpl = file_get_contents(__DIR__.'/react-sync-stubs/model.stub');
	$rendered_model = str_replace('{{ namespace }}', "$namespace\\Models", $model_tpl);
	$rendered_model = str_replace('{{ class }}', $name, $rendered_model);
	file_put_contents(Paths::app_path("Models/$name.php"), $rendered_model);

	$migration_tpl = file_get_contents(__DIR__.'/react-sync-stubs/migration.create.stub');

	$rendered_migration = str_replace('{{ table }}', $tablename, $migration_tpl);
	$rendered_migration = str_replace('{{ class }}', "Create{$name_plural}Table", $rendered_migration);
	$migration_filename = implode('_', [\Carbon\Carbon::now()->format('Y_m_d_hms'), 'create', $tablename, 'table']) . '.php';
	file_put_contents(Paths::database_path("migrations/$migration_filename"), $rendered_migration);

// 	Artisan::call("make:model -m -f $path");
	$tpl = file_get_contents(__DIR__ . '/js_file_templates/model.blade.js');
	$rendered = str_replace('{{$name}}', $name, $tpl);
	file_put_contents(Paths::app_path("Models/$name.js"), $rendered);
	$this->call('react_sync:all');
	$this->comment("Model: $name created");
});




Artisan::command('make:react_page {name?}', function($name = null){
	ReactSyncPreset::ensurePagesModelsDirectoriesExist();
	if($name === null){
		$name = $this->ask('What is your name of the page?');
	}
	$name = $basenamestring = preg_replace('/^(.*?)_page$/', '$1', snake_case($name));
	$prefix = config('react_sync.pages_prefix');
	$namespace = config('react_sync.namespace');

	$pathname = Str::start($prefix.'/'.Str::kebab($name), '/');

	$name = studly_case($name) . 'Page';
	$models = Utils::listModels()->map(function($m){
		return [Utils::standardizedModelString($m) => $m];
	})->collapse(1);

	$replacements = [
		'{{$name}}'       => $name,
		'{{ namespace }}' => "$namespace\\Pages",
		'{{$singular}}'   => Str::singular($basenamestring),
		'{{$plural}}'     => $basenamestring,
	];

	if($related_model = $models->get(Utils::standardizedModelString($basenamestring))){
		$related_model = ltrim($related_model, '\\');
		$singular = Str::singular($basenamestring);
		$plural = Str::plural($basenamestring);
		$this->comment("You appear to be creating a page associated with: " . $related_model);
		if($this->confirm("Would you like to use this model with this page?", 'y')){
			$replacements = $replacements + [
				'{{$model_use_statement}}' => "use $related_model;" . PHP_EOL,
				'{{$model_props}}'         => PHP_EOL."\tpublic $" . "$singular;" . PHP_EOL.PHP_EOL . "\tpublic $" . "$plural;".PHP_EOL,
				'{{$model_arg}}'           => class_basename($related_model) . " $" . "$singular = null",
				'{{$slug}}'                => $pathname . '/{' . $singular . '?}',
				'{{$js_import}}'           => "import { BasicLayout } from 'laravel_react_sync';".PHP_EOL."import { ". class_basename($related_model) ." } from 'models';" . PHP_EOL,
				'{{$php_fn_body}}'         => '
		if($'.$singular.'){
			$this->'.$singular.' = $'.$singular.';
		}
		else {
			$this->'.$plural.' = '.class_basename($related_model).'::paginate();
		}
',
				'{{$render_body}}'         => "
		const { $singular } = this.props;
		return (
			<BasicLayout>
				{".$singular." ? this.renderSingle() : this.renderMany()}
			</BasicLayout>
		);
",
				'{{$renders}}'             => "
	renderSingle() {
		const { $singular } = this.props;
		return " . $singular . ".show();
	}

	renderMany() {
		const { $plural } = this.props;
		return $plural.map(v => v.show());
	}

",

			];

		}
		else{
			$replacements = $replacements + [
				'{{$model_use_statement}}' => "",
				'{{$model_props}}'         => '// public $props_item;',
				'{{$model_arg}}'           => "",
				'{{$slug}}'                => $pathname,
				'{{$render_body}}'         => "return (<h2>$name</h2>);",
				'{{$renders}}'             => "",
				'{{$js_import}}'           => "",
				'{{$php_fn_body}}'         => "",
			];
		}



	}

	$rendered = file_get_contents(__DIR__ . '/js_file_templates/page_php.blade.js');
	$js_rendered = file_get_contents(__DIR__ . '/js_file_templates/page.blade.js');

	foreach($replacements as $find => $replacement){
		$rendered = str_replace($find, $replacement, $rendered);
		$js_rendered = str_replace($find, $replacement, $js_rendered);
	}

	if(file_exists(Paths::app_path("Pages/$name.php")) || file_exists(Paths::app_path("Pages/$name.js"))){
		throw new \Exception("The file already exists.");
	}

	file_put_contents(Paths::app_path("Pages/$name.php"), $rendered);

	file_put_contents(Paths::app_path("Pages/$name.js"), $js_rendered);

	$this->info("Page: $name created");
	$this->info("route registered at: " . url($pathname));

	$this->call('react_sync:all');
});




if(!function_exists('get_schemas')){
	function get_schemas(){
	    return Utils::get_schemas();
	}
}


Artisan::command('react_sync:all', function(){
	$this->call('react_sync:write_schemas');
	$this->call('react_sync:write_index_files');
})->describe('Write metadata and other data files required for Laravel React Sync');



Artisan::command('react_sync:write_schemas', function () {
    $items = [
        [Paths::resource_path('js/schema.js'), Utils::get_schemas()],
        [Paths::resource_path('js/model_properties.js'), Utils::get_model_properties()],
    ];

    $filecomments = "/****************************************************
 *
 * THIS FILE IS AUTOMATICALLY GENERATED. DO NOT EDIT.
 *
 ****************************************************
 */
 ";

    foreach($items as $tuple){
        [$path, $file_contents] = $tuple;

        $file_contents = "export default $file_contents;\n";
        file_put_contents($path, "$filecomments$file_contents");
        $name = basename($path);
        $this->comment("\n $name written to $path \n\n");

    }


})->describe('Write out schemas to js directory');


if(!function_exists('write_index_files')){
	function write_index_files($_this){
	    // put a file called .index in a directory you want to index
	    // this runs recursively

	    $dir_start = Paths::base_path();
	    $fs = new Filesystem;
	    $dirs = collect($fs->allFiles($dir_start))
	        ->map(function($f){ return $f->getPath(); })
	        ->unique()
	        ->filter(function($dir) use($fs){
	            return $fs->exists("$dir/.index");
	        });
	    $dirs->each(function($dir) use($fs, $_this){
	        $filenames = collect($fs->files($dir));
	        $names = $filenames->map(function($file)use ($fs){
	            $path = $file->getPathName();
	            $name = $fs->name($path);
	            if($name != 'index' && preg_match('/^js.?$/', $fs->extension($path))){
	                return $name;
	            }
	            return null;
	        })->filter();
	        $imports = $names->map(function($name){
	            return "import $name from './$name';";
	        })->implode("\n");
	        $exports = $names->implode(", ");
	//
	$filecomments = "/****************************************************
	 *
	 * THIS FILE IS AUTOMATICALLY GENERATED. DO NOT EDIT.
	 *
	 ****************************************************
	 */
	 ";

	$contents = "
	$filecomments
	$imports

	export { $exports };
	";
	        $fs->put("$dir/index.js", trim($contents) . "\n");
	        $_this->comment("\n index.js written to $dir \n\n");
	    });

    //update models.json
    $possible_models = Utils::listModels();
    $fs->put(Paths::app_path("Models/models.json"), $possible_models->toJSON());
	$_this->comment("\n models.json updated in ".Paths::app_path("Models")." \n\n");

    //update pages.json
    $possible_pages = Utils::listPages();
    $fs->put(Paths::app_path("Pages/pages.json"), $possible_pages->toJSON());
	$_this->comment("\n pages.json updated in ".Paths::app_path("Pages")." \n\n");
	}
}


Artisan::command('react_sync:write_index_files', function(){
    // put a file called .index in a directory you want to index
    write_index_files($this);
});
