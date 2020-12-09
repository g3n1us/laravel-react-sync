#!/usr/bin/env php
<?php
$tmplaravelrootname = '.laravel' . time();
$tmplaravelroot = dirname(getcwd()) . "/$tmplaravelrootname";

exec('git branch --show-current', $branch);
$branch = $branch[0];

chdir(dirname(getcwd()));

exec("laravel new $tmplaravelrootname");

chdir($tmplaravelrootname);

exec('composer config repositories.laravel_react_sync "{\"type\":\"path\",\"url\":\"../laravel-react-sync\"}"');
exec("composer require g3n1us/laravel-react-sync dev-$branch");
exec('php artisan ui react-sync --option=continue');
file_put_contents(".env", "DB_CONNECTION=sqlite\n", FILE_APPEND | LOCK_EX);
file_put_contents(".env", "DB_DATABASE=\"$tmplaravelroot/database/database.sqlite\"\n", FILE_APPEND | LOCK_EX);
file_put_contents(".env", "APP_URL=\n", FILE_APPEND | LOCK_EX);

touch("database/database.sqlite");
exec('php artisan migrate');
exec('npm install && npm start');
echo "\n" . $tmplaravelroot . "\n";
