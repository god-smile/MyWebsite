var header = {
    // 登录后调用，先关联出 “我”的项目
    myProject: null,
    initMyProject: function () {
        // var location = top.location.href;
        var userNo = "U000000001";
        var req = {
            userNo: userNo
        };
        var opt = {
            method: 'post',
            url: dataUrl.util.getSysProjectInfoByUrl(),
            data: JSON.stringify(req),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                /*if (res.code == '8888') {
                    var total = res.data.total;
                    for (var i = 0; i < total; i++) {
                        var pro = res.data.rows[i];
                        var id = pro.id;
                        var projectNo = pro.projectNo;
                        var projectName = pro.projectName;
                        header.myProject[id] = {projectNo, projectName};
                    }

                    header.initProSelect();
                }*/
                header.initProSelect();
            }
        };
        getAjax(opt);
    },
    initProSelect: function () {
        var myPro = document.getElementById("myProject")
        // var size = header.myProject.size();
        var size = 5;
        for (var i = size; i >= 1; i--) {
            // 如果该 projectNo 和 全局设置的 globalProjectNo 相等，需要选中
            if (i == 3) {
                myPro.options[myPro.length] = new Option(i + "(当前)", i, true, true);
            }
            else {
                myPro.options[myPro.length] = new Option(i, i);
            }
        }
        myPro.parentElement.appendChild(myPro);
    }
};

$(function () {
    header.initMyProject();
});

function projectChange() {
    var myPro = document.getElementById('myProject'); //定位id
    var index = myPro.selectedIndex; // 选中索引
    var value = myPro.options[index].value; // 选中值
    console.log(value);

    // 不好使
    console.log(myPro.size);

    /*for (var i = 0; i < myPro.size(); i++) {

    }*/
}