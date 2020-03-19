/** 所有在 非content 的iframe 里面 调用 alert 方法的，都使用这种，先指定弹出alert 的窗口，再调用 parent.content.function; */

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

/******************************************************token失效提示，并跳转其他url start*******************************************************/
/**
 *
 * @param e
 * @param url
 * @constructor
 */
function AlertAndOpen(e, url) {
    layui.use('layer', function () {
        var index = layer.alert(e, { title: errorTitle, icon: 5}, function () {
            window.open(url, "_top");
        });
        layer.style(index, {
            offset: 'auto',
            color: '#777',
            top: '250px',
        });
    });
}
/******************************************************token失效提示，并跳转其他url end*******************************************************/


/******************************************************询问框 start*******************************************************/
/**
 * 询问框
 * @param e
 * @param b1
 * @param b2
 * @param callback
 * @constructor
 */
function ConfirmAndCallback(e, b1, b2, callback) {
    parent.layui.use('layer', function () {
        var index = parent.layer.confirm(e, {btn: [b1, b2], title: successTitle }, function(){
                callback();
                parent.layer.close(index);
            }, function(){
            });
        parent.layer.style(index, {
            offset: 'auto',
            color: '#777',
            top: '250px',
        });
    });
}
/******************************************************询问框 end*******************************************************/
