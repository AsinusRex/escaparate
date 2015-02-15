$(function () {
//Revert to root URL w/o parameters
    if (window.location.href.indexOf("?") > -1) {
        location.assign('backend.html');
    }

//Current Location initialize
    currentIdG = 0;
    entryType = '';
    parentId = 0;
    //Loading data...
    function loader() {
        $('#container').addClass('hide');
        lang = ['en', 'fr', 'ru', 'he'];

        $.getJSON('data_en.json', function (data)
        {
            data_en = data;
        });
        return $('body').append('<div id="loadScreen"><h1>Loading, please wait.</h1><img id="loading" src="img/resources/loading.png"></div>').delay(500);
    }
    ;
    $.when(loader()).done(function () {
        $('#container').removeClass('hide');
        $('#loadScreen').remove();
        $.each(data_en.category, function (i) {
            $('#category').append('<option id="' + data_en.category[i].categoryId + '">' + data_en.category[i].categoryName.split('<--name-->')[0]);
            i++;
        });
    });
    //reload buttons
    $(document).on('click', '#reload', function () {
        location.reload(true);
        ;
    });
    $(document).on('click', '#frontend', function () {
        window.open('index.html', '_blank');
        ;
    });
//Navigation Tree
    $(document).on('change', '#category', function ()
    {
        $('#subcategory').html('<option disabled selected>Choose a subcategory</option>');
        $('#catArea input').removeClass('hide');
        $('#subcatArea').removeClass('hide');
        var selectedElement = $(this).children(":selected").attr("id");
        $.each(data_en.category, function (entryIndex)
        {
            var categoryId = data_en.category[entryIndex].categoryId;
            //Load selected category
            if (categoryId === selectedElement)
            {
                var subcategory = data_en.category[entryIndex].subcategory;
                $.each(subcategory, function (subentryIndex)
                {
                    var subcategoryId = data_en.category[entryIndex].subcategory[subentryIndex].subcategoryId;
                    var subcategoryName = data_en.category[entryIndex].subcategory[subentryIndex].subcategoryName.split('<--name-->')[0];
                    $('#subcategory').append('<option id="' + subcategoryId + '">' + subcategoryName + '</option>');
                });
            }
        });
        imgLoader(data_en);
    }
    );
    function imgLoader(data) {
        $(document).on('change', '#subcategory', function () {
            $('#subcatArea input').removeClass('hide');
            $('#img').html('<option disabled selected>Choose an image</option>');
            var selectedElement = $(this).children(":selected").attr("id");
            var entryIndex = selectedElement[0];
            var subentryIndex = parseInt(selectedElement.slice(-2));
            var imgs = data.category[entryIndex].subcategory[subentryIndex].imgs;
            $('#imgArea').removeClass('hide');
            $('#subentryEdit').removeClass('hide');
            $.each(imgs, function (imgIndex) {
                var categoryId = data.category[entryIndex].categoryId;
                var subcategoryId = data.category[entryIndex].subcategory[subentryIndex].subcategoryId;
                var imgName = data.category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].imgName.split('<--name-->')[0];
                var imgId = data.category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].imgId;
                $('#img').append('<option id="' + imgId + '">' + imgName + '</option>');
            });
        });
        $(document).on('change', '#img', function () {
            $('#imgArea *').removeClass('hide');
        });
    }
//Limit textarea input
    $(document).on('keyup', '.articles', function () {
        var targetArea = $('#' + this.id);
        var targetCounter = $('#' + this.id + 'countdown');
        var areaText = targetArea.val();
        var currentTextLength = areaText.length;

        limitText(targetArea, targetCounter, currentTextLength, areaText);
    });
    function limitText(targetArea, targetCounter, currentTextLength, areaText) {

        var limitNum = 1200;
        if (currentTextLength > limitNum) {
            targetArea.val(areaText.substring(0, limitNum));
        } else {
            targetCounter.attr('value', limitNum - currentTextLength);
        }
    }
