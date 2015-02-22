//Initialize data
var lang = ['en', 'fr', 'ru', 'he'];
var langName = ['English', 'Français', 'Ру́сский', 'עברית'];
var currentLang = 0;
var data = $.getJSON('data_en.json', function (dataJson) {
    data = dataJson;
    var prevState = '';
}).done(function () {
    var loadedText = [];
    document.styleSheets[1].disabled = true;
    populateFooter();
    function populateFooter() {
        var enBtn = ['Contact Us', 'Meet Gal Akoka', 'Language', 'Search'];
        var frBtn = ['Contactez-nous', 'Rencontrer Gal Akoka', 'Langue', 'Recherche'];
        var ruBtn = ['Контакты', 'Знакомства Гал Акока', 'Язык', 'поиск'];
        var heBtn = ['צור קשר', 'תכירו את גל אקוקה', 'שפה', 'חיפוש'];
        var btnArray = [enBtn, frBtn, ruBtn, heBtn];
        var returnHex = '\u23ce';
        var placeholder = ['Click search or press ', 'Cliquez sur recherche ou appuyez ',
            'Нажмите на Поиск или нажмите ', 'לחץ חיפוש או הקש '];
        $.each($('#footer button'), function (i) {
            $('#' + this.id).html(btnArray[currentLang][i]);
            i++;
        });
        $('#searchTerm').attr('placeholder', placeholder[currentLang] + returnHex);
    }
//Views
    function viewControl(viewType) {
        switch (viewType) {
            case 'normal':
                $('#main').css({
                    'width': '85vw'
                });
                $('#nav').removeClass('hide').css({
                    'width': '15vw'
                });
                $('#footer').removeClass('hide');
                break;
            case 'full':
                $('#main').css({
                    width: '102vw',
                    padding: '0'
                });
                $('#nav').css({
                    'width': '0px'
                });
                $('#footer').addClass('hide');
                break;
        }
    }
    function langView() {
        $('#main').html('<img id="logoLang" src="img/resources/logo.png" alt="Optimized for 21st century browsers"><span id="langlist"></span>');
        $('#layoutWrapper').css('background', 'white');
        $('video, .galleryBtn, .galleryBack').remove();
        $.each(lang, function (i) {
            $('#langlist').append('<button class="langBtn" id="' + lang[i] + '">' + langName[i] + '</button>');
            i++;
        });
        (viewControl('full'));
    }

    function loaderAnim() {
        viewControl('full');
        $('#layoutWrapper').css('background', 'white').append('<div id="loaderDiv"><img src="img/resources/spinner.gif"></div>');
        window.setTimeout(goHome, 1000);
        function goHome() {
            $('#loaderDiv').remove();
            homeMenu(currentLang);
        }
        ;
    }
//Control
    $(function () {



//check for language in cookie and if not offer a language

        if (document.cookie.indexOf('akoka_lang') === -1) {
            langView();
        }
        else {
            currentLang = document.cookie.split('=')[1];
            loaderAnim();
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
        //rtl for Hebrew
        if (currentLang === 3) {
            document.styleSheets[1].disabled = false;
        }
        else {
            document.styleSheets[1].disabled = true;
        }
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
    $(document).on('click', '#logoMenu, #homeGallery', function () {
        homeMenu(currentLang);
        $('.galleryBtn, .galleryBack, #homeGallery, #spanScroller').remove();
    });
//toggle submenu and load subcats in main
    $(document).on('click', '.catBtns', function () {
        $('.results, .contact, #resultsList').remove();
        var galleryBtnText = ['Scroll down', 'Faites défiler', 'Прокрутите вниз', 'גלול למטה'];
        var catId = this.id;
        var catInfo = data.category[catId].categoryInfo;
        var catName = data.category[catId].categoryName.split('<--name-->')[currentLang];
        var catText = '';
        var galleryBtnCheck = $('.galleryBtn').length;
        if (galleryBtnCheck < 1) {
            $('#layoutWrapper').prepend('<button class="galleryBtn" id="galleryBtn' + this.id + '">' + galleryBtnText[currentLang] + '</button>');
        }
        else {
            var currentId = this.id;
            $('.galleryBtn').attr({'id': 'galleryBtn' + currentId});
        }

        viewControl('normal');
        $('video').remove();
        $('#layoutWrapper').css({'background': 'url(img/content/' + data.category[catId].categoryImg + ')'});
        $('.entryInfo').remove();
        if (loadedText.indexOf(catId) === -1) {
            $.get('text/' + catInfo + '.txt', function (text) {
                catText = text.split('<--lang-->')[currentLang];
                loadedText.push(catId, catName, catText);
                $('#main').append('<span class="entryInfo"><h1>' + catName + '</h1>' + catText + '</span>');
            });
        }

        else {
            var catTextIndex = parseInt(loadedText.indexOf(catId)) + 2;
            catText = loadedText[catTextIndex];
            $('#main').append('<span class="entryInfo"><h1>' + catName + '</h1>' + catText + '</span>');
        }

        

    });
    $(document).on('click', '.subcatBtns', function () {
        $('.results, .contact, #resultsList').remove();
        var galleryBtnText = ['Scroll down', 'Faites défiler', 'Прокрутите вниз', 'גלול למטה'];
        var subcatId = this.id;
        var catIndex = subcatId[0];
        var subcatIndex = parseInt(this.id.slice(1, 3));
        var subcatInfo = data.category[catIndex].subcategory[subcatIndex].subcategoryInfo;
        var subcatName = data.category[catIndex].subcategory[subcatIndex].subcategoryName.split('<--name-->')[currentLang];
        var imgCheck = (data.category[catIndex].subcategory[subcatIndex].imgs).length;
        var subcatText = '';
        var galleryBtnCheck = $('.galleryBtn').length;
        if (imgCheck > 0) {
            if (galleryBtnCheck < 1) {
                $('#layoutWrapper').prepend('<button class="galleryBtn" id="galleryBtn' + this.id + '">' + galleryBtnText[currentLang] + '</button>');
            }
            else {
                var currentId = this.id;
                $('.galleryBtn').attr({'id': 'galleryBtn' + currentId});
            }
        }

        viewControl('normal');
        $('#layoutWrapper').css({'background': 'url(img/content/' + data.category[catIndex].subcategory[subcatIndex].subcategoryImg + ')'});
        $('.entryInfo').remove();
        if (loadedText.indexOf(subcatId) === -1) {
            $.get('text/' + subcatInfo + '.txt', function (text) {
                subcatText = text.split('<--lang-->')[currentLang];
                loadedText.push(subcatId, subcatName, subcatText);
                $('#main').append('<span class="entryInfo"><h1>' + subcatName + '</h1>' + subcatText + '</span>');
            });
        }

        else {
            var subcatTextIndex = parseInt(loadedText.indexOf(subcatId) + 2);
            subcatText = loadedText[subcatTextIndex];
            $('#main').append('<span class="entryInfo"><h1>' + subcatName + '</h1>' + subcatText + '</span>');
        }

    });
// Open gallery
    $(document).on('click', '.galleryBtn', function () {
        var galleryId = this.id;
        openGallery(galleryId);
    });
//Mousescroll control    
    $(document).on('DOMMouseScroll mousewheel', function (e) {
        var galleryBtnCheck = $('.galleryBtn').length;
        var galleryBackCheck = $('.galleryBack').length;
        var returnToOriginCheck = $('.returnToOrigin').length;
        var scrollPosition = $('.entryGalleryDiv:first').position();
        //scroll down to gallery
        if ((e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) && galleryBtnCheck > 0) {
            var galleryId = $('.galleryBtn').attr('id');
            openGallery(galleryId);
        }

// Scroll up to return from gallery to menu        
        else if ((e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) && galleryBackCheck > 0 && scrollPosition.top > -1 && returnToOriginCheck === 0) {

            var galleryId = $('.galleryBack').attr('id');
            var btnId = galleryId.split('n')[1];
            closeGallery(btnId);
        }

//   Scroll up to return from subcat menu to parent gallery.
        else if ((e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) && returnToOriginCheck > 0) {
            var btnId = $('.entryInfo h1').html();
            prevGallery(btnId);
        }
    });
    function openGallery(galleryId) {
        $('#main').html('');
        $('#homeGallery, .returnToOrigin').remove();
        $('#layoutWrapper').removeAttr('style');
        var entryId = galleryId.split('n')[1];
        var catIndex = entryId[0];
        var subcatIndex = parseInt(entryId.slice(1, 3));
        var subentryText = [];
        var subentryList = [];
        viewControl('full');
        if (isNaN(subcatIndex)) {
            $.each(data.category[catIndex].subcategory, function (i) {
                var subcatId = data.category[catIndex].subcategory[i].subcategoryId;
                var subcatName = data.category[catIndex].subcategory[i].subcategoryName.split('<--name-->')[currentLang];
                var subcatInfo = data.category[catIndex].subcategory[i].subcategoryInfo;
                var subcatText = $.get('text/' + subcatInfo + '.txt', function (text) {
                    subcatText = text.split('<--lang-->')[currentLang];
                });
                subcatText.done(function () {

                    subentryText.push(subcatText);
                    $('#main').append(
                            '<div class="entryGalleryDiv" id="' + subcatName + '"><h1 class="hide">'
                            + subcatName + '</h1><p class="hide">'
                            + subentryText[i] + '</p><button class="entryGalleryBtns" id="GB_'
                            + subcatId
                            + '" style="background-image: url(img/content/' + data.category[catIndex].subcategory[i].subcategoryImg + '); background-size:contain; background-repeat:no-repeat; background-position: center;">'
                            + '</button></div>'
                            );
                    i++;
                });
                subentryList.push('<span name="' + subcatName + '" id="GS_' + subcatId + '" class="gallerySpan">' + subcatName + '</span>');
            });
        }
        else {
            $.each(data.category[catIndex].subcategory[subcatIndex].imgs, function (i) {
                var pdfFlag = data.category[catIndex].subcategory[subcatIndex].imgs[i].pdfFlag;
                var cursorType = '';
                if (pdfFlag === 'off' || typeof pdfFlag === 'undefined') {
                    cursorType = 'cursor:default';
                }
                var imgName = data.category[catIndex].subcategory[subcatIndex].imgs[i].imgName.split('<--name-->')[currentLang];
                var imgInfo = data.category[catIndex].subcategory[subcatIndex].imgs[i].imgInfo;
                var imgId = data.category[catIndex].subcategory[subcatIndex].imgs[i].imgId;
                var imgStyle = '" style="background-image: url(img/content/' + data.category[catIndex].subcategory[subcatIndex].imgs[i].imgImg + '); background-size:contain; background-repeat:no-repeat; background-position: center;' + cursorType + '">';
                var imgText = $.get('text/' + imgInfo + '.txt', function (text) {
                    imgText = text.split('<--lang-->')[currentLang];
                });
                imgText.done(function () {
                    subentryText.push(imgText);
                    $('#main').append(
                            '<div id="' + imgName + '" class="entryGalleryDiv"><h1 class="hide">'
                            + imgName + '</h1><p class="hide">'
                            + subentryText[i] + '</p><button class="entryGalleryBtns" id="GB_'
                            + imgId
                            + imgStyle
                            + '</button></div>'
                            );
                    i++;
                });
                subentryList.push('<span name="' + imgName + '" id="GS_' + imgId + '" class="gallerySpan">' + imgName + '</span>');
            });
            $('#homeGallery, .returnToOrigin').remove();
        }
        var sortedList = '<div id="spanScroller">' + subentryList.sort().join().replace(/,/g, '') + '</div>';
        var galleryBackText = ['Back', 'Arrière', 'назад', 'חזרה'];
        $('.galleryBtn').remove();
        $('#layoutWrapper').prepend('<button class="galleryBack" id="GS_' + galleryId + '">' + galleryBackText[currentLang] + '</button><button id="homeGallery" ></button>');
        $('#main').append(sortedList);
        $('#homeGallery').animate({
            margin: "0"
        }, 200);
    }

//Click on gallery item
    $(document).on('click', '.entryGalleryBtns', function () {
        prevState = $('html').clone(true);
        var btnId = this.id;
        var btnIndex = btnId.split('_')[1];
        if (btnIndex.length === 3) {
            closeGallery(btnIndex);
        }
        else if (btnIndex.length === 5) {

            var pdfFlag = data.category[btnIndex[0]].subcategory[parseInt(btnIndex.slice(1, 3))].imgs[parseInt(btnIndex.slice(3, 5))].pdfFlag;
            var pdfPath = data.category[btnIndex[0]].subcategory[parseInt(btnIndex.slice(1, 3))].imgs[parseInt(btnIndex.slice(3, 5))].imgInfo;
            if (pdfFlag === 'on') {
                window.open('pdf/' + pdfPath + '.pdf');
            }

            return false;
        }
        $('#layoutWrapper').prepend('<button class="returnToOrigin" id="backTo_' + btnIndex + '">Return to previous gallery</button><button id="homeGallery" ></button>');
    });
//Hover on gallery item
    $(document).on('mouseover', '.entryGalleryDiv', function () {
        $(this).children().removeClass('hide');
        $(this).css('background', 'rgba(0,0,0, 0.5');
        $(this).find('button').css('opacity', '0.5');
    }).on('mouseleave', '.entryGalleryDiv', function () {
        $(this).children('p, h1').addClass('hide');
        $(this).removeAttr('style');
        $(this).find('button').css('opacity', '1');
    });
// Hover on Gallery Navigation Aide
    $(document).on('mouseover', '.gallerySpan', function () {
        $(this).css('color', 'yellow');
        $(this).prev().css('color', 'gold');
        $(this).next().css('color', 'gold');
    }).on('mouseleave', '.gallerySpan', function () {
        $(this).removeAttr('style');
        $(this).prev().removeAttr('style');
        $(this).next().removeAttr('style');
    });
//Click Navigation Aide Link
    $(document).on('click', '.gallerySpan', function () {
        var targetId = $(this).html();
        $('#' + targetId).scrollintoview({duration: "slow", direction: "y"});
    });
    $(document).on('click', '.returnToOrigin', function () {
        var btnId = $('.entryInfo h1').html();
        prevGallery(btnId);
    });
//Return to Previous Gallery
    function prevGallery(btnId) {
        $('html').replaceWith(prevState);
        $('#main').scrollTop(99999);
        $('#' + btnId).scrollintoview({duration: "slow", direction: "y"});
    }
//Close gallery
    function closeGallery(btnId) {

        $('#' + btnId).click();
        $('.galleryBack, .entryGalleryDiv, #homeGallery, #spanScroller, .returnToOrigin').remove();
    }
    $(document).on('click', '.galleryBack', function () {
        var btnId = this.id;
        var btnIndex = btnId.split('n')[1];
        closeGallery(btnIndex);
    });
//contact media button
    $(document).on('click', '#contact', function () {
        $('#main').html('');
        var contactArray = ['facebook', 'googleplus', 'linkedin', 'twitter', 'email', 'phone'];
        var contactText = ['Friend on Facebook', 'Add to Google Circles', 'Connect in LinkedIn',
            'Follow on Twitter',
            'Send an Email', 'Call us at +555 5555'];
        var contactActions = [
            'https://www.facebook.com',
            'https://plus.google.com/',
            'https://www.linkedin.com',
            'https://www.twitter.com',
            'mailto:admin@akoka.co.il',
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
    $(document).on('click', '#search', function () {
        searchJson();
    });
    function searchJson() {
        var matchesId = [];
        var matchesName = [];
        var matchesRelated = [];
        var searchTerm = $('#searchTerm').val();
        $('#searchTerm, .galleryBtn').toggleClass('hide');
        $('#searchTerm').focus();
        if ($('#searchTerm').hasClass('hide') && searchTerm !== '') {

            for (var i = 0; i < data.category.length; i++) {
                var catName = data.category[i].categoryName.split('<--name-->')[currentLang];
                var catRelated = data.category[i].searchTerms;
                if (catName === searchTerm || data.category[i].searchTerms.split(',').indexOf(searchTerm) !== -1) {
                    matchesId.push(data.category[i].categoryId);
                    matchesName.push(catName);
                    matchesRelated.push(catRelated);
                }
                for (var j = 0; j < data.category[i].subcategory.length; j++) {
                    var subcatName = data.category[i].subcategory[j].subcategoryName.split('<--name-->')[currentLang];
                    var subcatRelated = data.category[i].subcategory[j].searchTerms;
                    if (subcatName === searchTerm || data.category[i].subcategory[j].searchTerms.split(',').indexOf(searchTerm) !== -1) {
                        matchesId.push(data.category[i].subcategory[j].subcategoryId);
                        matchesName.push(subcatName);
                        matchesRelated.push(subcatRelated);
                    }
                    for (var k = 0; k < data.category[i].subcategory[j].imgs.length; k++) {
                        var imgName = data.category[i].subcategory[j].imgs[k].imgName.split('<--name-->')[currentLang];
                        var imgRelated = data.category[i].subcategory[j].imgs[k].searchTerms;
                        if (imgName === searchTerm || data.category[i].subcategory[j].imgs[k].searchTerms.split(',').indexOf(searchTerm) !== -1) {
                            matchesId.push(data.category[i].subcategory[j].imgs[k].imgId);
                            matchesName.push(imgName);
                            matchesRelated.push(imgRelated);
                        }
                    }
                }
            }
            populateResults(matchesId, matchesName, matchesRelated, searchTerm);
        }
    }
    function populateResults(matchesId, matchesName, matchesRelated, searchTerm) {

        if (matchesId.length === 0) {
            $('#footer').append('<div id="noResults" style="text-align:center; line-height:4vh; height:4vh;">Search term not found</div>');
            $('#noResults').fadeOut(2000);
            var timeout = window.setTimeout(removeAlert, 2000);
            function removeAlert() {
                $('#noResults').remove();
            }
            ;
        }
        else {
            var SearchResultsHeader = ['Search Results for ', 'Résultats de la recherche pour ',
                'Результаты поиска по ',
                'תוצאות חיפוש עבור '];
            viewControl('normal');
            $('#main').html('');
            $('#layoutWrapper').css('background', 'white');
            $('.galleryBack, .galleryBtn, video').remove();
            $('#main').html('<ol id="resultsList"><h2>' + SearchResultsHeader[currentLang] + searchTerm + '</h2></ol>');
            for (var i = 0; i < matchesId.length; i++) {
                var eachRelated = matchesRelated[i].split(',');
                var terms = [];
                for (var j = 0; j < eachRelated.length; j++) {
                    terms.push(' <a class="relatedTerms">' + eachRelated[j] + '</a>');
                }
                $('#resultsList').append('<li id="search_' + matchesId[i] + '" class="searchMatch">' + matchesName[i] + '</li><p>Related terms: ' + terms + '</p>');
            }
        }
    }
//Click on search result
    $(document).on('click', '.searchMatch', function () {
        var searchId = this.id;
        var targetId = searchId.split('_')[1];
        $('#resultsList').remove();
        if (targetId.length <= 3) {
            $('#' + targetId).click();
        }
        else {
            $('#' + targetId.slice(0, 3)).click();
            var timeout = window.setTimeout(galleryClick, 500);
            function galleryClick() {
                $('.galleryBtn').click();
            }
            ;
        }
    });

//Click on related term search
    $(document).on('click', '.relatedTerms', function () {
        $('#search').click();
        var newTerm = $(this).html();
        newTerm = newTerm.trim();
        $('#searchTerm').val(newTerm);
        searchJson();
    });
});


////On click anything add params to URKL for backfunction
//
//$(document).on('click', '.catBtns, .subcatBtns, #langSelect, #home, .galleryBtn, .galleryBack ', function () {
//window.location.hash = "dialog";});