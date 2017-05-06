/* 内容管理对象 */
var H5 = function() {
    this.id = ('h5_' + Math.random()).replace('.', '_');
    this.el = $('<div class="h5" id=' + this.id + '>').hide();
    this.page = [];

    $('body').append(this.el);

    /**
     * 新增一页
     * @param {string} name: 页面的名称,加入到classname中
     * @param {string} text: 页面的文本内容
     * @return h5对象，链式调用
     */
    this.addPage = function(name, text) {
        var page = $('<div class="h5_page section">');

        if (name !== undefined) {
            page.addClass('h5_page_' + name);
        }
        if (text !== undefined) {
            page.text(text);
        }
        this.el.append(page);
        this.page.push(page);
        if (typeof this.whenAddPage === 'function') {
            this.whenAddPage();
        }
        return this;
    }
        // 新增一个组件
    this.addComponent = function(name, config) {
        var config = config || {};
        config = $.extend({
            type: 'base',
        }, config); // 默认为base类型组件

        var component;
        var page = this.page.slice(-1)[0]; // 获取page列表的最后一个page页

        switch (config.type) {
            case 'base':
                component = new H5ComponentBase(name, config);
                break;
            case 'polyline':
                component = new H5ComponentPolyline(name, config);
                break;
            case 'pie':
                component = new H5ComponentPie(name, config);
                break;
            case 'bar':
                component = new H5ComponentBar(name, config);
                break;
            case 'radar':
                component = new H5ComponentRadar(name, config);
                break;
            case 'point':
                component = new H5ComponentPoint(name, config);
                break;
            case 'ring':
                component = new H5ComponentRing(name, config);
                break;
            default:
                break;
        }
        page.append(component);
        return this;
    }

    this.loader = function(pageIndex) {
        this.el.fullpage({
            onLeave: function(index, nextIndex, direction) {
                $(this).find('.h5_component').trigger('onLeave');
            },
            afterLoad: function(anchorLink, index) {
                $(this).find('.h5_component').trigger('onLoad');
            }
        });
        this.page[0].find('.h5_component').trigger('onLoad');
        this.el.show();
        if (pageIndex) {
            $.fn.fullpage.moveTo(pageIndex);
        }
    }

    this.loader = typeof H5_loading == 'function'? H5_loading:this.loader;

    return this;
}