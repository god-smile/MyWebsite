var common = {
    initProjectNoByUrl: function () {
        var url = window.location.href;
        url = url.substring(0,url.indexOf(".html?") + 5);
        console.log(url);

        var req = {
            indexUrl: url
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


        console.log(commonFun.getProjectNo());
    },
};