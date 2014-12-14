// Language Version
var lang = 'en';

$(document).on('click', "#langMenu button", function () {
    lang = this.id;
    console.log(lang);
    switch (lang) {
        case 'en':
            $('#home').html('Home');
            $('#0').html('Architects');
            $('#1').html('Contractors');
            $('#2').html('Entrepreneurs');
            $('#3').html('Projects');
            $('#4').html('Interior');
            $('#5').html('Publications');
            $('#searchbar input[type="text"]').prop('placeholder', 'Enter search term');
            $('#searchbar input[type="submit"]').attr('value', 'Submit');
            $('#contactUs').html('Contact Us');
            $('#languageSelect').html('Select Language');
            break;
        case 'fr':
            $('#home').html('Portail');
            $('#0').html('Architectes');
            $('#1').html('Contractueles');
            $('#2').html('Entrepreneurs');
            $('#3').html('Projets');
            $('#4').html('D\'intérieur');
            $('#5').html('Publicationes');
            $('#searchbar input[type="text"]').prop('placeholder', 'Entrez un terme de recherche');
            $('#searchbar input[type="submit"]').attr('value', 'Soumettre');
            $('#contactUs').html('Contactez-nous');
            $('#languageSelect').html('Choisir la langue');
            break;
        case 'he':
            $('#home').html('עמוד הבית');
            $('#0').html('אדריכלים');
            $('#1').html('קבלנים');
            $('#2').html('יזמים');
            $('#3').html('פרויקטים');
            $('#4').html('עיציב פנים');
            $('#5').html('הוצאה לאור');
            $('#searchbar input[type="text"]').prop('placeholder', 'הזן מונחי חיפוש');
            $('#searchbar input[type="submit"]').attr('value', 'חפש');
            $('#contactUs').html('צור קשר');
            $('#languageSelect').html('בחירת שפה');
            break;
        case 'ru':
            $('#home').html('портал');
            $('#0').html('архитекторы');
            $('#1').html('Подрядчики');
            $('#2').html('Предприниматели');
            $('#3').html('проекты');
            $('#4').html('интерьера');
            $('#5').html('Публикации');
            $('#searchbar input[type="text"]').prop('placeholder', 'Введите условия поиска');
            $('#searchbar input[type="submit"]').attr('value', 'представлять');
            $('#contactUs').html('свяжитесь с нами');
            $('#languageSelect').html('Выберите язык');
            break;
    }
});

//Calculate window sizes

mainWidth = $('#main').width();
mainHeight = $('#main').height();


function getTemplate(templateUrl)
{
    $.get('templates/' + templateUrl, function (content)
    {
        if (templateUrl === 'leftMenu.html')
        {
            $('#leftMenu').html(content);
        }
        else
        {
            $('#main').html(content);
        }
    });
}
//Load leftMenu content
getTemplate('leftMenu.html');
//Load mainWindow content
getTemplate('homeWindow.html');



//Event handlers for LeftMenu
$(document).on('click', '#leftMenu a', function ()
{
    var selectedClass = $(this).attr('class');
    var selectedElement = this.id;
    //Load Selected View
    $('#main').html('').css({'background': 'none'});

    //Navigation
    switch (selectedClass)
    {
        case 'social':
            getTemplate('social.html');
            switch (selectedElement)
            {
                case 'facebook':
                    alert('getting FB');
                    break;
                case 'googleplus':
                    alert('getting googleplus');
                    break;
                case 'linkedin':
                    alert('getting linkedin');
                    break;
                case 'twitter':
                    alert('getting twitter');
                    break;
                case 'share':
                    alert('getting sharepanel');
                    break;
            }
            break;
        case 'category':
            getTemplate('categoryMenu.html');
            getData(selectedElement);
            break;
        default:
            switch (selectedElement)
            {
                case 'home':

                    getTemplate('homeWindow.html');
                    break;
                case 'contactUs':
                    getTemplate('contactUs.html');
                    break;
                case 'languageSelect':
                    getTemplate('languageSelect.html');
                    break;
            }
    }
    ;
// Load main JSON
    function getData(selectedElement) {
        $.getJSON('data_' + lang + '.json', function (data)
        {
            $.each(data.category, function (entryIndex)
            {
                var categoryId = data.category[entryIndex].categoryId;
                //Load selected category
                if (categoryId === selectedElement)
                {
                    var subcategory = data.category[entryIndex].subcategory;
                    var numberOfButtons = data.category[entryIndex].subcategory.length;
                    subcatButtonWidth = ($('#subcategoryButtons').width()) * 0.3;
                    var buttonSpanWidth = numberOfButtons * subcatButtonWidth;
                    $.each(subcategory, function (subentryIndex)
                    {
                        var subcategoryName = data.category[entryIndex].subcategory[subentryIndex].subcategoryName;
                        var subcategoryId = data.category[entryIndex].subcategory[subentryIndex].subcategoryId;
                        $('#subcategoryButtons span').append('<button id="' + categoryId + subcategoryId + '" style="background: url(img/content/' + categoryId + subcategoryId + '.jpg) no-repeat center; background-size:contain; margin:auto;">' + subcategoryName + '</button>').css({'width': buttonSpanWidth});
                    });
                }
            });
            subcategoryLoader(data);
            $('#overlayRight').addClass('overlayOpen').html('<img src="img/resources/arrowUp.gif" class="arrows arrowOpen"><p>' + data.category[selectedElement].categoryInfo + '</p>');
            $('#subcategoryButtons span button').css({'width': subcatButtonWidth, 'margin': 0});
        });
    }
    ;

    $('#main a').html(selectedElement);
});

