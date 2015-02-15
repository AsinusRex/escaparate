<?php

if (isset($_POST["nameA"])) {
    $name = $_POST['nameA'];
    $dir = "img/content/$name";
    move_uploaded_file($_FILES["image"]["tmp_name"], $dir);
};

if (isset($_POST["oldImgA"])) {
    $oldFile = $_POST["oldImgA"];
    $fullFile = "img/content/$oldFile";
    unlink($fullFile);
};

if (isset($_POST["delTxt"])) {
    $delTxt = $_POST["delTxt"];
    $delTxtLength = count($delTxt);
    for ($i = 0; $i < $delTxtLength; $i++) {
        $tempTxt = $delTxt[$i];
        $fullTxt = "text/$tempTxt";
        unlink($fullTxt);
    }
}

if (isset($_POST["delImg"])) {
    $delImg = $_POST["delImg"];
    $delImgLength = count($delImg);
    for ($i = 0; $i < $delImgLength; $i++) {
        $tempImg = $delImg[$i];
        $fullImg = "img/content/$tempImg";
        unlink($fullImg);
    }
}

if (isset($_POST["pdfA"])) {
    $name = $_POST['pdfA'];
    $dir = "pdf/$name";
    move_uploaded_file($_FILES["pdf"]["tmp_name"], $dir);
};
?>