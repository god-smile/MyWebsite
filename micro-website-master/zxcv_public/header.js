var projects = {};
var header = {
    // 登录后调用，先关联出 “我”的项目
    initMyProject: function () {
        // var location = top.location.href;
        var userNo = commonFun.getLoginUserNo();
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
                        parent.content.ErrorAlertManual("该用户没有关联项目，请联系管理员");
                        return;
                    }
                    if (length > 0) {
                        if (commonFun.getProjectNo() == "") {
                            commonFun.setProjectNo(res.data[0].projectNo);
                            commonFun.setProjectIndexUrl(res.data[0].indexUrl);
                        }
                    }
                    for (var i = 0; i < length; i++) {
                        var pro = res.data[i];
                        var projectNo = pro.projectNo;
                        var projectName = pro.projectName;
                        var indexUrl = pro.indexUrl;
                        projects[projectNo] = {projectName, indexUrl};
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

        var projectNo = commonFun.getProjectNo();

        for (var key in project) {
            // 如果该 projectNo 和 session 中的 projectNo 相等，需要选中
            if (key == projectNo) {
                myPro.options[myPro.length] = new Option(project[key].projectName, key, true, true);
            }else {
                myPro.options[myPro.length] = new Option(project[key].projectName, key);
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

    var projectNo = commonFun.getProjectNo();
    $('#myProject option[value="' + projectNo + '"]').removeAttr('style');

    commonFun.setProjectNo(value);
    commonFun.setProjectIndexUrl(projects[value].indexUrl);
    $('#myProject option[value="' + value + '"]').css('background-color', 'red');

    // 选择项目后，刷新content 内容，根据 projectNo 查询
    parent.content.location.reload();
}

function openPortal() {
    var indexUrl = commonFun.getProjectIndexUrl();
    if (indexUrl == null || indexUrl == '' || indexUrl == undefined) {
        parent.content.ErrorAlertManual("系统错误，请联系管理员！");
        return;
    }
    parent.open(indexUrl, "_blank");
}

function logout() {
    ConfirmAndCallback('确定要退出登录吗?', '确定', '取消', function () {
        // 退出登陆
        // 此处做为ajax内部判断
        var opt = {
            method: 'post',
            url: dataUrl.util.logout(),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.code == '8888') {
                    destroySessionValue();
                    window.open("../zxcv_login/login.html", "_top");
                } else {
                    // 这里写 异常的结果
                    parent.content.ErrorAlertManual(res.msg);
                }
            },
            error: function () {
                parent.content.ErrorAlertManual("退出登录异常，请联系管理员");
            }
        };
        getAjax(opt);
    });
}
function destroySessionValue() {
    sessionStorage.clear();
}