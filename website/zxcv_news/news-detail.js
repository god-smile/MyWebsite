/**
 * 根据 访问的链接 查出对应的 项目编号 ， 存成 全局变量
 */

$(function () {
    $("#public-header").load("../zxcv_public/public-header.html",function(){
        var sc =  document.createElement("script");
        sc.src= "../zxcv_public/public-header.js";
        $("body").append(sc);
    });
    $("#public-footer").load("../zxcv_public/public-footer.html");

    loadNews();
    // generateNewsObject();
});



/**
 * 产品展示，查出所有 或者 固定数量的产品，用js 生成 滚动展示，
 * 图片如果没有，找一个 默认的图片填充进去
 * 标题、描述 都截取一定的长度展示
 */
function loadNews() {
    var url = window.location.href;
    var nno = url.substring(url.indexOf("nno") + 4);
    console.log(nno);

    var req = {
        newsNo: nno,
        projectNo: commonFun.getProjectNo()
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectWebSiteNewsInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                console.log(res);
                generateNewsObject(res.data);
            }
        }
    };
    getAjax(opt);
}

function generateNewsObject(data) {
    console.log('generateNewsObject');

    $('#ntitle').html(data.title);
    $('#ncreateTime').html(commonObj.timeFormatter(data.createTime));
    $('#nreadNum').html(data.readNum);
    $('#ndesc').html(data.description);

    $('#ncontent').html(data.content);
}

function generateNewsObject2() {
    var html = "";
}