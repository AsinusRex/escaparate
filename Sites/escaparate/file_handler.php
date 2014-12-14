<?php
$name = $_POST['nameA'];
$dir = "img/content/$name";
move_uploaded_file($_FILES["image"]["tmp_name"], $dir);

if (isset($_POST["oldImgA"])){
    $oldFile = $_POST["oldImgA"];
    $fullFile = "img/content/$oldFile";
    unlink($fullFile);
};
?>