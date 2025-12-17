var fsContainer;

Ext.onReady(function(){
    Ext.QuickTips.init();
    /*
        Tabs
    */
    $("#tabs").tabs({
        selected: 0,
        select: jqueryTabClick
    });
    /*
        Form Container
    */
    fsContainer = new Ext.Panel({
        title:'',
        renderTo:'form-loc',
        plain: true,
        border: false,
        width   : '100%',
        defaults:{
            plain: true,
            border: false,
            width   : '100%',
            bodyStyle: 'padding: 5px'
        },
        items: [
            detailForm
        ]
    });
    /*
        FORM
    */
    detailForm.on('cancel',function(){
        window.location = '/admin/operation/list/';
    }, this);
    detailForm.on('saved',function(event){
        window.location = '/admin/operation/list/';
    }, this);
     detailForm.getForm().load({
        url:'/json/entity_query_single/',
        params:{
            entity: 'Operation',
            key: operation_id
        },
        waitMsg:'Loading'
    });
});
