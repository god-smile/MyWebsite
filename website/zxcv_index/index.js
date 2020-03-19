/**
 * 根据 访问的链接 查出对应的 项目编号 ， 存成 全局变量
 */

$(function () {
    $("#public-header").load("../zxcv_public/public-header.html");
    $("#public-footer").load("../zxcv_public/public-footer.html");

    common.initProjectNoByUrl();

    generateProductList2();
    sliderInit();

    // loadProduct(10);
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
                generateProductList(res.data.total, res.data.rows);

                sliderInit();
            }
        }
    };
    getAjax(opt);
}

function generateProductList(total, rows) {
    console.log('generateProductList');

    var html = "";

    for (let i = 0; i < total; i++) {
        html += "<div class='item'>";
        html += "     <div class='inner-box'>";
        html += "         <div class='img_holder'>";
        html += "              <a href='../service.html'>";
        html += "                  <img src='" + rows[i].picUrl + "' alt='images' class='img-responsive'>";
        html += "              </a>";
        html += "         </div>";
        html += "         <div class='image-content text-center'>";
        html += "             <span>Better Service At Low Cost</span>";
        html += "             <a href='../service.html'>";
        html += "                 <h6>" + rows[i].title.substring(0, 10) + "</h6>";
        html += "             </a>";
        html += "             <p>" + rows[i].description.substring(0, 40) + "</p>";
        html += "         </div>";
        html += "    </div>";
        html += "</div>";
    }

    $("#product-list-div").append(html);

}

function generateProductList2() {
    var html = "";

    for (let i = 0; i < 4; i++) {
        html += "<div class='item'>";
        html += "     <div class='inner-box'>";
        html += "         <div class='img_holder'>";
        html += "              <a href='../service.html'>";
        html += "                  <img src='../images/gallery/3.jpg' alt='images' class='img-responsive'>";
        html += "              </a>";
        html += "         </div>";
        html += "         <div class='image-content text-center'>";
        html += "             <span>Better Service At Low Cost</span>";
        html += "             <a href='../service.html'>";
        html += "                 <h6>XX</h6>";
        html += "             </a>";
        html += "             <p>xx</p>";
        html += "         </div>";
        html += "    </div>";
        html += "</div>";
    }

    $("#product-list-div").prepend(html);

}

function sliderInit() {
    console.log('sliderInit');

    "use strict";
    $('.items-container').slick({
        infinite: true,
        arrows: true,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    arrows: false
                }
            },
            {
                breakpoint: 525,
                settings: {
                    slidesToShow: 1,
                    arrows: false
                }
            }
        ]
    });
}