var projects = {};
var header = {
    // 登录后调用，先关联出 “我”的项目
    initMyProject: function () {
        // var location = top.location.href;
        var userNo = sessionStorage.getItem("userNo");
        var req = {
            userNo: userNo
        };
        var opt = {
            method: 'post',
            url: dataUrl.util.getSysProjectInfoByUserNo(),
            data: JSON.stringify(req),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    var length = res.data.length;
                    if (length <= 0) {
                        ErrorAlertManual("该用户没有关联项目，请联系管理员");
                        return;
                    }
                    if (length > 0) {
                        if (sessionStorage.getItem("projectNo") == "") {
                            sessionStorage.setItem("projectNo", res.data[0].projectNo);
                        }
                    }
                    for (var i = 0; i < length; i++) {
                        var pro = res.data[i];
                        var projectNo = pro.projectNo;
                        var projectName = pro.projectName;
                        projects[projectNo] = projectName;
                    }
                    header.initProSelect();
                }
            }
        };
        getAjax(opt);
    },
    initProSelect: function () {
        var myPro = document.getElementById("myProject");
        var project = projects;

        var projectNo = sessionStorage.getItem("projectNo");

        for (var key in project) {
            // 如果该 projectNo 和 session 中的 projectNo 相等，需要选中
            if (key == projectNo) {
                myPro.options[myPro.length] = new Option(project[key], key, true, true);
            }else {
                myPro.options[myPro.length] = new Option(project[key], key);
            }

        }
        myPro.parentElement.appendChild(myPro);
        $('#myProject option[value="' + projectNo + '"]').css('background-color', 'red');

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

    var projectNo = sessionStorage.getItem("projectNo");
    $('#myProject option[value="' + projectNo + '"]').removeAttr('style');

    sessionStorage.setItem("projectNo", value);
    $('#myProject option[value="' + value + '"]').css('background-color', 'red');

    // 选择项目后，刷新content 内容，根据 projectNo 查询
    parent.content.location.reload();
}

function logout() {
    //登陆
    //此处做为ajax内部判断
    var opt = {
        method: 'post',
        url: dataUrl.util.logout(),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (res.code == '8888') {
                // session 中取出 默认的项目入口 进行跳转
                var loginUrl = sessionStorage.getItem("loginUrl");
                window.open(loginUrl, "_top");

                destroySessionValue();
            } else {
                // 这里写 异常的结果
                ErrorAlertManual(res.msg);
            }
        },
        error: function () {
            ErrorAlertManual("退出登录异常，请联系管理员");
        }
    };
    getAjax(opt);
}

function destroySessionValue() {
    sessionStorage.clear();
}