function clickMenu(target) {
    switch(target){
        case 'index':
            // 加载页面
            window.open('../zxcv_index/index.html');
            // $('.content').load('../zxcv_home/home.html');
            break;
        case 'news':
            window.open('../zxcv_news/news.html');
            // $('.content').load('../zxcv_news/news.html');
            break;
        case 'info':
            window.open('../zxcv_info/info.html');
            // $('.content').load('../zxcv_info/info_content.html');
            break;
        case 'user':
            window.open('../zxcv_user/user.html');
            // $('.content').load('../zxcv_user/user.html');
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

