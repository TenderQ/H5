/* 环图组件对象 */
var H5ComponentRing = function(name, config) {
    config.type = 'pie';
    if (config.data.length > 1) { //  环图应该只有一个数据
        config.data = [config.data[0]];
    }
    var component = new H5ComponentPie(name, config);

    var mask = $('<div class="mask">');
    component.addClass('h5_component_ring');

    component.append(mask);

    var text = component.find('.text');

    text.attr('style', '');
    if (config.data[0][2]) {
        text.css('color', config.data[0][2]);
    }
    mask.append(text);

    return component;
}