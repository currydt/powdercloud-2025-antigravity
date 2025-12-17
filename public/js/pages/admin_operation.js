var grid, tableStore, fsContainer, tabs;

Ext.onReady(function(){
    Ext.QuickTips.init();
    /*
       Add Button
    */
	if( Ext.get('list-add-button') ) {
		Ext.get('list-add-button').on('click', function() {
		    var fields = (new OperationVO()).fields.items;
		    var values = new Object();
		    for(var key in fields){
		        var name = fields[key].name;
		        values[name] = null;
		    }
		    detailForm.getForm().setValues( values);
		    fsContainer.show();
		    Ext.get('list-add-button').hide();
		    grid.hide();
		}, this);
	}
    /*
        Fake Tabs
    */
    tabs = new Ext.Container({
        contentEl : 'tabs',
        listeners: {
            scope: this,
            render: function(cmp){
                Ext.get('tabs').show();
            }
        }
    });

    /*
        FORM
    */
    detailForm.on('cancel',function(){
        fsContainer.hide();
        grid.show();
        Ext.get('list-add-button').show();
    }, this);
    detailForm.on('saved',function(event){
        fsContainer.hide();
        Ext.get('list-add-button').show();
        var key = Ext.decode(event.response.responseText).key;
        grid.show();
        tableStore.reload()
    }, this);
    /*
        Form Container
    */
    fsContainer = new Ext.Panel({
        title:'',
        hidden:true,
        renderTo:'form-loc',
        plain: true,
        width   : '100%',
        defaults:{
            plain: true,
            border: false,
            width   : '100%',
            bodyStyle: 'padding: 5px'
        },
        items: [
            //TODO
//            {
//		    xtype:'container',
//		    html:'<p>The following form .</p>'
//	    },

            tabs,
            detailForm
        ]
    });
    /*
        TABLE
    */
    // Create RowActions Plugin
    var action = new Ext.ux.grid.RowActions({
        header:'',
        width: 110,
        keepSelection:true,
        actions:[{
               iconCls:'ui-icon ui-icon-wrench',
               tooltip:'Edit',
               callback:function(grid, records, action) {
                    window.location = '/admin/operation/detail/'+records.data.key+'/';
               }
       },{
               iconCls:'ui-icon ui-icon-trash',
               tooltip:'Delete',
               callback:function(grid, records, action) {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function(btn){
                        if(btn == "yes"){
                            Ext.Ajax.request({
                                method: 'GET',
                                url: '/json/entity_delete/',
                                params:{
                                    key: records.data.key,
                                    entity: 'Operation'
                                },
                                success: function(){
                                    tableStore.reload()
                                }
                            });
                        }
                    });
               }
       }]
    });
    // create the data store
    tableStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, OperationVO),
        remoteSort: true,
        baseParams:{
            entity: 'Operation',
            start:0,
	    sort: 'name',
	    dir: 'ASC',
            limit:PAGING_LIMIT
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/entity_query_all_paging/'
        })
    });
    // create the Grid
    grid = new Ext.grid.GridPanel({
        store: tableStore,
        loadMask: true,
        plugins:[action],
        columns: [
            action,
            {
                id       :'name',
                header   : 'Name',
                width    : 200,
                sortable : true,
                dataIndex: 'name'
            },
	    {
                id       :'type',
                header   : 'Type',
                width    : 120,
                sortable : false,
                dataIndex: 'type_desc'
            },
	    {
                id       :'publish_data_exchange',
                header   : 'Data Exchange',
                width    : 120,
                sortable : false,
                dataIndex: 'publish_data_exchange'
            },
	    {
                id       :'publish_weather',
                header   : 'Publish Weather Data',
                width    : 140,
                sortable : false,
                dataIndex: 'publish_weather'
            },
	    {
                id       :'publish_web',
                header   : 'Publish Observation Data',
                width    : 140,
                sortable : false,
                dataIndex: 'publish_web'
            },
	    {
                id       :'publish_hazard_forecast',
                header   : 'Pubiish Hazard Forecast',
                width    : 140,
                sortable : false,
                dataIndex: 'publish_hazard_forecast'
            },
	    {
                id       :'publish_data_exchange',
                header   : 'Data Exchange',
                width    : 140,
                sortable : false,
                dataIndex: 'publish_data_exchange'
            }
        ],
        stripeRows: true,
        height: 400,
        width: '100%',
        // paging bar on the bottom
        bbar: new Ext.PagingToolbar({
            pageSize:PAGING_LIMIT,
            store: tableStore,
            displayInfo: true,
            displayMsg: 'Displaying records {0} - {1} of {2}',
            emptyMsg: "No records to display"
        })
    });
    // render the grid to the specified div in the page
    grid.render('table-loc');
    tableStore.load({params:{start:0, limit:PAGING_LIMIT}});
});
