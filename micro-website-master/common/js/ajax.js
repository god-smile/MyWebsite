//ajax的封装
// var baseURL = 'http://47.104.166.165:8088';
//var baseURL = 'http://182.92.118.137:8088';
var baseURL = 'http://localhost:8088';

var dataUrl = {};
dataUrl.util = {
    //分页查询用户
    queryUserInfoForPage: function () {
        return baseURL + '/sysUserInfo/querySysUserInfoForPage';
    },
    //分页查询新闻
    queryUserRechargeRefundForPage: function () {
        return baseURL + '/siteNewsInfo/querySiteNewsInfoForPage';
    },
    //新增新闻
    saveNewsInfo: function () {
        return baseURL + '/siteNewsInfo/saveNewsInfo';
    },
    //查询新闻
    selectNewsInfo: function () {
        return baseURL + '/siteNewsInfo/selectSiteNewsInfo';
    },
}
function getAjax(opts){
    
    //一.设置默认参数
    var defaults = {
        method: 'POST',
        url: '',
        dataType: 'json',
        data: '',
        async: true,
        cache: false,
        processData: true,
        contentType: 'application/json; charset=utf-8',
        success: function () {
        },
        error: function () {
        }
    };
    //二.用户参数覆盖默认参数
    for (var key in opts) {
        defaults[key] = opts[key];
    }
    $.ajax({
        type: defaults.method,
        url: defaults.url,
        dataType: defaults.dataType,
        contentType: defaults.contentType,
        data: defaults.data,
        async: defaults.async,
        processData: defaults.processData,
        beforeSend: function (xhr) {
            //设置请求头
            //xhr.setRequestHeader("User-Agent", "headertest");
            //console.log(JSON.stringify(sysComm));
            //xhr.setRequestHeader("x-auth-token","43399b23-b673-4f1e-97d6-5ee6105a860c");
            
        },
        success: function (res, status, xhr) {
            defaults.success(res, status, xhr);
            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (textStatus == "timeout") {
                //alert('请求超时，请重试');
            } else {
                //alert("请求报错")
                console.log(errorThrown);
            }

        }
    });
    
}
var documentBindFunc = {
    /**
     * @param event  事件名称如：click
     * @param element 元素 如：id,class 元素等
     * @param func 函数
     * 例子：documentBindFunc.on('click','#berthmanage-addBtn',function () {});
     */
    on: function (event, element, func) {
        $(document).off(event, element);
        $(document).on(event, element, func);
    }

};