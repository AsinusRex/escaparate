//load main index
var lang = ['en', 'fr', 'ru', 'he'];
var currentLang = 0;
var data = $.getJSON('data_en.json', function (dataJson) {
    data = dataJson;
}).done(function () {


    var loadedText = [];
    populateMenu();
    function populateMenu() {
        var enBtn = ['Home', 'Contact Us', 'Meet Gal Akoka', 'Language'];
        var frBtn = ['Accueil', 'Contactez-nous', 'Rencontrer Gal Akoka', 'Langue'];
        var ruBtn = ['Гавная', 'Контакты', 'Знакомства Гал Акока', 'Язык'];
        var heBtn = ['בית', 'צור קשר', 'תכירו את גל אקוקה', 'שפה'];
        var btnArray = [enBtn, frBtn, ruBtn, heBtn];
        $.each($('#menu button'), function (i) {
            $('#' + this.id).html(btnArray[currentLang][i]);
            i++;
        });
    }
//View control

    function viewControl(viewType) {
        switch (viewType) {
            case 'allClosed':
                $('#main').removeAttr('style');
                $('#bottomOverlay').removeAttr('style');
                $('#sideOverlay').removeAttr('style');
                break;
            case 'bottomOpen':
                $('#main').css({width: '100vw', height: '70vh'});
                $('#bottomOverlay').css({width: '100vw', height: '25vh'});
                $('#sideOverlay').removeAttr('style');
                break;
            case 'sideOpen':
                $('#main').css({width: '70vw', height: '95vh'});
                $('#bottomOverlay').removeAttr('style');
                $('#sideOverlay').css({width: '30vw', height: '95vh'});
                break;
            case 'allOpen':
                $('#main').css({width: '70vw', height: '70vh'});
                $('#bottomOverlay').css({width: '100vw', height: '25vh'});
                $('#sideOverlay').css({width: '30vw', height: '70vh'});
                break;
        }

    }

//first load home
    //language selection
    $(document).on('click', '#langSelect', function () {

        $('#locationSlug').html('');
        var langBtn = [];
        for (var i = 0; i < lang.length; i++) {
            langBtn.push('<button id="' + lang[i] + '" class="langBtns" style="background:url(img/resources/' + lang[i] + '.jpg) center no-repeat; background-size: contain;" >');
        }
        $('#main').html('').append(langBtn);
        $('#bottomOverlay').html('');
        viewControl('allClosed');
        return loadedText = [];
    });
    $(document).on('click', '.langBtns', function () {
        var chosenLang = this.id;

        currentLang = lang.indexOf(chosenLang);
        document.cookie = 'akoka_lang =' + currentLang;
        populateMenu();
    });


//Deferred
    var intro = new $.Deferred();

    if (document.cookie.indexOf('akoka_lang') === -1) {
        $('#langSelect').click();
    }
    else {
        currentLang = document.cookie.split('=')[1];
        intro.resolve();
        populateMenu();
    }

    $(".langBtns").on("click", function () {
        intro.resolve();
    });

    intro.done(function () {
        viewControl('allClosed');
        $('#main').html('<video id="introVid" width="100%" height="100%" preload="auto" autoplay>  <source src="img/resources/intro.mp4" type="video/mp4">Cannot use this</video><button id="skipVideo">Skip</button>');

        var introVid = document.getElementById('introVid');
        introVid.onended = function () {
            homeMenu();
        };

$(document).on('click', '#introVid', function () {
            homeMenu();
        });
        //onclick home
        $(document).on('click', '#home', function () {
            homeMenu();
        });
        //Home Screen menu
        function homeMenu() {
            //Plant buttons
            $('#main').html('').css('height', '60vh');
            $('#bottomOverlay').html('');
            $('#catinfo').css('height', '15vh');
            $.each(data.category, function (i) {
                $('#main').append('<button class="catBtns" id="' + data.category[i].categoryId + '">' + data.category[i].categoryName.split('<--name-->')[currentLang] + '</button>');
                i++;
            });
            $('#locationSlug').html('');
            viewControl('bottomOpen');
        }


        //On hover cat info
        $(document).on('mouseover', '.catBtns', function () {
            var catId = this.id;
            var catInfo = data.category[catId].categoryInfo;
            var catName = data.category[catId].categoryName.split('<--name-->')[currentLang];
            var catText = '';
            $('#main').css({
                background: 'url(img/content/' + data.category[catId].categoryImg + ') no-repeat right center / contain black'
            });
            if (loadedText.indexOf(catId) === -1) {

                $.get('text/' + catInfo + '.txt', function (text) {
                    catText = text.split('<--lang-->')[currentLang];
                    $('#bottomOverlay').html(catText);
                    loadedText.push(catId, catName, catText);
                });
            }

            else {
                var catIndex = parseInt(loadedText.indexOf(catId)) + 2;
                catText = loadedText[catIndex];
                $('#bottomOverlay').html(catText);
            }

        });
        //Cat click
        $(document).on('click', '.catBtns', function () {
            $('#main').html('');
            $('#bottomOverlay').html('');
            var parentIndex = parseInt(loadedText.indexOf(this.id));
            $('#sideOverlay').html(loadedText[parentIndex + 1] + '<br>' + loadedText[parentIndex + 2]);
            var catId = parseInt(this.id);
            $.each(data.category[catId].subcategory, function (i) {
                $('#main').append('<button class="subcatBtns" id="' + data.category[catId].subcategory[i].subcategoryId + '">' + data.category[catId].subcategory[i].subcategoryName.split('<--name-->')[currentLang] + '</button>');
                i++;
               
            });
//           if( $('.subcatBtns').length >= 10){
//               $('#main').css('overflow-y', 'scroll');
//           }
            viewControl('allOpen');
        });
        //On hover subcat info
        $(document).on('mouseover', '.subcatBtns', function () {
            var catIndex = this.id[0];
            var subcatIndex = parseInt(this.id.slice(1, 3));
            var subcatId = this.id;
            var subcatInfo = data.category[catIndex].subcategory[subcatIndex].subcategoryInfo;
            var subcatName = data.category[catIndex].subcategory[subcatIndex].subcategoryName.split('<--name-->')[currentLang];
            var subcatText = '';
            $('#main').css({
                background: 'url(img/content/' + data.category[catIndex].subcategory[subcatIndex].subcategoryImg + ') no-repeat right center / contain black'

            });
            if (loadedText.indexOf(subcatId) === -1) {

                $.get('text/' + subcatInfo + '.txt', function (text) {
                    subcatText = text.split('<--lang-->')[currentLang];
                    $('#bottomOverlay').html(subcatText);
                    loadedText.push(subcatId, subcatName, subcatText);
                });
            }

            else {
                var subcatIndex = parseInt(loadedText.indexOf(subcatId)) + 2;
                subcatText = loadedText[subcatIndex];
                $('#bottomOverlay').html(subcatText);
            }

        });
//Subcat click
        $(document).on('click', '.subcatBtns', function () {
            $('#main').html('');
            $('#bottomOverlay').html('');
            var catIndex = this.id[0];
            var subcatIndex = parseInt(this.id.slice(1, 3));
            var subcatId = this.id;
            var parentIndex = parseInt(loadedText.indexOf(subcatId));
            $('#sideOverlay').html(loadedText[parentIndex + 1] + '<br>' + loadedText[parentIndex + 2]);
            $.each(data.category[catIndex].subcategory[subcatIndex].imgs, function (i) {
                $('#main').append('<button class="imgBtns" id="' + data.category[catIndex].subcategory[subcatIndex].imgs[i].imgId + '">' + data.category[catIndex].subcategory[subcatIndex].imgs[i].imgName.split('<--name-->')[currentLang] + '</button>');
                i++;
            });
            viewControl('allOpen');
        });
        //On hover img info
        $(document).on('mouseover', '.imgBtns', function () {
            var catIndex = this.id[0];
            var subcatIndex = parseInt(this.id.slice(1, 3));
            var imgIndex = parseInt(this.id.slice(3, 5));
            var imgId = this.id;
            var imgInfo = data.category[catIndex].subcategory[subcatIndex].imgs[imgIndex].imgInfo;
            var imgName = data.category[catIndex].subcategory[subcatIndex].imgs[imgIndex].imgName.split('<--name-->')[currentLang];
            var imgText = '';
            $('#main').css({
                background: 'url(img/content/' + data.category[catIndex].subcategory[subcatIndex].imgs[imgIndex].imgImg + ') no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'right'
            });
            if (loadedText.indexOf(imgId) === -1) {

                $.get('text/' + imgInfo + '.txt', function (text) {
                    imgText = text.split('<--lang-->')[currentLang];
                    $('#bottomOverlay').html(imgText);
                    loadedText.push(imgId, imgName, imgText);
                });
            }

            else {
                var imgIndex = parseInt(loadedText.indexOf(imgId)) + 2;
                imgText = loadedText[imgIndex];
                $('#bottomOverlay').html(imgText);
            }
        });
        //Img click
        $(document).on('click', '.imgBtns', function () {
            $('.imgBtns').toggleClass('hide');
            $('#' + this.id).toggleClass('hide').toggleClass('fullSize');
            $('main').removeAttr('background');
        });



//Meet Gal Akoka button
        $(document).on('click', '#founder', function () {
            window.open('http://galakoka.co.il/');
        });
        //contact media button
        $(document).on('click', '#contact', function () {
            $('#main').html('');
            var contactArray = ['facebook', 'googleplus', 'linkedin', 'twitter', 'email', 'share', 'phone'];
            var contactText = ['Friend on Facebook', 'Add to Google Circles', 'Connect in LinkedIn',
                'Follow on Twitter',
                'Send an Email', 'Share', 'Call us at +555 5555'];
            var contactActions = ['https://www.facebook.com', 'https://plus.google.com/',
                'https://www.linkedin.com',
                'https://www.twitter.com', 'mailto:admin@akoka.co.il', '#', 'tel:5555555'];
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
            viewControl('allClosed');
        });

//Navigation Slug
        var catIndexSlug;
        var prevScreen;
        $(document).on('click', '.catBtns, .subcatBtns, .imgBtns', function () {
            if ($(this).hasClass('catBtns')) {
                var homeLang = $('#home').html();
                $('#locationSlug').html('<a href="#" id="slugHome">' + homeLang + '</a> | ');
                catIndexSlug = parseInt(loadedText.indexOf(this.id));
                prevScreen = $('body').clone(true);
            }
            if ($(this).hasClass('subcatBtns')) {
                $('#locationSlug').append('<a href="#" id="slugPrev">' + loadedText[catIndexSlug + 1] + '</a>');
            }

        });
        $(document).on('click', '#slugHome', function () {
            homeMenu();
        });
        $(document).on('click', '#slugPrev', function () {
            $('body').html(prevScreen);
            prevScreen = $('body').clone(true);
        });


        //Search function
        // On enter search
        $(document).keydown(function (e) {
            if (e.keyCode === 13) {
                $('#searchBtn').click();
            }
        });
        $(document).on('click', '#searchBtn', function (e) {
            var searchTerm = $('#searchTerm').val();
            for (var i = 0; i < data.category.length; i++) {
                if (data.category[i].categoryName.split('<--name-->')[currentLang] === searchTerm) {
                    console.log('found: ' + searchTerm + ' ' + data.category[i].categoryId);
                    return populateResults(data.category[i].categoryId);
                }
                for (var j = 0; j < data.category[i].subcategory.length; j++) {
                    if (data.category[i].subcategory[j].subcategoryName.split('<--name-->')[currentLang] === searchTerm) {
                        console.log('found: ' + searchTerm + ' ' + data.category[i].subcategory[j].subcategoryId);
                        return populateResults(data.category[i].subcategory[j].subcategoryId);
                    }
                    for (var k = 0; k < data.category[i].subcategory[j].imgs.length; k++) {
                        if (data.category[i].subcategory[j].imgs[k].imgName.split('<--name-->')[currentLang] === searchTerm) {
                            console.log('found: ' + searchTerm + ' ' + data.category[i].subcategory[j].imgs[k].imgId);
                            return populateResults(data.category[i].subcategory[j].imgs[k].imgId);
                        }
                    }
                }
            }
            alert('Search term not found');
            e.preventDefault();
        });
        function populateResults(searchId) {
            homeMenu();
            if (searchId.length === 1) {
                $('#' + searchId).mouseover();
                $('#' + searchId).click();
            }
            else if (searchId.length === 3) {
                $('#' + searchId[0]).mouseover();
                $('#' + searchId[0]).click();
                $('#' + searchId).mouseover();
                $('#' + searchId).click();
            }
            else if (searchId.length === 5) {
                $('#' + searchId[0]).mouseover();
                $('#' + searchId[0]).click();
                $('#' + searchId.slice(0, 3)).mouseover();
                $('#' + searchId.slice(0, 3)).click();
                $('#' + searchId).mouseover();
                $('#' + searchId).click();
            }
            else {
                alert('Search malfunction!');
            }
        }


    });
});
