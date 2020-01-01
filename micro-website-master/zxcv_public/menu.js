
$(function () {
    var location = top.location.href;
    console.log(location);

    // login.html
    var content = location.substring(location.lastIndexOf("/") + 1);
    content = content.substr(0, content.indexOf(".html"));

    if (content == 'news' || content == 'product') {
        parent.header.document.getElementById("pro_div").style.display = "block";
    }


    console.log(content);

    $("#" + content).css({
        'backgroundColor':'#444',
        'color':'#fff'
    });

});


function clickMenu(target) {
    switch(target){
        case 'index':
            // 加载页面
            window.open("../zxcv_index/index.html", "_top");
            break;
        case 'news':
            window.open("../zxcv_news/news.html", "_top");
            break;
        case 'product':
            window.open("../zxcv_product/product.html", "_top");
            break;
        case 'user':
            window.open("../zxcv_user/user.html", "_top");
            break;
        default:
            break;
    }
   /* $('.kd-body li').css({
        'backgroundColor':'#666',
        'color':'#aaa'
    });
    $(this).css({
        'backgroundColor':'#444',
        'color':'#fff'
    });*/
}

