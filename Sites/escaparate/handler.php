<?php

include 'ChromePhp.php';


if (isset($_POST["textA"])){

//Write text file

$text = $_POST['textA'];
$index = $_POST['articleA'];
$fileName = 'text/' . $index . '.txt';
$ret = file_put_contents($fileName, $text, LOCK_EX);
echo "$ret bytes written to text file. File name is $fileName";

//Write text file list
$txtFilelist = glob("text/*.txt");
$writeTxtIndex = file_put_contents('text/filelist' . '.txt', $txtFilelist , LOCK_EX);


//Write image file list
$imgFilelist = glob("img/content/*.*");
$writeImgIndex = file_put_contents('img/content/filelist' . '.txt', $imgFilelist, LOCK_EX);
}

//Write JSON
if (isset($_POST['dataJson'])){
$jsondata = $_POST['dataJson'];
$writeJson = file_put_contents('data_en.json', $jsondata);
}