// Editing functions
    $(document).on('click', '.edit', function () {


        var currentCat = $("#category").val();
        if (currentCat === null) {
            currentCat = 'New entry';
        }
        var currentSubcat = $("#subcategory").val();
        var currentImg = $("#img").val();
        var currentType = this.id;
        var currentId = 0;
        var langName = ['English', 'French', 'Russian', 'Hebrew'];
        var textareas = [];
        $.each(lang, function (i) {
            textareas += '<span class="inputSpans"><br><label for="' + lang[i] + '">' + langName[i] + '</label><textarea class="articles" id="' + lang[i] + '" name="' + lang[i] + 'Text" rows="8" placeholder="Entry info" ></textarea>' + '<input readonly type="text" id="' + lang[i] + 'countdown" class="counters" size="5" value=""><p>Characters Left</p></span>';

            i++;
        });
        var content =
                '<h3>Enter a description for ' + currentCat + '</h3>' +
                '<p>Wrap internal links between <strong><--link--></strong> tags.  <br> Example <--link--> entry name <--link--><br>For external link and hierarchy use HTML tags.</p>' +
                '<input type="button" id="back" value="Back">' +
                '<form id="editAdd">' +
                '<fieldset id="imgLoad">' +
                '<br><label for="tags">Tags for Search (Separate with commas)</label>' +
                '<input id="tags" type="text" size="35"><br><br>' +
                '<label for="imgObj">Entry Image</label>' +
                '<img id="imgObj" alt="akoka"><br>' +
                '<input type="file" id="imgBrw" name="imgBrw">' +
                '<br><button id="entryInfoSubmit">Submit</button>' +
                '<button id="entryDelete">Delete</button></fieldset>' +
                textareas +
                '</form>'
                ;
        switch (currentType) {
            case 'catEdit':
                currentId = $("#category").children(":selected").attr("id");
                entryEdit(currentType, currentId);
                break;
            case 'subcatEdit':

                currentId = $("#subcategory").children(":selected").attr("id");
                entryEdit(currentType, currentId);
                break;
            case 'imgEdit':
                currentId = $("#img").children(":selected").attr("id");
                entryEdit(currentType, currentId);
                $('<label for="pdfObj">Include PDF</label><input type="file" id="pdfBrw" name="pdfBrw">').insertAfter('#tags');
                break;
            case 'catAdd':
                entryAdd(currentType);
                break;
            case 'subcatAdd':
                parentId = $("#category").children(":selected").attr("id");
                entryAdd(currentType, parentId);
                break;
            case 'imgAdd':
                parentId = $("#subcategory").children(":selected").attr("id");
                entryAdd(currentType, parentId);
                $('<label for="pdfObj">Include PDF</label><input type="file" id="pdfBrw" name="pdfBrw">').insertAfter('#tags');
                break;
        }
        if (currentSubcat === null) {
            currentSubcat = '';
        }
        if (currentImg === null) {
            currentImg = '';
        }

        //Edit entries
        function entryEdit(currentType, currentId) {
            entryType = currentType;
            currentIdG = currentId;
            $('#container').html('').append(content);
            var entryImg = '';
            var entryInfo = '';
            var entryName = '';

            if (currentType === 'catEdit') {
                entryImg = data_en.category[currentId].categoryImg;
                entryInfo = data_en.category[currentId].categoryInfo;
            } else if (currentType === 'subcatEdit') {
                entryImg = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].subcategoryImg;
                entryInfo = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].subcategoryInfo;
                entryName = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].subcategoryName.split('<--name-->')[0];
                $('h3').html('Enter a description for subcategory ' + entryName);
            }
            else if (currentType === 'imgEdit') {
                entryImg = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].imgs[parseInt(currentId.slice(3, 5))].imgImg;
                entryInfo = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].imgs[parseInt(currentId.slice(3, 5))].imgInfo;
                entryName = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].imgs[parseInt(currentId.slice(3, 5))].imgName.split('<--name-->')[0];
                $('h3').html('Enter a description for image ' + entryName);
            }
            $('#imgObj').attr('src', 'img/content/' + entryImg);
            $.get('text/' + entryInfo + '.txt', function (data) {
                currentData = data;
            }).done(function () {

                $.each(lang, function (i) {

                    var text = currentData.split('<--lang-->');
                    $('#' + lang[i]).html(text[i]);
                    var langName = '';
                    var langString = '';
                    var entryIndex = currentId[0];
                    var subentryIndex = parseInt(currentId.slice(1, 3));
                    var imgIndex = parseInt(currentId.slice(3, 5));
                    var searchTerms = '';
                    if (currentIdG.length === 1) {
                        langString = data_en.category[entryIndex].categoryName.split('<--name-->');
                        searchTerms = data_en.category[entryIndex].searchTerms;
                    }
                    else if (currentIdG.length === 3) {
                        langString = data_en.category[entryIndex].subcategory[subentryIndex].subcategoryName.split('<--name-->');
                        searchTerms = data_en.category[entryIndex].subcategory[subentryIndex].searchTerms;
                    }
                    else if (currentIdG.length === 5) {
                        langString = data_en.category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].imgName.split('<--name-->');
                        searchTerms = data_en.category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].searchTerms;
                    }
                    else {
                        console.log('there is something wrong with the indexing');
                    }
                    langName = langString[i];
                    $('<input type="text" id="' + lang[i] + 'Name"  name="' + lang[i] + 'Name" value="' + langName + '">').insertBefore('#' + lang[i]);
                    $('#tags').val(searchTerms);
                    i++;
                });
            });
        }
        ;
        function entryAdd(currentType, parentId) {
            entryType = currentType;
            $('#container').html('').append(content);
            $.each(lang, function (i) {
                $('<input type="text" id="' + lang[i] + 'Name" name="' + lang[i] + 'Name" placeholder="Entry Name">').insertBefore('#' + lang[i]);
            });
            if (entryType === 'subcatAdd') {
                $('h3').html('Enter a description for subcategory under ' + data_en.category[parentId].categoryName.split('<--name-->')[0]);
            }
            if (entryType === 'imgAdd') {
                $('h3').html('Enter a description for image under '
                        + data_en.category[parentId[0]].categoryName.split('<--name-->')[0]
                        + ' > '
                        + data_en.category[parentId[0]].subcategory[parseInt(parentId.slice(1, 3))].subcategoryName.split('<--name-->')[0]);
            }
        }
        ;
        return entryType;
    });



