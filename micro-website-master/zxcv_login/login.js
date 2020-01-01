var canGetCookie = 0;//是否支持存储Cookie 0 不支持 1 支持
var ajaxmockjax = 1;//是否启用虚拟Ajax的请求响 0 不启用  1 启用
//默认账号密码
var truelogin = "kbcxy";
var truepwd = "mcwjs";

//var CodeVal = 0;

var slideValue = false;

$(function () {
    window.addEventListener('load', function () {

        //code是后台传入的验证字符串
        var code = "jsaidaisd656";
        new moveCode(code);

        //获取当前的code值
        //console.log(codeFn.getCode());

        //改变code值
        //code = '46asd546as5';
        //codeFn.setCode(code);

        //重置为初始状态
        //codeFn.resetCode();
    });

    // Code();
});

function Code() {
    if (canGetCookie == 1) {
        createCode("AdminCode");
        var AdminCode = getCookieValue("AdminCode");
        showCheck(AdminCode);
    } else {
        showCheck(createCode(""));
    }
}

function showCheck(a) {
    CodeVal = a;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.font = "80px 'Hiragino Sans GB'";
    ctx.fillStyle = "#E8DFE8";
    ctx.fillText(a, 0, 100);
}

$(document).keypress(function (e) {
    // 回车键事件
    if (e.which == 13) {
        $('input[type="button"]').click();
    }
});
//粒子背景特效
/*$('body').particleground({
    dotColor: '#E8DFE8',
    lineColor: '#133b88'
});*/

// $("input").focus(function () {
//     $(this).css("border", "2px solid gray");
//
// });
// $("input").blur(function () {
//     $(this).css("border", "2px solid rgba(57, 61, 82, 0)");
//
// });
$('input[name="password"]').focus(function () {
    $(this).attr('type', 'password');
});
$('input[type="text"]').focus(function () {
    $(this).prev().animate({'opacity': '1'}, 200);
});
$('input[type="text"],input[type="password"]').blur(function () {
    $(this).prev().animate({'opacity': '.5'}, 200);
});
$('input[name="userName"],input[name="password"]').keyup(function () {
    var Len = $(this).val().length;
    if (!$(this).val() == '' && Len >= 5) {
        $(this).next().animate({
            'opacity': '1',
            'right': '30'
        }, 200);
    } else {
        $(this).next().animate({
            'opacity': '0',
            'right': '20'
        }, 200);
    }
});

layui.use('layer', function () {
    // var msgalert = '默认账号:' + truelogin + '<br/> 默认密码:' + truepwd;
    // var index = layer.alert(msgalert, {
    //     icon: 6,
    //     time: 4000,
    //     offset: 't',
    //     closeBtn: 0,
    //     title: '友情提示',
    //     btn: [],
    //     anim: 2,
    //     shade: 0
    // });
    // layer.style(index, {
    //     color: '#777'
    // });
    //非空验证
    $('#login_submit').click(function () {
        var userName = $('input[name="userName"]').val();
        var password = $('input[name="password"]').val();
        var code = slideValue;
        if (userName == '') {
            ErroAlert('请输入您的账号');
        } else if (password == '') {
            ErroAlert('请输入密码');
        } /*else if (code == '' || code.length != 4) {
            ErroAlert('请开始验证');
        }*/ else if (!code) {
            ErroAlert('请开始验证');
        } else {
            //认证中..
            fullscreen();
            $('.login').addClass('test'); //倾斜特效
            setTimeout(function () {
                $('.login').addClass('testtwo'); //平移特效
            }, 300);
            setTimeout(function () {
                $('.authent').show().animate({right: -320}, {
                    easing: 'easeOutQuint',
                    duration: 600,
                    queue: false
                });
                $('.authent').animate({opacity: 1}, {
                    duration: 200,
                    queue: false
                }).addClass('visible');
            }, 500);


            //登陆
            var JsonData = {userName: userName, password: password, code: code};
            //此处做为ajax内部判断
            var opt = {
                method: 'post',
                url: dataUrl.util.userLogin(),
                data: JSON.stringify(JsonData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    //ajax返回
                    //认证完成
                    setTimeout(function () {
                        $('.authent').show().animate({right: 90}, {
                            easing: 'easeOutQuint',
                            duration: 600,
                            queue: false
                        });
                        $('.authent').animate({opacity: 0}, {
                            duration: 200,
                            queue: false
                        }).addClass('visible');
                        $('.login').removeClass('testtwo'); //平移特效
                    }, 2000);
                    setTimeout(function () {
                        $('.authent').hide();
                        $('.login').removeClass('test');
                        if (res.code == '8888') {
                            //登录成功
                            $('.login div').fadeOut(100);
                            $('.success').fadeIn(1000);
                            // 这里写 返回的正常结果
                            $('.success').html("");

                            initSessionValue(res.data);

                            // 从返回结果中取出 默认的项目入口 进行跳转
                            window.open(res.data.indexUrl, "_top");
                        } else {
                            // 这里写 异常的结果
                            ErrorAlertManual(res.msg);
                        }
                    }, 2400);
                },
                error: function () {
                    ErrorAlertManual("登录异常，请联系管理员");
                }
            };
            getAjax(opt);
        }
    })
});

