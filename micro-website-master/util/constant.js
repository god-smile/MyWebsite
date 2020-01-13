var constant = {
    /**
     * 后端管理系统：适用于 该用户只有一个 同类型系统 或 前端网站访问
     */
    initProjectNoByUrl: function () {
        // http://localhost:63342/boot-cloud-pages/micro-website-master/zxcv_login/index.html
        // http://localhost:63342/boot-cloud-pages/micro-website-master/zxcv_news/news.html
        // var location = top.location.href;
        var location = "http://localhost:63342/boot-cloud-pages/micro-website-master/zxcv_index/index.html";
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
                    commonFun.setProjectNo(res.data.projectNo);
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
    }
};