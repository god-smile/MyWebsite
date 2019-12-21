/******************************************************错误提示 start*******************************************************/
var errorTitle = "错误信息";
var successTitle = "提示信息";
/**
 * 弹出，自动取消
 * @param e
 * @param time
 * @constructor
 */
function ErrorAlertTime(e, time) {
    layui.use('layer', function () {
        var index = layer.alert(e, { icon: 5, time: time, offset: 't', closeBtn: 0, title: errorTitle, btn: [], anim: 2, shade: 0 });
        layer.style(index, {
            offset: 'auto',
            color: '#777',
            top: '250px',
        });
    });
}
/**
 * 弹出，手动确认
 * @param e
 * @constructor
 */
function ErrorAlertManual(e) {
    layui.use('layer', function () {
        var index = layer.alert(e, { title: errorTitle, icon: 5});
        layer.style(index, {
            offset: 'auto',
            color: '#777',
            top: '250px',
        });
    });
}
/******************************************************错误提示 end*******************************************************/
/******************************************************正确提示 start*******************************************************/

/**
 * 弹出，手动确认
 * @param e
 * @constructor
 */
function SuccessAlertManual(e) {
    layui.use('layer', function () {
        var index = layer.alert(e, { title: successTitle, icon: 6});
        layer.style(index, {
            offset: 'auto',
            color: '#777',
            top: '250px',
        });
    });
}
/******************************************************正确提示 end*******************************************************/