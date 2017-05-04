/* 
 * 基本图文组件对象 
 * @param: 自定义组件名，用于附加样式
 * @param: 配置参数 {type: 类型, text: 文本内容, width: 容器宽度, height: 容器高度, bg: 背景图片,css: 样式, center: 是否居中显示,animateIn: 页面加载时执行动画，animateOut: 页面里开始执行动画 }
 */

var H5ComponentBase = function (name, config) {
    var config = config || {};

    var id = ('h5_c_' + Math.random()).replace('.', '_');

    // 把当前的组件类型添加到样式中进行标记
    var className = 'h5_component_' + config.type + ' h5_component_name_' + name;

    var component = $('<div class="h5_component ' + className + '" id=' + id + '>');

    config.text && component.text(config.text);
    config.width && component.width(config.width);
    config.height && component.height(config.height);
    config.css && component.css(config.css);
    config.bg && component.css('backgroundImage', 'url(' + config.bg + ')');

    if (config.alignCenter === true) { //水平居中
        component.css({
            marginLeft: config.width / 2 * -1,
            left: '50%'
        })
    }

    if (config.center === true) {
        component.css({
            // transform: 'translate(-50%,-50%)',
            marginLeft: config.width / 2 * -1,
            marginTop: config.height / 2 * -1,
            left: '50%',
            top: '50%'
        })
    }

    if( typeof config.onclick === 'function' ){
        component.on('click',config.onclick);
    }

    var leaveClass = 'h5_component_' + config.type + '_leave',
        loadClass = 'h5_component_' + config.type + '_load';

    component.on('onLeave', function () {
        setTimeout(function () {
            component.addClass(leaveClass).removeClass(loadClass);
            config.animateOut && component.animate(config.animateOut);
            config.animateOutClass && component.removeClass(config.animateInClass).addClass('animated ' + config.animateOutClass);
        }, config.delay || 0);
        return false;
    })
    component.on('onLoad', function () {
        setTimeout(function () {
            component.addClass(loadClass).removeClass(leaveClass);
            config.animateIn && component.animate(config.animateIn);
            config.animateInClass && component.removeClass(config.animateOutClass).addClass('animated ' + config.animateInClass);
        }, config.delay || 0);

        return false;
    })

    return component;
}
