//ajax的封装
var baseURL = 'http://localhost:8088';
// var baseURL = 'http://lh.zxcv.vip/web';

var dataUrl = {};
dataUrl.util = {
    /******************************公共接口 start***********************/
    // 上传图片
    uploadPicture: function () {
        return baseURL + '/common/uploadPicture';
    },
    // 批量上传图片
    uploadPictures: function () {
        return baseURL + '/common/uploadPictures';
    },
    /******************************公共接口 end***********************/
    /******************************用户管理 start***********************/
    // 登录
    userLogin: function () {
        return baseURL + '/sysAuth/userLogin';
    },
    // 退出登录
    logout: function () {
        return baseURL + '/sysAuth/logout';
    },
    // 分页查询用户
    querySysUserInfoForPage: function () {
        return baseURL + '/sysUserInfo/querySysUserInfoForPage';
    },
    // 新增用户
    saveSysUserInfo: function () {
        return baseURL + '/sysUserInfo/saveSysUserInfo';
    },
    // 查询用户
    selectSysUserInfo: function () {
        return baseURL + '/sysUserInfo/selectSysUserInfo';
    },
    // 修改用户
    updateSysUserInfoById: function () {
        return baseURL + '/sysUserInfo/updateSysUserInfoById';
    },
    // 删除用户
    deleteSysUserInfo: function () {
        return baseURL + '/sysUserInfo/deleteSysUserInfo';
    },
    /******************************用户管理 end***********************/
    /******************************新闻管理 start***********************/
    // 分页查询新闻
    queryWebSiteNewsInfoForPage: function () {
        return baseURL + '/webSiteNewsInfo/queryWebSiteNewsInfoForPage';
    },
    // 查询新闻
    selectWebSiteNewsInfo: function () {
        return baseURL + '/webSiteNewsInfo/selectWebSiteNewsInfo';
    },
    // 修改新闻
    updateSiteNewsInfoById: function () {
        return baseURL + '/siteNewsInfo/updateSiteNewsInfoById';
    },
    /******************************新闻管理 end***********************/
    /******************************产品管理 start***********************/
    // 分页查询产品
    queryWebSiteProductInfoForPage: function () {
        return baseURL + '/webSiteProductInfo/queryWebSiteProductInfoForPage';
    },
    // 查询所有产品
    queryAllWebSiteProductInfo: function () {
        return baseURL + '/webSiteProductInfo/queryAllWebSiteProductInfo';
    },
// 查询产品
    selectWebSiteProductInfo: function () {
        return baseURL + '/webSiteProductInfo/selectWebSiteProductInfo';
    }
    ,
// 修改产品
    updateSiteProductInfoById: function () {
        return baseURL + '/siteProductInfo/updateSiteProductInfoById';
    }
    ,
    /******************************产品管理 end***********************/
    /******************************项目管理 start***********************/
// 查询项目
    getSysProjectInfoByUrl: function () {
        return baseURL + '/webSiteProjectInfo/getWebSiteProjectInfoByUrl';
    }
    ,
// 查询项目
    getSysProjectInfoByUserNo: function () {
        return baseURL + '/sysProjectInfo/getSysProjectInfoByUserNo';
    }
    ,
    /******************************项目管理 end***********************/
}
;

//公共接口
commonFun = {
    checkLocalStorage:function() {
        if(!window.localStorage){
            alert("浏览器不支持localstorage");
            return false;
        }
        return true;
    },
    getToken: function () {
        if(this.checkLocalStorage()) {
            return localStorage.getItem("token");
        }
    },
    setToken: function (token) {
        if(this.checkLocalStorage()) {
            localStorage.setItem("token", token);
        }
    },
    setUser: function (user) {
        if(this.checkLocalStorage()) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    },
    getLoginUserNo: function () {
        if(this.checkLocalStorage()) {
            return JSON.parse(localStorage.getItem("user")).userNo;
        }
    },
    getLoginUserName: function () {
        if(this.checkLocalStorage()) {
            return JSON.parse(localStorage.getItem("user")).userName;
        }
    },
    getProjectNo:function () {
        if(this.checkLocalStorage()) {
            return localStorage.getItem("projectNo");
        }
    },
    setProjectNo:function (projectNo) {
        if(this.checkLocalStorage()){
            localStorage.setItem("projectNo", projectNo);
        }
    },
    getProjectIndexUrl: function () {
        if(this.checkLocalStorage()) {
            return localStorage.getItem("indexUrl");
        }
    },
    setProjectIndexUrl: function (indexUrl) {
        if(this.checkLocalStorage()) {
            localStorage.setItem("indexUrl", indexUrl);
        }
    },
}

function getAjax(opts) {

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
            ErrorAlertManual("系统出错，请重试或联系管理员！");
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
            xhr.setRequestHeader("x-auth-token", commonFun.getToken());

        },
        success: function (res, status, xhr) {

            if (res.code == "2003") {
                //授权令牌不存在或已失效，请重新登录后在尝试
                /*ErrorAlertManual("登录信息失效，请重新登录！");
                parent.open("../zxcv_login/login.html", "_top");*/

                AlertAndOpen("登录信息失效，请重新登录！", "../zxcv_login/login.html");
            } else {
                defaults.success(res, status, xhr);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            /*if (textStatus == "timeout") {
                //alert('请求超时，请重试');
            } else {
                //alert("请求报错")
                console.log(errorThrown);
            }*/
            defaults.error();
        }
    });
}

/**
 * 登录ajax
 * @param opts
 */
function loginAjax(opts) {

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
            ErrorAlertManual("系统出错，请重试或联系管理员！");
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
            /*if (textStatus == "timeout") {
                //alert('请求超时，请重试');
            } else {
                //alert("请求报错")
                console.log(errorThrown);
            }*/
            defaults.error();
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