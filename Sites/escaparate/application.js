//Initialize data
var lang = ['en', 'fr', 'ru', 'he'];
var langName = ['English', 'Français', 'Ру́сский', 'עברית'];
var currentLang = 0;
var data = $.getJSON('data_en.json', function (dataJson) {
    data = dataJson;
}).done(function () {
    var loadedText = [];
    populateFooter();
    function populateFooter() {
        var enBtn = ['Contact Us', 'Meet Gal Akoka', 'Language', 'Search'];
        var frBtn = ['Contactez-nous', 'Rencontrer Gal Akoka', 'Langue', 'Recherche'];
        var ruBtn = ['Контакты', 'Знакомства Гал Акока', 'Язык', 'поиск'];
        var heBtn = ['צור קשר', 'תכירו את גל אקוקה', 'שפה', 'חיפוש'];
        var btnArray = [enBtn, frBtn, ruBtn, heBtn];
        $.each($('#footer button'), function (i) {
            $('#' + this.id).html(btnArray[currentLang][i]);
            i++;
        });
    }
//Views
    function viewControl(viewType) {
        switch (viewType) {
            case 'normal':
                $('#main').removeAttr('style');
                $('#nav').removeClass('hide');
                $('#footer').removeClass('hide');
                break;
            case 'full':
                $('#main').css({width: '102vw', padding: '0'});
                $('#nav').addClass('hide');
                $('#footer').addClass('hide');
                break;

        }
    }
    function langView() {
        $('#main').html('<img id="logoLang" src="img/resources/logo.png" alt="Optimized for 21st century browsers"><span id="langlist"></span>').css('background', 'white');

        $.each(lang, function (i) {
            $('#langlist').append('<button class="langBtn" id="' + lang[i] + '">' + langName[i] + '</button>');
            i++;
        });
        //('body').css('background','white');
        viewControl('full');
    }

//Control
    $(function () {

//check for language in cookie and if not offer a language

        if (document.cookie.indexOf('akoka_lang') === -1) {
            langView();
        }
        else {
            currentLang = document.cookie.split('=')[1];
            homeMenu(currentLang);
        }
        function setLang(langId) {
            currentLang = lang.indexOf(langId);
            document.cookie = 'akoka_lang =' + currentLang;
            homeMenu(currentLang);
            populateFooter();
        }
        $(document).on('click', '.langBtn', function () {
            var langId = this.id;
            setLang(langId);


        });

    });

//Main sequence
    function homeMenu(currentLang) {
//video background        
        var videoCheck = $('video').length;
        if (videoCheck < 1) {
            $('#layoutWrapper').prepend('<video id="introVid" width="100%" height="100%" preload="auto" autoplay loop >  <source src="img/resources/intro.mp4" type="video/mp4">Cannot use this</video>').css('background', 'black');
        }
        $('#main').html('');
        populateFooter();
        viewControl('normal');



//Populate menu
        $('#menuBtns').html('');
        $.each(data.category, function (i) {
            $('#menuBtns').append('<span id="span' + i + '" class="catSpan"><button class="catBtns" id="' + data.category[i].categoryId + '">' + data.category[i].categoryName.split('<--name-->')[currentLang] + '</button></span>');

            $.each(data.category[i].subcategory, function (j) {
                $('<button class="subcatBtns hide" id="' + data.category[i].subcategory[j].subcategoryId + '">' + data.category[i].subcategory[j].subcategoryName.split('<--name-->')[currentLang] + '</button>').appendTo($('#' + i).parent());
                j++;
            });
            i++;
        });

    }
    ;

    //Clicks
//Home 
    $('#logomenu').on('click', function () {
        homeMenu(currentLang);
    });

//toggle submenu and load subcats in main
    $(document).on('click', '.catBtns', function () {
        var catId = this.id;
        var catInfo = data.category[catId].categoryInfo;
        var catName = data.category[catId].categoryName.split('<--name-->')[currentLang];
        var catText = '';
        $(this).parent().find('.subcatBtns').toggleClass('hide');
        $('video').remove();
        $('#layoutWrapper').css({'background': 'url(img/content/' + data.category[catId].categoryImg + ')'});
        $('.entryInfo').remove();

        if (loadedText.indexOf(catId) === -1) {
            $.get('text/' + catInfo + '.txt', function (text) {
                catText = text.split('<--lang-->')[currentLang];
                loadedText.push(catId, catName, catText);
                $('#main').append('<span class="entryInfo">' + catText + '</span>');
            });
        }

        else {
            var catTextIndex = parseInt(loadedText.indexOf(catId)) + 2;
            catText = loadedText[catTextIndex];
            $('#main').append('<span class="entryInfo">' + catText + '</span>');
        }


    });
    $(document).on('click', '.subcatBtns', function () {
        var subcatId = this.id;
        var catIndex = subcatId[0];
        var subcatIndex = parseInt(this.id.slice(1, 3));
        var subcatInfo = data.category[catIndex].subcategory[subcatIndex].subcategoryInfo;
        var subcatName = data.category[catIndex].subcategory[subcatIndex].subcategoryName.split('<--name-->')[currentLang];
        var subcatText = '';
        $('#layoutWrapper').css({'background': 'url(img/content/' + data.category[catIndex].subcategory[subcatIndex].subcategoryImg + ')'});
        $('.entryInfo').remove();
        if (loadedText.indexOf(subcatId) === -1) {
            $.get('text/' + subcatInfo + '.txt', function (text) {
                subcatText = text.split('<--lang-->')[currentLang];
                loadedText.push(subcatId, subcatName, subcatText);
                $('#main').append('<span class="entryInfo">' + subcatText + '</span>');
            });
        }

        else {
            var subcatTextIndex = parseInt(loadedText.indexOf(subcatId) + 2);
            subcatText = loadedText[subcatTextIndex];
            $('#main').append('<span class="entryInfo">' + subcatText + '</span>');
        }

    });


//Prepend gallery button

    $(document).on('click', '.catBtns, .subcatBtns', function () {
        $('.results').remove();
        var galleryBtnCheck = $('.galleryBtn').length;
        if (galleryBtnCheck < 1) {
            $('#main').prepend('<button class="galleryBtn" id="galleryBtn' + this.id + '">To the gallery</button>');
        }
        else {
            var currentId = this.id;
            $('.galleryBtn').attr({'id': 'galleryBtn' + currentId});
        }
        viewControl('normal');
    });

// Open gallery
    $(document).on('click', '.galleryBtn', function () {
        $('#main').html('');
        $('#layoutWrapper').removeAttr('style');
        var galleryId = this.id;
        var entryId = galleryId.split('n')[1];
        var catIndex = entryId[0];
        var subcatIndex = parseInt(entryId.slice(1, 3));
        var subentryText = [];
        viewControl('full');
        if (isNaN(subcatIndex)) {
            $.each(data.category[catIndex].subcategory, function (i) {
                var subcatInfo = data.category[catIndex].subcategory[i].subcategoryInfo;
                var subcatText = $.get('text/' + subcatInfo + '.txt', function (text) {
                    subcatText = text.split('<--lang-->')[currentLang];
                });
                subcatText.done(function () {
                    subentryText.push(subcatText);
                    $('#main').append(
                            '<div class="entryGalleryDiv"><button class="entryGalleryBtns" id="GB_'
                            + data.category[catIndex].subcategory[i].subcategoryId
                            + '" style="background-image: url(img/content/' + data.category[catIndex].subcategory[i].subcategoryImg + '); background-size:contain; background-repeat:no-repeat; background-position: center;">'
                            + '</button><h1>' + data.category[catIndex].subcategory[i].subcategoryName.split('<--name-->')[currentLang] + '</h1>'
                            + subentryText[i] + '</div>'
                            );
                    i++;
                });
            });
        }
        else {
            $.each(data.category[catIndex].subcategory[subcatIndex].imgs, function (i) {
                var imgInfo = data.category[catIndex].subcategory[subcatIndex].imgs[i].imgInfo;
                var imgText = $.get('text/' + imgInfo + '.txt', function (text) {
                    imgText = text.split('<--lang-->')[currentLang];
                });
                imgText.done(function () {
                    subentryText.push(imgText);
                    $('#main').append(
                            '<div class="entryGalleryDiv"><button class="entryGalleryBtns" id="GB_'
                            + data.category[catIndex].subcategory[subcatIndex].imgs[i].imgId
                            + '" style="background-image: url(img/content/' + data.category[catIndex].subcategory[subcatIndex].imgs[i].imgImg + '); background-size:contain; background-repeat:no-repeat; background-position: center;">'
                            + '</button><h1>' + data.category[catIndex].subcategory[subcatIndex].imgs[i].imgName.split('<--name-->')[currentLang] + '</h1>'
                            + subentryText[i] + '</div>'
                            );
                    i++;
                });
            });
        }

        $('#main').append('<button class="galleryBack" id="' + galleryId + '">Back</button>');
    });

//Click on gallery item
    $(document).on('click', '.entryGalleryBtns', function () {
        var btnId = this.id;
        var btnIndex = btnId.split('_')[1];
        if (btnIndex.length === 3) {
            closeGallery(btnIndex);
        }
        else {
            $('#' + btnId).parent().toggleClass('superSize');

        }


    });

//Close gallery
    function closeGallery(btnId) {

        $('#' + btnId).click();
        $('.galleryBack, .entryGalleryDiv').remove();
    }
    $(document).on('click', '.galleryBack', function () {
        var btnId = this.id;
        var btnIndex = btnId.split('n')[1];
        closeGallery(btnIndex);
    });
    //contact media button
    $(document).on('click', '#contact', function () {
        $('#main').html('');
        var contactArray = ['facebook', 'googleplus', 'linkedin', 'twitter', 'email', 'share', 'phone'];
        var contactText = ['Friend on Facebook', 'Add to Google Circles', 'Connect in LinkedIn',
            'Follow on Twitter',
            'Send an Email', 'Share', 'Call us at +555 5555'];
        var contactActions = [
            'https://www.facebook.com',
            'https://plus.google.com/',
            'https://www.linkedin.com',
            'https://www.twitter.com',
            'mailto:admin@akoka.co.il',
            '#',
            'tel:5555555'];
        $.each(contactArray, function (i) {
            $('#main').append(
                    '<div class="contact"><a href="' + contactActions[i] + '" id="' + contactArray[i] +
                    '"> <img src="img/resources/' + contactArray[i] + '.png" alt="' + contactArray[i] + '"></a><br>' + contactText[i] + '</div>'
                    );
            if (contactArray[i] !== 'email' && contactArray[i] !== 'share' && contactArray[i] !== 'phone') {
                $('#' + contactArray[i]).attr('target', '_blank');
            }
        });
        $(document).on('click', '#share', function (e) {
            alert('Share Panel');
        });

    });

//Meet Gal Akoka button
    $(document).on('click', '#founder', function () {
        window.open('http://galakoka.co.il/');
    });

    //Language menu
    $(document).on('click', '#langSelect', function () {
        langView();
        return loadedText = [];

    });


    //Search function

    // On enter search
    $(document).keydown(function (e) {
        if (e.keyCode === 13) {
            searchJson();
        }
    });
    $(document).on('click', '#search', function (e) {
        searchJson();
    });

    function searchJson() {
        if (currentLang === 3) {
            $('#searchTerm').attr('dir', 'rtl');
        }
        else {
            $('#searchTerm').attr('dir', 'ltr');
        }
        $('#searchTerm').toggleClass('hide');
        if ($('#searchTerm').hasClass('hide')) {

            var searchTerm = $('#searchTerm').val();
            for (var i = 0; i < data.category.length; i++) {
                if (data.category[i].categoryName.split('<--name-->')[currentLang] === searchTerm) {
                    return populateResults(data.category[i].categoryId);
                }
                for (var j = 0; j < data.category[i].subcategory.length; j++) {
                    if (data.category[i].subcategory[j].subcategoryName.split('<--name-->')[currentLang] === searchTerm) {
                        return populateResults(data.category[i].subcategory[j].subcategoryId);
                    }
                    for (var k = 0; k < data.category[i].subcategory[j].imgs.length; k++) {
                        if (data.category[i].subcategory[j].imgs[k].imgName.split('<--name-->')[currentLang] === searchTerm) {
                            return populateResults(data.category[i].subcategory[j].imgs[k].imgId);
                        }
                    }
                }
            }
            return populateResults(-1);
            e.preventDefault();
        }
    }
    function populateResults(results) {
        $('video').remove();
        if (results === -1) {
            results = 'No results found, please check your search term and try again.';
            $('#main').html('<p class="results">' + results + '</p>');
        }
        else if (results.length <= 3) {
            $('#' + results).click();
        }
        else if (results.length > 3) {
            var subcatId = results.slice(0, 3);
            $('#' + subcatId).click();
            $('.galleryBtn').click();
        }

    }
});