//Event handlers for mainWindow

function subcategoryLoader(data)
{
    scroller();
    //onHover events
    $('#subcategoryButtons button').hover(
            function ()
            {
                var entryIndex = this.id[0];
                var subentryIndex = parseInt(this.id.slice(-2));
                var subcategoryInfo = data.category[entryIndex].subcategory[subentryIndex].subcategoryInfo;
                $('#subcategoryInfo').append($('<p>' + subcategoryInfo + '</p>'));
            },
            function ()
            {
                $('#subcategoryInfo').find("*:last").remove();
            });


    //Load Thumbnails
    $(document).on('click', "#subcategoryButtons button", function () {
        var entryIndex = this.id[0];
        var subentryIndex = parseInt(this.id.slice(-2));
        var imgs = data.category[entryIndex].subcategory[subentryIndex].imgs;
        $('main').html('');
        $.get("templates/imgMenu.html", function (content)
        {
            $('#main').html(content);
        }).done(function () {
            var numberOfButtons = data.category[entryIndex].subcategory[subentryIndex].imgs.length;
            imgButtonWidth = ($('#imgButtons').width()) * 0.3;
            var buttonSpanWidth = numberOfButtons * imgButtonWidth;
            $('#overlayRight').addClass('overlayOpen').html('<img src="img/resources/arrowUp.gif" class="arrows arrowOpen"><p>' + data.category[entryIndex].subcategory[subentryIndex].subcategoryInfo + '</p>');

            $.each(imgs, function (imgIndex) {
                var categoryId = data.category[entryIndex].categoryId;
                var subcategoryId = data.category[entryIndex].subcategory[subentryIndex].subcategoryId;
                var imgName = data.category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].imgName;
                var imgId = data.category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].imgId;
                $('#imgButtons span').append('<button id="' + categoryId + subcategoryId + imgId + '" style="background: url(img/content/' + categoryId + subcategoryId + imgId + '.jpg) no-repeat center; background-size:contain;">' + imgName + '</button>').css({'width': buttonSpanWidth});
                ;
            });
            $('#imgButtons span button').css({'width': subcatButtonWidth, 'margin': 0});
            scroller();
        });
    });

//Thumbnail click
    $(document).on('click', "#imgButtons button", function () {

        var imgId = this.id;
        var entryIndex = imgId[0];
        var subentryIndex = parseInt(imgId.slice(-4, -2));
        var imgIndex = parseInt(imgId.slice(-2));
        console.log('entryIndex ' + entryIndex + ' subentryIndex ' + subentryIndex + ' imgIndex ' + imgIndex + 'imgId ' + imgId);
        var imgInfo = data.category[entryIndex].subcategory[subentryIndex].imgs[imgIndex].imgInfo;
        $('#imgSpace').css({'background': 'url(img/content/' + imgId + '.jpg) no-repeat center', 'background-size': 'contain'});
        $('#overlayBottom').addClass('overlayOpen').html('<img src="img/resources/arrowDown.gif" class="arrows arrowOpen"><p>' + imgInfo + '</p>');

    });
    // Toggle overlays
    $(document).on('click', ".arrows",
            function ()
            {
                $(this).toggleClass('arrowClose').toggleClass('arrowOpen');
                $(this).parent().toggleClass('overlayClose').toggleClass('overlayOpen');
                $(this).siblings('p').toggleClass('hide');
            });





    //scroll events
    function scroller() {
        $('.scroller').click(function () {
            if (this.id === 'scrollLeft') {
                $(this).parent().parent().animate({scrollLeft: '-=500'});
                $('.scroller').animate({'left': '-=500'});

            }
            else {
                $(this).parent().parent().animate({scrollLeft: '+=500'});
                $('.scroller').animate({'width': '50%', 'left': '+=500'});
            }
        });
    }
}
;








