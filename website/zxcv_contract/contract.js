//地图 部分
var map; //Map实例
//数据
mapData = [];
var mapFun = {
    init: function () {
        map = new BMap.Map("allmap", {enableMapClick: false});
        //设置地图中心点，当前城市
        var point = new BMap.Point(115.403884,41.914887);
        //初始化地图,设置中心点坐标和地图级别。
        map.centerAndZoom(point, 13);
        //启用滚轮放大缩小
        map.enableScrollWheelZoom(true);
        //检测浏览器兼容
        if (typeof(Worker) === "undefined") {
            if (navigator.userAgent.indexOf("MSIE 9.0") <= 0) {
                alert("定制个性地图示例：IE9以下不兼容，推荐使用百度浏览器、chrome、firefox、safari、IE10");
            }
        }

        var marker=new BMap.Marker(new BMap.Point(115.403884,41.914887));
        map.addOverlay(marker);
        var licontent="<b>天安门</b><br>";
        licontent+="<span><strong>地址：</strong>北京市东城区天安门广场北侧</span><br>";
        licontent+="<span><strong>电话：</strong>(010)63095718,(010)63095630</span><br>";
        // licontent+="<span class=\"input\"><strong></strong><input class=\"outset\" type=\"text\" " +
        //     "name=\"origin\" value=\"北京站\"/><input class=\"outset-but\" type=\"button\" value=\"公交\" " +
        //     "onclick=\"gotobaidu(1)\" /><input class=\"outset-but\" type=\"button\" value=\"驾车\"  " +
        //     "onclick=\"gotobaidu(2)\"/><a class=\"gotob\" " + "target=\"_blank\"></a></span>";


        var content1 ="<form id=\"gotobaiduform\" action=\"http://api.map.baidu.com/direction\" target=\"_blank\" method=\"get\">" + licontent +"</form>";

        var opts1 = { width: 300 };

        var  infoWindow = new BMap.InfoWindow(content1, opts1);
        marker.openInfoWindow(infoWindow);
        marker.addEventListener('click',function(){
            marker.openInfoWindow(infoWindow);
        });

        function gotobaidu(type)
        {
            if($.trim($("input[name=origin]").val())=="")
            {
                alert("请输入起点！");
                return;
            }else{
                if(type==1)
                {
                    $("input[name=mode]").val("transit");
                    $("#gotobaiduform")[0].submit();
                }else if(type==2)
                {
                    $("input[name=mode]").val("driving");
                    $("#gotobaiduform")[0].submit();
                }
            }
        }
    },
};

//加载地图
mapFun.init();