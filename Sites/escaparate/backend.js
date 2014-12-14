$(function () {


//Current Location initialize
    currentIdG = 0;
    entryType = '';
    parentId = 0;
    //Loading data...
    function loader() {
        $('#container').addClass('hide');
        lang = ['en', 'fr', 'ru', 'he'];
        $.each(lang, function (i) {
            $.getJSON('data_' + lang[i] + '.json', function (data)
            {
                if (lang[i] === 'en') {
                    data_en = data;
                }
                else if (lang[i] === 'fr') {
                    data_fr = data;
                }
                else if (lang[i] === 'ru') {
                    data_ru = data;
                }
                else if (lang[i] === 'he') {
                    data_he = data;
                }
                i++;
            });
        });
        return $('body').css('background', 'rgba(0,0,0,0.1)').append('<div id="loadScreen"><h1>Loading, please wait.</h1><img id="loading" src="img/resources/loading.png"></div>').delay(500);
    }
    ;
    $.when(loader()).done(function () {
        $('body').css('background', 'none');
        $('#container').removeClass('hide');
        $('#loadScreen').remove();
        $.each(data_en.category, function (i) {
            $('#category').append('<option id="' + data_en.category[i].categoryId + '">' + data_en.category[i].categoryName);
            i++;
        });
    });
    $(document).on('click', '#reload', function () {
        window.location = 'backend.html';
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
                    var subcategoryName = data_en.category[entryIndex].subcategory[subentryIndex].subcategoryName;
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
                var imgName = data.category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].imgName;
                var imgId = data.category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].imgId;
                $('#img').append('<option id="' + imgId + '">' + imgName + '</option>');
            });
        });
        $(document).on('change', '#img', function () {
            $('#imgArea *').removeClass('hide');
        });
    }

// Editing functions
    $(document).on('click', '.edit', function () {


        var currentCat = $("#category").val();
        var currentSubcat = $("#subcategory").val();
        var currentImg = $("#img").val();
        var currentType = this.id;
        var currentId = 0;
        var content =
                '<h3>Enter a description</h3>' +
                '<input type="button" id="back" value="Back">' +
                '<form id="editAdd">' +
                '<fieldset id="imgLoad">' +
                '<img id="imgObj" alt="akoka"><br>' +
                '<input type="file" id="imgBrw" name="imgBrw"></fieldset>' +
                '<label for="en">English</label>' +
                '<textarea id="en" name="enText" rows="8" placeholder="Entry info"></textarea>' + '<label for="fr">French</label>' +
                '<textarea id="fr" name="frText" rows="8" placeholder="Entry info"></textarea>' + '<label for="ru">Russian</label>' +
                '<textarea id="ru" name="ruText" rows="8" placeholder="Entry info"></textarea>' + '<label for="he">Hebrew</label>' +
                '<textarea id="he" name="heText" rows="8" placeholder="Entry info"></textarea>' +
                '<button id="entryInfoSubmit" >Submit</button>' +
                '<button id="entryDelete">Delete</button>' +
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
                break;
            case 'catAdd':
                entryAdd(currentType);
                break;
            case 'subcatAdd':
                parentId = $("#category").children(":selected").attr("id");
                entryAdd(currentType, parentId);
                console.log('parentId' + parentId);
                break;
            case 'imgAdd':
                parentId = $("#subcategory").children(":selected").attr("id");
                entryAdd(currentType, parentId);
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
            if (currentType === 'catEdit') {
                entryImg = data_en.category[currentId].categoryImg;
                entryInfo = data_en.category[currentId].categoryInfo;
                console.log(entryInfo);

            } else if (currentType === 'subcatEdit') {
                entryImg = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].subcategoryImg;
                entryInfo = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].subcategoryInfo;
                console.log(entryInfo);
            }
            else if (currentType === 'imgEdit') {
                entryImg = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].imgs[parseInt(currentId.slice(3, 5))].imgImg;
                entryInfo = data_en.category[currentId[0]].subcategory[parseInt(currentId.slice(1, 3))].imgs[parseInt(currentId.slice(3, 5))].imgInfo;
                console.log(entryInfo);
            }
            $('#imgObj').attr('src', 'img/content/' + entryImg);

            $.get('text/' + entryInfo + '.txt', function (data) {
                currentData = data;
            }).done(function () {

                $.each(lang, function (i) {

                    var text = currentData.split('<--lang-->');
                    $('#' + lang[i]).html(text[i]);
                    var dataIndex = [data_en, data_fr, data_ru, data_he];
                    var langName = '';
                    var entryIndex = currentId[0];
                    var subentryIndex = parseInt(currentId.slice(1, 3));
                    var imgIndex = parseInt(currentId.slice(3, 5));
                    console.log('currentIdG ' + currentIdG + 'currentId ' + currentId);
                    if (currentIdG.length === 1) {
                        langName = dataIndex[i].category[entryIndex].categoryName;
                    }
                    else if (currentIdG.length === 3) {
                        langName = dataIndex[i].category[entryIndex].subcategory[subentryIndex].subcategoryName;
                    }
                    else if (currentIdG.length === 5) {
                        langName = dataIndex[i].category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].imgName;
                    }
                    else {
                        console.log('there is something wrong with the indexing');
                    }
                    $('<input id="' + lang[i] + 'Name"  name="' + lang[i] + 'Name" value="' + langName + '">').insertBefore('#' + lang[i]);
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
                $('h3').html('Enter a description for subcategory under ' + data_en.category[parentId].categoryName);
            }
            if (entryType === 'imgAdd') {
                $('h3').html('Enter a description for subcategory under '
                        + data_en.category[parentId[0]].categoryName
                        + ' > '
                        + data_en.category[parentId[0]].subcategory[parseInt(parentId.slice(1, 3))].subcategoryName);
            }
        }
        ;
        return entryType;
    });
