$(function () {
    var location = window.location.href;
    console.log(location);

    // index.html
    var content = location.substring(location.lastIndexOf("/") + 1);
    content = content.substr(0, content.indexOf(".html"));

    console.log(content);

    $("#index").css({
        'backgroundColor':'#444',
        'color':'#fff'
    });

    /*switch(content){
        case 'index':
            $("#index").css({
                'backgroundColor':'#444',
                'color':'#fff'
            });
            break;
        case 'news':
            $("#news").css({
                'backgroundColor':'#444',
                'color':'#fff'
            });
            break;
        case 'info':
            $("#info").css({
                'backgroundColor':'#444',
                'color':'#fff'
            });
            break;
        case 'user':
            $("#user").css({
                'backgroundColor':'#444',
                'color':'#fff'
            });
            break;
        default:
            break;
    }*/


});

