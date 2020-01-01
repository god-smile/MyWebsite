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

$("input").focus(function () {
    $(this).css("border", "2px solid gray");

});
$("input").blur(function () {
    $(this).css("border", "2px solid rgba(57, 61, 82, 0)");

});
$('input[name="pwd"]').focus(function () {
    $(this).attr('type', 'password');
});
$('input[type="text"]').focus(function () {
    $(this).prev().animate({'opacity': '1'}, 200);
});
$('input[type="text"],input[type="password"]').blur(function () {
    $(this).prev().animate({'opacity': '.5'}, 200);
});
$('input[name="login"],input[name="pwd"]').keyup(function () {
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
    var msgalert = '默认账号:' + truelogin + '<br/> 默认密码:' + truepwd;
    var index = layer.alert(msgalert, {
        icon: 6,
        time: 4000,
        offset: 't',
        closeBtn: 0,
        title: '友情提示',
        btn: [],
        anim: 2,
        shade: 0
    });
    layer.style(index, {
        color: '#777'
    });
    //非空验证
    $('#login_submit').click(function () {
        var login = $('input[name="login"]').val();
        var pwd = $('input[name="pwd"]').val();
        var code = slideValue;
        if (login == '') {
            ErroAlert('请输入您的账号');
        } else if (pwd == '') {
            ErroAlert('请输入密码');
        } else if (!code) {
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
            var JsonData = {login: login, pwd: pwd, code: code};
            //此处做为ajax内部判断
            var url = "";
            if (JsonData.login == truelogin && JsonData.pwd == truepwd && JsonData.code.toUpperCase() == CodeVal.toUpperCase()) {
                url = "Ajax/Login";
            } else {
                url = "Ajax/LoginFalse";
            }

            AjaxPost(url, JsonData,
                function () {
                    //ajax加载中
                },
                function (data) {
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
                        if (data.Status == 'ok') {
                            //登录成功
                            $('.login div').fadeOut(100);
                            $('.success').fadeIn(1000);
                            $('.success').html(data.Text);
                            //跳转操作

                        } else {
                            AjaxErro(data);
                        }
                    }, 2400);
                })
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

if (ajaxmockjax == 1) {
    $.mockjax({
        url: 'Ajax/Login',
        status: 200,
        responseTime: 50,
        responseText: {"Status": "ok", "Text": "登陆成功<br /><br />欢迎回来"}
    });
    $.mockjax({
        url: 'Ajax/LoginFalse',
        status: 200,
        responseTime: 50,
        responseText: {"Status": "Erro", "Erro": "账号名或密码或验证码有误"}
    });
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

