<?php
	require(dirname(__DIR__).'/vendor/autoload.php');
    $Parsedown = new Parsedown();
    $config = json_decode(file_get_contents(__DIR__ . "/_config.json"), true);
    foreach($config['pages'] as $page){
	    $my_html = $Parsedown->text(file_get_contents(__DIR__ . "/$page.md"));
	    @mkdir(__DIR__ . "/static/$page");
	    file_put_contents(__DIR__ . "/static/$page/index.html", $my_html);
    }

    die(var_dump($config));

    //return view('documentation', ['content' => $my_html]);
