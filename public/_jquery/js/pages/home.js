function Controller() {
    this.projectRecord = null;

    /*
    this.mapOverlay = new Ext.ux.GMapPanel({
        itemId: 'mapViewer',
        id: 'mapViewer',
        width: '100%',
        height: 200,
        gmapType: 'map'
    });
    */
    this.timeline = new pc.custom.TimeLine();
    this.timelineContainer = new pc.custom.TimeLineContainer({
        itemId: 'timeline',
        items: [/*this.mapOverlay,*/
            this.timeline]
    });
    /*
        MAP
    */

}
Controller.prototype.init = function () {
    this.timelineContainer.on('loadNext', this.loadNextTimeLineItems, this);
    this.timeline.store.on('load', this.onLoadTimeLine, this);
}
Controller.prototype.onLoadTimeLine = function (store, records, options) {
    console.log('onLoadTimeLine called. Count:', store.getCount(), 'Records:', records);
    if (store.getCount() == store.getTotalCount()) {
        this.timelineContainer.getBottomToolbar().disable();
    }
}
Controller.prototype.loadNextTimeLineItems = function () {
    this.timeline.store.load({
        start: this.timeline.store.baseParams.start++,
        add: true
    });

}
Ext.onReady(function () {
    console.log('Ext.onReady fired.');
    console.log('ActivityVO defined?', typeof ActivityVO !== 'undefined');
    Ext.QuickTips.init();
    try {
        var controller = new Controller();
        controller.init();
        console.log('Controller initialized.');
    } catch (e) {
        console.error('Error initializing controller:', e);
    }
});
pc.custom.TimeLine = Ext.extend(Ext.DataView, {
    autoHeight: true,
    width: '100%',
    tpl: new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">', '<h3><a href="/operation/{[this.getActivityUrl(values)]}/{key}/">{name}</a></h3>', '<p>{comments_internal}</p>', '</div>', '</tpl>', '<div class="x-clear"></div>', {
        getActivityUrl: function (values) {
            var str = "";
            switch (values.type_desc) {
                case 'todo': return 'activity-generic';
                case 'runusage': return 'activity-run-usage';
                default: return 'activity-generic';
            }
        }
    }),
    store: new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, [
            { name: 'key' },
            { name: 'name' },
            { name: 'comments_internal' },
            { name: 'type_desc' },
            { name: 'id' }
        ]),
        remoteSort: true,
        autoLoad: true,
        baseParams: {
            entity: 'Activity',
            //type__ActivityType__lookup: 'todo',
            start: 0,
            limit: 2
        },
        proxy: new Ext.data.HttpProxy({
            url: '/json/entity_query_all_paging/',
            method: 'GET'
        })
    }),
    overClass: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    emptyText: 'No items to display'
});
pc.custom.TimeLineContainer = Ext.extend(Ext.Panel, {
    renderTo: 'timeline',
    bbar: [{
        text: 'Load more items',
        itemId: 'loadMoreItemsBtn',
        scope: this,
        listeners: {
            click: function (btn) {
                this.ownerCt.ownerCt.fireEvent('loadNext');
            }
        }
    }]
});