//Back function
    $(document).on('click', '#back', function () {
        location.reload(true);
    });
    // Browse function
    $(document).on('change', '#imgBrw', function () {
        var preview = document.getElementById('imgObj');
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            preview.src = reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = "";
        }
    });
    //Delete function
    $(document).on('click', '#entryDelete', function (e) {
        if (entryType.indexOf('Add') !== -1) {
            console.log('this is an add type ' + entryType);
            return location.reload(true);
        }
        else if (entryType.indexOf('Edit') !== -1) {
            console.log('this is an edit type ' + entryType);

            var confirmation = confirm('This action is not undoable and will delete any child entries as well. \n\n Are you sure?');
            if (confirmation) {
                console.log('Deleted' + currentIdG);
            }
            else {
                console.log('Cancelled');
                return false;
            }

            switch (entryType) {
                case 'catEdit':
                    var delTxt = [];
                    delTxt.push(data_en.category[currentIdG].categoryInfo + '.txt');
                    for (var i = 0; i < data_en.category[currentIdG].subcategory.length; i++) {
                        delTxt.push(data_en.category[currentIdG].subcategory[i].subcategoryInfo + '.txt');
                        for (var j = 0; j < data_en.category[currentIdG].subcategory[i].imgs.length; j++) {
                            delTxt.push(data_en.category[currentIdG].subcategory[i].imgs[j].imgInfo + '.txt');
                        }
                    }


                    var delImg = [];
                    delImg.push(data_en.category[currentIdG].categoryImg);
                    for (var i = 0; i < data_en.category[currentIdG].subcategory.length; i++) {
                        delImg.push(data_en.category[currentIdG].subcategory[i].subcategoryImg);
                        for (var j = 0; j < data_en.category[currentIdG].subcategory[i].imgs.length; j++) {
                            delImg.push(data_en.category[currentIdG].subcategory[i].imgs[j].imgImg);
                        }
                    }
                    data_en.category.splice(currentIdG, 1);
                    break;
                case 'subcatEdit':
                    var delTxt = [];
                    delTxt.push(data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].subcategoryInfo + '.txt');
                    for (var i = 0;
                            i < data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs.length;
                            i++) {
                        delTxt.push(data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[i].imgInfo + '.txt');
                    }
                    var delImg = [];
                    delImg.push(data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].subcategoryImg);
                    for (var i = 0;
                            i < data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs.length;
                            i++) {
                        delImg.push(data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[i].imgImg);
                    }
                    data_en.category[currentIdG[0]].subcategory.splice(parseInt(currentIdG.slice(1, 3)), 1);
                    break;
                case 'imgEdit':
                    var delTxt = [];
                    delTxt.push(data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[parseInt(currentIdG.slice(3, 5))].imgInfo + '.txt');
                    var delImg = [];
                    delImg.push(data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[parseInt(currentIdG.slice(3, 5))].imgImg);
                    data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs.splice(parseInt(currentIdG.slice(3, 5)), 1);
                    break;
            }
//reorder indexes

            $.each(data_en.category, function (i) {
                data_en.category[i].categoryId = String(i);
                $.each(data_en.category[i].subcategory, function (j) {
                    if (j < 10) {
                        var l = "0" + j;
                    }
                    data_en.category[i].subcategory[j].subcategoryId = String(i) + String(l);
                    $.each(data_en.category[i].subcategory[j].imgs, function (k) {
                        if (k < 10) {
                            var m = "0" + k;
                        }
                        data_en.category[i].subcategory[j].imgs[k].imgId = String(i) + String(l) + String(m);
                        k++;
                    });
                    j++;
                });
                i++;
            });
            //Refresh JSON
            var dataJson = JSON.stringify(data_en);
            $.ajax({
                type: "POST",
                url: "handler.php",
                data: {dataJson: dataJson},
                cache: false,
                success: function (result) {
                    console.log(result);
                },
                error: function (result) {
                    alert('error in json');
                }
            });
            //Delete text and img files
            $.ajax({
                url: "file_handler.php",
                type: "POST",
                data: {delTxt: delTxt, delImg: delImg},
                success: function () {
                    console.log('file deleted');
                },
                error: function () {
                    alert('file not deleted');
                }
            });
            return location.reload(true);
        }
        else {
            console.log(entryType);
        }

        e.preventDefault();
    });