//Back function
    $(document).on('click', '#back', function () {
        location.reload();
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

        var confirmation = confirm('This action is not undoable. Are you sure?');
        if (confirmation) {
            console.log('Deleted' + currentIdG);
        }
        else {
            console.log('Cancelled');
        }
        if (entryType.indexOf('Add') !== -1) {
            console.log('this is an add type ' + entryType);
            return window.location.href = window.location.pathname;
        }
        else if (entryType.indexOf('Edit') !== -1) {
            console.log('this is an edit type ' + entryType);
        }
        else {
            console.log(entryType);
        }
        e.preventDefault();
    });
//Check fields

    $(document).on('change', 'input, textarea', function () {
        var fields = $('#editAdd').find('input, textarea');
        var c = 0;
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].value.length === 0) {
                c++;
            }

        }
        if (c === 0) {
            $("#entryInfoSubmit").prop("disabled", false);
        }
    });

// Submit function
    $(document).on('click', '#entryInfoSubmit', function (e) {

        //Prepare variables
        var currentIndex = String(data_en.category.length);
        // check number of articles and imgs for naming
        var articleA = Math.random().toString(36).substr(2, 5);
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
        var newExt = imgA;
        console.log('new Extension ' + newExt);
        imgA = String(articleA + '.' + imgA);
        var textA = '';
        $.each(lang, function (i) {
            var textValue = $('#' + lang[i]).val();
            textA += textValue + '<--lang-->';
            i++;
        });
        var nameA = [];
        $.each(lang, function (i) {
            var name = $('#' + lang[i] + 'Name').val();
            nameA.push(name);
            i++;
        });
        var json_en = '';
        console.log(entryType);
        switch (entryType) {

            case 'catEdit':
                articleA = data_en.category[currentIdG].categoryInfo;
                imgA = data_en.category[currentIdG].categoryImg;
                var currentExt = data_en.category[currentIdG].categoryImg.split('.');
                currentExt = currentExt[currentExt.length - 1];
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
                    console.log(tempSubcat);
                }
                json_en = {
                    "categoryName": nameA[0],
                    "categoryId": currentIdG,
                    "categoryInfo": articleA,
                    "categoryImg": imgA,
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
                articleA = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1,3))].subcategoryInfo;
                imgA = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1,3))].subcategoryImg;
                var currentExt = data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1,3))].subcategoryImg.split('.');
                currentExt = currentExt[currentExt.length - 1];
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
                for (var i = 0; i < data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1,3))].imgs.length; i++) {
                    tempImg.push(data_en.category[currentIdG[0]].subcategory[parseInt(currentIdG.slice(1,3))].imgs[i]);
                    console.log(tempImg);
                }
                json_en = {
                    "subcategoryName": nameA[0],
                    "subcategoryId": currentIdG,
                    "subcategoryInfo": articleA,
                    "subcategoryImg": imgA,
                    "imgs": tempImg
                };

                data_en.category[currentIdG] = json_en;
                console.log(json_en);
                var tempData = [];
                for (var i = 0; i < data_en.category.length; i++) {
                    tempData.push(data_en.category[i]);
                }
                data_en = tempData;
                break;

            case 'imgEdit':

                break;

            case 'catAdd':
                json_en = {
                    "categoryName": nameA[0],
                    "categoryId": currentIndex,
                    "categoryInfo": articleA,
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
                    "subcategoryName": nameA[0],
                    "subcategoryId": currentIndex,
                    "subcategoryInfo": articleA,
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
                    "imgName": nameA[0],
                    "imgId": currentIndex,
                    "imgInfo": articleA,
                    "imgImg": imgA
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
                    }
                });
            } else {
                alert('Not a valid image!');
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
            }
        });
        return window.location = 'backend.html';

    });
});

