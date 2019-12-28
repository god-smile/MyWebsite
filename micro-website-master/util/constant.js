var constant = {
    // 登录成功后调用
    globalProjectNo: "default",
    /**
     * 后端管理系统：适用于 该用户只有一个 同类型系统 或 前端网站访问
     */
    initProjectNoByUrl: function () {
        // http://localhost:63342/boot-cloud-pages/micro-website-master/zxcv_login/index.html
        // http://localhost:63342/boot-cloud-pages/micro-website-master/zxcv_news/news.html
        // var location = top.location.href;
        var location = "http://localhost:63342/boot-cloud-pages/micro-website-master/zxcv_login/index.html";
        var req = {
            indexUrl: location
        };
        var opt = {
            method: 'post',
            url: dataUrl.util.getSysProjectInfoByUrl(),
            data: JSON.stringify(req),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    constant.globalProjectNo = res.data.projectNo;
                    console.log("projectNo:" + this.globalProjectNo);
                }
            }
        };
        getAjax(opt);
    },
    /**
     * 适用于 后台管理系统
     */
    initProjectNo: function () {
        // 从session 中拿，如果没有
        constant.globalProjectNo = sessionStorage.getItem("projectNo");
    }
};