// 全屏特效
function fullscreen() {
    elem = document.body;
    if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.requestFullScreen) {
        elem.requestFullscreen();
    } else {
        //浏览器不支持全屏API或已被禁用
    }
}

function initSessionValue(user) {
    sessionStorage.setItem("userId", user.id);
    sessionStorage.setItem("userName", user.userName);
    sessionStorage.setItem("userNo", user.userNo);
    sessionStorage.setItem("projectNo", user.projectNo);
    // 他的登录url
    sessionStorage.setItem("loginUrl", user.loginUrl);
    // 跳转的url，所有用户都一样，在后台存的变量
    sessionStorage.setItem("indexUrl", user.indexUrl);
}

//获取元素距离页面边缘的距离
function getOffset(box, direction) {

    var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft';

    var offset = box[setDirection];

    var parentBox = box.offsetParent;
    while (parentBox) {

        offset += parentBox[setDirection];
        parentBox = parentBox.offsetParent;
    }
    parentBox = null;

    return parseInt(offset);
}

function moveCode(code) {

    var fn = {codeVluae: code};

    var box = document.querySelector("#code-box"),
        progress = box.querySelector("p"),
        codeInput = box.querySelector('.code-input'),
        evenBox = box.querySelector("span");

    //默认事件
    var boxEven = ['mousedown', 'mousemove', 'mouseup'];
    //改变手机端与pc事件类型
    if (typeof document.ontouchstart == 'object') {

        boxEven = ['touchstart', 'touchmove', 'touchend'];
    }

    var goX, offsetLeft, deviation, evenWidth, endX;

    function moveFn(e) {
        e.preventDefault();
        e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;

        endX = e.clientX - goX;
        endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;

        if (endX > evenWidth * 0.7) {
            progress.innerText = '松开验证';
            progress.style.backgroundColor = "#66CC66";
        } else {
            progress.innerText = '';
            progress.style.backgroundColor = "#FFFF99";
        }
        progress.style.width = endX + deviation + 'px';
        evenBox.style.left = endX + 'px';
    }

    function removeFn() {

        document.removeEventListener(boxEven['2'], removeFn, false);
        document.removeEventListener(boxEven['1'], moveFn, false);

        if (endX > evenWidth * 0.7) {

            progress.innerText = '验证成功';
            progress.style.width = evenWidth + deviation + 'px';
            evenBox.style.left = evenWidth + 'px'

            codeInput.value = fn.codeVluae;

            slideValue = true;

            evenBox.onmousedown = null;
        } else {

            progress.style.width = '0px';
            evenBox.style.left = '0px';

            slideValue = false;
        }
    }

    evenBox.addEventListener(boxEven['0'], function (e) {

        e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;

        goX = e.clientX,
            offsetLeft = getOffset(box, 'left'),
            deviation = this.clientWidth,
            evenWidth = box.clientWidth - deviation,
            endX;

        document.addEventListener(boxEven['1'], moveFn, false);

        document.addEventListener(boxEven['2'], removeFn, false);
    }, false);

    fn.setCode = function (code) {
        if (code) {
            fn.codeVluae = code;
        }
    };

    fn.getCode = function () {
        return fn.codeVluae;
    };

    fn.resetCode = function () {
        evenBox.removeAttribute('style');
        progress.removeAttribute('style');
        codeInput.value = '';

        slideValue = false;
    };

    return fn;
}

