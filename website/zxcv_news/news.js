/**
 * 根据 访问的链接 查出对应的 项目编号 ， 存成 全局变量
 */

$(function () {
    $("#public-header").load("../zxcv_public/public-header.html");
    $("#public-footer").load("../zxcv_public/public-footer.html");

    loadNews(10);
    // generateNewsList2();
});



/**
 * 新闻展示，查出所有 或者 固定数量的新闻，用js 生成，
 * 标题、描述 都截取一定的长度展示
 */
function loadNews(number) {

    var req = {
        pageNum: 1,
        pageSize: number,
        projectNo: commonFun.getProjectNo()
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.queryWebSiteNewsInfoForPage(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                console.log(res);
                generateNewsList(res.data.total, res.data.rows);
            }
        }
    };
    getAjax(opt);
}

function generateNewsList(total, rows) {
    console.log('generateProductList');

    var html = "";
    html += "<ul class='categorise-list'>";
    html += "    <li></li>";

    for (let i = 0; i < total; i++) {
        html += "<li><a href='news-detail.html?nno=" + rows[i].newsNo + "'>" + rows[i].title + " <span class='news-create-time'>" + commonObj.timeFormatter(rows[i].createTime) + "</span></a></li>";
    }

    html += "    <li></li>";
    html += "</ul>";

    $("#news-list-div").append(html);

}

function generateNewsList2() {
    var html = "";
    html += "<ul class='categorise-list'>";
    html += "    <li></li>";

    for (let i = 0; i < 4; i++) {
        html += "<li><a href='#'>Alumni <span class='news-create-time'>" + "2020-11-11 11:11:11" + "</span></a></li>";
    }

    html += "    <li></li>";
    html += "</ul>";

    $("#news-list-div").append(html);

}