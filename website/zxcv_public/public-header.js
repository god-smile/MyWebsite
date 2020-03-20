
$(function () {
    initMenuActive();
});

/**
 * 选中 菜单
 */

function initMenuActive() {
    var url = window.location.href;
    var location = url.substring(url.lastIndexOf("/") + 1, url.indexOf(".html", url.lastIndexOf("/")));

    switch (location) {
        case "index":
            $("#index").attr("class", "active");
            break;
        case "about":
            $("#about").attr("class", "active");
            break;
        case "product":
            $("#product").attr("class", "active");
            break;
        case "news":
            $("#news").attr("class", "active");
            break;
    }

}
