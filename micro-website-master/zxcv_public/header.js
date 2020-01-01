var projects = {};
var header = {
    // 登录后调用，先关联出 “我”的项目
    initMyProject: function () {
        // var location = top.location.href;
        var userNo = "U000000001";
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
                    if (length > 0) {
                        if (constant.globalProjectNo == "default") {
                            constant.globalProjectNo = res.data[0].projectNo;
                        }
                        if (sessionStorage.getItem("projectNo") == "") {
                            sessionStorage.setItem("projectNo",constant.globalProjectNo);
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
        // 如果该 projectNo 和 全局设置的 globalProjectNo 相等，需要选中
        var isDefault = false;
        if (sessionStorage.getItem("projectNo") == "") {
            isDefault = true;
        }

        for (var key in project) {
            // 如果 session 中有 projectNo ， 先 按 session 中的存，如果 session 中没有，说明是 第一次打开
            if (isDefault) {
                if (key == constant.globalProjectNo) {
                    myPro.options[myPro.length] = new Option(project[key], key, true, true);
                }else {
                    myPro.options[myPro.length] = new Option(project[key], key);
                }
            } else {
                if (key == sessionStorage.getItem("projectNo")) {
                    myPro.options[myPro.length] = new Option(project[key], key, true, true);
                }else {
                    myPro.options[myPro.length] = new Option(project[key], key);
                }
            }
        }
        myPro.parentElement.appendChild(myPro);

        if (isDefault) {
            $('#myProject option[value="' + constant.globalProjectNo + '"]').css('background-color', 'red');
        } else {
            $('#myProject option[value="' + sessionStorage.getItem("projectNo") + '"]').css('background-color', 'red');
        }
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

    if (sessionStorage.getItem("projectNo") == "") {
        $('#myProject option[value="' + constant.globalProjectNo + '"]').removeAttr('style');
    }else {
        $('#myProject option[value="' + sessionStorage.getItem("projectNo") + '"]').removeAttr('style');
    }

    constant.globalProjectNo = value;
    sessionStorage.setItem("projectNo",constant.globalProjectNo);
    $('#myProject option[value="' + constant.globalProjectNo + '"]').css('background-color', 'red');

    // 选择项目后，刷新content 内容，根据 projectNo 查询
    parent.content.location.reload();
}