/**
 * menu li 激活
 */

$(function () {
    $("#public-header").load("../zxcv_public/public-header.html",function(){
        var sc =  document.createElement("script");
        sc.src= "../zxcv_public/public-header.js";
        $("body").append(sc);
    });
    $("#public-footer").load("../zxcv_public/public-footer.html");
});


