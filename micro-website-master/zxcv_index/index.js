$(function(){
    $('.kd-body li').click(function(event){
        var title=$(this).text().trim();
        switch(title){
            case '首页':
                // 加载页面
                $('.content').load('../zxcv_home/home.html');
                break;
            case '分类管理':
                $('.content').load('../zxcv_news/news.html');
                break;
            case '资讯管理':
                $('.content').load('../zxcv_info/info_content.html');
                break;
            case '用户管理':
                $('.content').load('../zxcv_user/user.html');
                break;
            default:
                break;
        }
        $('.kd-body li').css({
            'backgroundColor':'#666',
            'color':'#aaa'
        });
        $(this).css({
            'backgroundColor':'#444',
            'color':'#fff'
        });
    });
    $('.kd-body li:first').trigger('click');
});