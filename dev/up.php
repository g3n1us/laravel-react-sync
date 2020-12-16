#!/usr/bin/env php
<?php
$tmplaravelrootname = '.laravel' . time();
$parent_dir = dirname(getcwd());
$tmplaravelroot = "$parent_dir/$tmplaravelrootname";

if(!file_exists(getcwd() . "/webpack.mix.js")){
	throw new \Exception('Must be run from the repo root');
	exit();
}

exec('git branch --show-current', $branch);
$branch = $branch[0];

chdir($parent_dir);

exec("laravel new $tmplaravelrootname");

chdir($tmplaravelrootname);

exec('composer config repositories.laravel_react_sync "{\"type\":\"path\",\"url\":\"../laravel-react-sync\"}"');
exec("composer require g3n1us/laravel-react-sync dev-$branch");
exec('php artisan ui react-sync --option=continue');
file_put_contents(".env", "DB_CONNECTION=sqlite\n", FILE_APPEND | LOCK_EX);
file_put_contents(".env", "DB_DATABASE=\"$tmplaravelroot/database/database.sqlite\"\n", FILE_APPEND | LOCK_EX);
file_put_contents(".env", "APP_URL=\n", FILE_APPEND | LOCK_EX);

touch("database/database.sqlite");
touch("resources/sass/app.scss");
exec('php artisan migrate');
// exec('npm install && npm start');
echo "\n" . $tmplaravelroot . "\n";
