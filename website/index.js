/**
 * 根据 访问的链接 查出对应的 项目编号 ， 存成 全局变量
 */

$(function () {
    $("#public-header").load("public-header.html");
    $("#public-footer").load("public-footer.html");

    common.initProjectNoByUrl();

    loadProduct(10);
});



/**
 * 产品展示，查出所有 或者 固定数量的产品，用js 生成 滚动展示，
 * 图片如果没有，找一个 默认的图片填充进去
 * 标题、描述 都截取一定的长度展示
 */
function loadProduct(number) {

    var req = {
        pageNum: 1,
        pageSize: number,
        projectNo: commonFun.getProjectNo()
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.queryWebSiteProductInfoForPage(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                console.log(res);
                // generateProductList(res.data.total, res.data.rows);
            }
        }
    };
    getAjax(opt);
}

function generateProductList(total, rows) {
    var html = "";

    for (let i = 0; i < total; i++) {
        html += "<div class=\'item\'>";
        html += "                    <div class=\'inner-box\'>";
        html += "                        <div class=\'img_holder\'>";
        html += "                            <a href=\'service.html\'>";
        html += "                                <img src=\'images/gallery/1.jpg\' alt=\'images\' class=\'img-responsive\'>";
        html += "                            </a>";
        html += "                        </div>";
        html += "                        <div class=\'image-content text-center\'>";
        html += "                            <span>Better Service At Low Cost</span>";
        html += "                            <a href=\'service.html\'>";
        html += "                                <h6>Dormitory</h6>";
        html += "                            </a>";
        html += "                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, vero.</p>";
        html += "                        </div>";
        html += "                    </div>";
        html += "                </div>";
    }

    $("#product-list-div .slick-list .slick-track").prepend(html);

}