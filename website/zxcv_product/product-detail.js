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

    loadProduct();
    // generateProductObject();
});



/**
 * 产品展示，查出所有 或者 固定数量的产品，用js 生成 滚动展示，
 * 图片如果没有，找一个 默认的图片填充进去
 * 标题、描述 都截取一定的长度展示
 */
function loadProduct() {

    var url = window.location.href;
    var pno = url.substring(url.indexOf("pno") + 4);
    console.log(pno);

    var req = {
        productNo: pno,
        projectNo: commonFun.getProjectNo()
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.selectWebSiteProductInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                console.log(res);
                generateProductObject(res.data);
            }
        }
    };
    getAjax(opt);
}

function generateProductObject(data) {
    console.log('generateProductList');

    $('#ptitle').html(data.title);
    $('#pcreateTime').html(commonObj.timeFormatter(data.createTime));
    $('#pdesc').html(data.description);

    $('#pcontent').html(data.content);

        /*<h6 id="ptitle">产品名称</h6>
        <span id="pcreateTime">创建时间</span>
        <p id="pdesc">产品描述</p>
        <!--富文本-->
        <div id="pcontent">*/
}

function generateProductObject2() {
    var html = "";

}