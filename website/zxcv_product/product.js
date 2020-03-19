/**
 * 根据 访问的链接 查出对应的 项目编号 ， 存成 全局变量
 */

$(function () {
    $("#public-header").load("../zxcv_public/public-header.html");
    $("#public-footer").load("../zxcv_public/public-footer.html");

    loadProduct();
    // generateProductList2();
});



/**
 * 产品展示，查出所有 或者 固定数量的产品，用js 生成 滚动展示，
 * 图片如果没有，找一个 默认的图片填充进去
 * 标题、描述 都截取一定的长度展示
 */
function loadProduct() {

    var req = {
        pageNum: 1,
        projectNo: commonFun.getProjectNo()
    };
    var opt = {
        method: 'post',
        url: dataUrl.util.queryAllWebSiteProductInfo(),
        data: JSON.stringify(req),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                console.log(res);
                generateProductList(res.data.total, res.data.rows);
            }
        }
    };
    getAjax(opt);
}

function generateProductList(total, rows) {
    console.log('generateProductList');

    var html = "";

    for (let i = 0; i < total; i++) {
        html += "<div class='col-md-4 col-sm-6 product-img20'>";
        html += "     <div class='text-center'>";
        html += "         <a href='product-detail.html?pno=" + rows[i].productNo + "'>";
        html += "             <img src='" + rows[i].picUrl + "' alt='team'>";
        html += "             <h6>" + rows[i].title.substring(0, 10) + "</h6>";
        html += "             <p>" + rows[i].description.substring(0, 40) + "</p>";
        html += "         </a>";
        html += "     </div>";
        html += "</div>";
    }

    $("#product-list-div").append(html);

}

function generateProductList2() {
    var html = "";

    for (let i = 0; i < 4; i++) {
        html += "<div class='col-md-4 col-sm-6 product-img20'>";
        html += "     <div class='team-person text-center'>";
        html += "         <a href='product-detail.html'>";
        html += "             <img src='../images/team/doctor-1.jpg' class='img-responsive' alt='team'>";
        html += "             <h6>Dr. Emely Robert</h6>";
        html += "             <p>Bone Specialist</p>";
        html += "         </a>";
        html += "     </div>";
        html += "</div>";
    }

    $("#product-list-div").prepend(html);

}