// Submit function
    $(document).on('click', '#entryInfoSubmit', function (e) {

        //Prepare variables
        var currentIndex = String(data_en.category.length);

        if (data_en.category.length > 9) {
            alert('Max number of categories reached');
            return false;
        }


        // check number of articles and imgs for naming
        var articleA = Math.random().toString(36).substr(2, 5);
        $.get('text/filelist.txt', function (data) {
            var fileArray = data.split('.txttext/');
            fileArray[0] = fileArray[0].slice(5, 10);
            fileArray[fileArray.length - 1] = fileArray[fileArray.length - 1].slice(0, 5);
            fileArray;
            for (i = 0; i < fileArray.length; i++) {
                if (fileArray[i] === articleA) {
                    articleA = Math.random().toString(36).substr(2, 5);
                }

            }
            processData(articleA);
        });
//Process data

        function processData(articleA) {
            var imgA = String($('#imgBrw').val()).split('.');
            imgA = imgA[imgA.length - 1];
            if (imgA === '' && currentIdG.length <= 1) {
                imgA = data_en.category[currentIdG].categoryImg;
            }
            else if (imgA === '' && currentIdG.length === 3) {
                imgA = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].subcategoryImg;
            }
            else if (imgA === '' && currentIdG.length === 5) {
                imgA = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[parseInt(currentIdG.slice(3, 5))].imgImg;
            }
            //Check pic field
            if ($('#imgBrw').val() === '' && imgA === '') {
                alert('Error:\nNo image file for this category, please add one');
                return;
            }
            var newExt = imgA;

            imgA = String(articleA + '.' + imgA);

            var textA = '';
            $.each(lang, function (i) {
                var textValue = $('#' + lang[i]).val();
                if (i < 3) {
                    textValue = textValue + '<--lang-->';
                }
                textA += textValue;
                i++;
            });

            var nameA = '';
            $.each(lang, function (i) {
                var name = $('#' + lang[i] + 'Name').val();
                if (i < 3) {
                    name = name + '<--name-->';
                }
                ;
                nameA += name;
                i++;
            });

            var pdfFlag = 'off';
            if ($('#pdfBrw').length > 0 && $('#pdfBrw').val() !== '') {
                pdfFlag = 'on';
            }

            var json_en = '';
            var searchTerms = $('#tags').val();

            switch (entryType) {
                case 'catEdit':
                    articleA = data_en.category[currentIdG].categoryInfo;
                    imgA = data_en.category[currentIdG].categoryImg;
                    var currentExt = data_en.category[currentIdG].categoryImg.split('.');
                    currentExt = currentExt[currentExt.length - 1];
                    if ($('#imgBrw').val() === '') {
                        newExt = imgA.split('.');
                        newExt = newExt[newExt.length - 1];
                    }
                    if (newExt !== currentExt) {
                        imgA = articleA + '.' + newExt;
                        var oldImgA = articleA + '.' + currentExt;
                        console.log('different ext ' + newExt);
                        $.ajax({
                            url: "file_handler.php",
                            type: "POST",
                            data: {oldImgA: oldImgA},
                            success: function () {
                                console.log('img deleted');
                            },
                            error: function () {
                                console.log('img not deleted');
                            }
                        });
                    }
                    var tempSubcat = [];
                    for (var i = 0; i < data_en.category[currentIdG].subcategory.length; i++) {
                        tempSubcat.push(data_en.category[currentIdG].subcategory[i]);
                    }
                    json_en = {
                        "categoryName": nameA,
                        "categoryId": currentIdG,
                        "categoryInfo": articleA,
                        "categoryImg": imgA,
                        "searchTerms": searchTerms,
                        "subcategory": tempSubcat
                    };

                    data_en.category[currentIdG] = json_en;
                    console.log(json_en);
                    var tempData = [];
                    for (var i = 0; i < data_en.category.length; i++) {
                        tempData.push(data_en.category[i]);
                    }
                    data_en = tempData;
                    break;
                case 'subcatEdit':
                    articleA = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].subcategoryInfo;
                    imgA = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].subcategoryImg;
                    var currentExt = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].subcategoryImg.split('.');
                    currentExt = currentExt[currentExt.length - 1];
                    if ($('#imgBrw').val() === '') {
                        newExt = imgA.split('.');
                        newExt = newExt[newExt.length - 1];
                    }
                    if (newExt !== currentExt) {
                        imgA = articleA + '.' + newExt;
                        var oldImgA = articleA + '.' + currentExt;
                        console.log('different ext ' + newExt);
                        $.ajax({
                            url: "file_handler.php",
                            type: "POST",
                            data: {oldImgA: oldImgA},
                            success: function () {
                                console.log('img deleted');
                            },
                            error: function () {
                                console.log('img not deleted');
                            }
                        });
                    }

                    var tempImg = [];
                    for (var i = 0;
                            i < data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs.length;
                            i++) {
                        tempImg.push(data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[i]);
                        console.log(tempImg);
                    }
                    json_en = {
                        "subcategoryName": nameA,
                        "subcategoryId": currentIdG,
                        "subcategoryInfo": articleA,
                        "subcategoryImg": imgA,
                        "searchTerms": searchTerms,
                        "imgs": tempImg
                    };
                    data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))] = json_en;
                    console.log(json_en);
                    var tempData = [];
                    for (var i = 0; i < data_en.category.length; i++) {
                        tempData.push(data_en.category[i]);
                    }
                    data_en = tempData;
                    break;
                case 'imgEdit':
                    articleA = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[parseInt(currentIdG.slice(3, 5))].imgInfo;
                    imgA = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[parseInt(currentIdG.slice(3, 5))].imgImg;
                    var currentExt = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[parseInt(currentIdG.slice(3, 5))].imgImg.split('.');
                    currentExt = currentExt[currentExt.length - 1];
                    if ($('#imgBrw').val() === '') {
                        newExt = imgA.split('.');
                        newExt = newExt[newExt.length - 1];
                    }
                    if (newExt !== currentExt) {
                        imgA = articleA + '.' + newExt;
                        var oldImgA = articleA + '.' + currentExt;
                        console.log('different ext ' + newExt);
                        $.ajax({
                            url: "file_handler.php",
                            type: "POST",
                            data: {oldImgA: oldImgA},
                            success: function () {
                                console.log('img deleted');
                            },
                            error: function () {
                                console.log('img not deleted');
                            }
                        });
                    }
                   
                    json_en = {
                        "imgName": nameA,
                        "imgId": currentIdG,
                        "imgInfo": articleA,
                        "searchTerms": searchTerms,
                        "imgImg": imgA,
                        "pdfFlag": pdfFlag
                    };
                    data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1, 3))].imgs[parseInt(currentIdG.slice(3, 5))] = json_en;
                    console.log(json_en);
                    var tempData = [];
                    for (var i = 0; i < data_en.category.length; i++) {
                        tempData.push(data_en.category[i]);
                    }
                    data_en = tempData;
                    break;
                case 'catAdd':
                    json_en = {
                        "categoryName": nameA,
                        "categoryId": currentIndex,
                        "categoryInfo": articleA,
                        "searchTerms": searchTerms,
                        "categoryImg": imgA,
                        "subcategory": []
                    };
                    var tempData = [];
                    for (var i = 0; i < data_en.category.length; i++) {
                        tempData.push(data_en.category[i]);
                    }
                    tempData.push(json_en);
                    data_en = tempData;
                    break;
                case 'subcatAdd':
                    var subcatIndex = data_en.category[parentId].subcategory.length;
                    console.log(subcatIndex);
                    if (subcatIndex <= 9) {
                        subcatIndex = '0' + subcatIndex;
                    }
                    currentIndex = String(parentId + subcatIndex);
                    console.log('currentIndex ' + currentIndex);
                    json_en = {
                        "subcategoryName": nameA,
                        "subcategoryId": currentIndex,
                        "subcategoryInfo": articleA,
                        "searchTerms": searchTerms,
                        "subcategoryImg": imgA,
                        "imgs": []
                    };
                    var tempData = [];
                    for (var i = 0; i < data_en.category.length; i++) {
                        tempData.push(data_en.category[i]);
                    }

                    tempData[parentId].subcategory.push(json_en);
                    data_en = tempData;
                    break;
                case 'imgAdd':
                    var catId = parentId[0];
                    var subcatId = parseInt(parentId.slice(1, 3));
                    console.log(subcatId);
                    var imgIndex = data_en.category[catId].subcategory[subcatId].imgs.length;
                    console.log(imgIndex);
                    if (imgIndex <= 9) {
                        imgIndex = '0' + imgIndex;
                    }
                    currentIndex = String(parentId + imgIndex);
                    console.log('currentIndex ' + currentIndex);
                    json_en = {
                        "imgName": nameA,
                        "imgId": currentIndex,
                        "imgInfo": articleA,
                        "searchTerms": searchTerms,
                        "imgImg": imgA,
                        "pdfFlag": pdfFlag
                    };
                    var tempData = [];
                    for (var i = 0; i < data_en.category.length; i++) {
                        tempData.push(data_en.category[i]);
                        for (var j = 0; j < data_en.category[i].subcategory.length; j++) {

                        }
                    }
                    console.log(parentId);
                    tempData[catId].subcategory[subcatId].imgs.push(json_en);
                    data_en = tempData;
                    break;
            }

 if (pdfFlag === 'on') {
            var input = document.getElementById("pdfBrw");
            file = input.files[0];
            if (file !== undefined) {
                formData = new FormData();
                if (file.type === 'application/pdf') {
                    formData.append("pdf", file);
                    formData.append("pdfA", articleA + '.pdf');
                    $.ajax({
                        url: "file_handler.php",
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function () {
                            console.log('PDF copied');
                        },
                        error: function () {
                            alert('PDF copy failed');
                        }
                    });
                } else {
                    alert('Not a valid PDF');
                }
            } else {
                console.log('No PDF change');
            }             
                    }
            var input = document.getElementById("imgBrw");
            file = input.files[0];
            if (file !== undefined) {
                formData = new FormData();
                if (!!file.type.match(/image.*/)) {
                    formData.append("image", file);
                    formData.append("nameA", imgA);
                    $.ajax({
                        url: "file_handler.php",
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function () {
                            console.log('img copied');
                        },
                        error: function () {
                            alert('img copy failed');
                        }
                    });
                } else {
                    alert('Not a valid image');
                }
            } else {
                console.log('No image change');
            }

            e.preventDefault();
            var dataJson = JSON.stringify(data_en);
            dataJson = '{"category":' + dataJson + '}';
            $.ajax({
                type: "POST",
                url: "handler.php",
                data: {textA: textA, imgA: imgA, articleA: articleA, dataJson: dataJson},
                cache: false,
                success: function (result) {
                    console.log(result);
                    return location.reload(true);
                },
                error: function () {
                    alert('file copy failed');
                }
            });
            ;
        }
        ;
        return false;
    });
});

