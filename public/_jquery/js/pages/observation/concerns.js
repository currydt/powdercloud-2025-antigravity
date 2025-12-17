function Controller() {

    this.concernCmp = new pc.custom.ConcernCmp({
        parent: null,
        title: '',
        collapsible: false,
        border: false,
        padding: 0,
        defaults:{
            border:true
        },
        style: {
            padding: 0  
        },
        collapsed: false,
        width: '100%',
        renderTo: 'form-loc'
    });
    this.concernCmp.concernsStore.load();
    this.concernCmp.concernsGrid.setHeight(400);
    this.concernCmp.concernsGrid.autoHeight = false;
    if (this.concernCmp.storesToLoad) {
        Ext.each(this.concernCmp.storesToLoad, function(storeName) {
            var store = Ext.StoreMgr.lookup(storeName);
            if (store.getCount() == 0) {
                Ext.StoreMgr.lookup(storeName).load();
            }
        }, this);
    }
}
Ext.onReady(function() {
    Ext.QuickTips.init();
    var controller = new Controller();
});
