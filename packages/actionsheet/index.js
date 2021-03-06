import $ from 'sealui-m/src/utils/util';
import tpl from './src/actionSheet.html';

let _sington;

/**
 * actionsheet 弹出式菜单
 * @param {array} menus 上层的选项
 * @param {string} menus[].label 选项的文字
 * @param {function} menus[].onClick 选项点击时的回调
 *
 * @param {array} actions 下层的选项
 * @param {string} actions[].label 选项的文字
 * @param {function} actions[].onClick 选项点击时的回调
 *
 * @param {object=} options 配置项
 * @param {string=} options.className 自定义类名
 *
 * @example
 * this.$actionSheet([
 *     {
 *         label: '拍照',
 *         onClick: function () {
 *             console.log('拍照');
 *         }
 *     }, {
 *         label: '从相册选择',
 *         onClick: function () {
 *             console.log('从相册选择');
 *         }
 *     }, {
 *         label: '其他',
 *         onClick: function () {
 *             console.log('其他');
 *         }
 *     }
 * ], [
 *     {
 *         label: '取消',
 *         onClick: function () {
 *             console.log('取消');
 *         }
 *     }
 * ], {
 *     className: 'custom-classname'
 * });
 */
function actionSheet(menus = [], actions = [], options = {}) {
    if(_sington) return _sington;

    const isAndroid = $.os.android;
    options = $.extend({
        menus: menus,
        actions: actions,
        className: '',
        isAndroid: isAndroid,
        title : ''
    }, options);
    const $actionSheetWrap = $($.render(tpl, options));
    const $actionSheet = $actionSheetWrap.find('.sealui-actionsheet');
    const $actionSheetMask = $actionSheetWrap.find('.sealui-mask');

    function _hide(){
        _hide = $.noop; // 防止二次调用导致报错

        $actionSheet.addClass(isAndroid ? 'sealui-animate-fade-out' : 'sealui-animate-slide-down');
        $actionSheetMask
            .addClass('sealui-animate-fade-out')
            .on('animationend webkitAnimationEnd', function () {
                $actionSheetWrap.remove();
                _sington = false;
            });
    }
    function hide(){ _hide(); }

    $('body').append($actionSheetWrap);

    // 这里获取一下计算后的样式，强制触发渲染. fix IOS10下闪现的问题
    $.getStyle($actionSheet[0], 'transform');

    $actionSheet.addClass(isAndroid ? 'sealui-animate-fade-in' : 'sealui-animate-slide-up');
    $actionSheetMask
        .addClass('sealui-animate-fade-in')
        .on('click', hide);
    $actionSheetWrap.find('.sealui-actionsheet__menu').on('click', '.sealui-actionsheet__cell', function (evt) {
        const index = $(this).index();
        console.log(this);
        menus[index].onClick.call(this);
        hide();
    });
    $actionSheetWrap.find('.sealui-actionsheet__action').on('click', '.sealui-actionsheet__cell', function (evt) {
        const index = $(this).index();
        actions[index].onClick.call(this, evt);
        hide();
    });

    _sington = $actionSheetWrap[0];
    _sington.hide = hide;
    return _sington;
}
export default actionSheet;
