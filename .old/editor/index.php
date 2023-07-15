<?php
    /**
     * Editor.php
     */
    if(!is_file('config.json')){
        header ("status: 301");
        header ("Location: install.php");
        die('Install first.');
    }
    $config = json_decode(file_get_contents('config.json'));
    $path = str_replace($config['prefix'],$config['real']);
    if(!file_exists($path) || !is_file($path))
        die('找不到对应的文件')
?>