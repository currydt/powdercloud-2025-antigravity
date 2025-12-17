var grid, tableStore, controller;
function Controller(){

}
Ext.onReady(function(){
    Ext.QuickTips.init();

    /*
        TABLE
    */
    /*  Expander
    var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Oblique Photo:</b></p><br>',
            '<p><b>Summary:</b> {desc}</p>'
        )
    });
    */

    // create the data store
    tableStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, TerrainVO),
        remoteSort: true,
        baseParams:{
            entity: 'Terrain',
            det: 'k',
            operation: operation.key,
            feature_type__selfRef: 'Run',
            start:0,
            limit:PAGING_LIMIT
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/entity_query_all_paging/'
        })
    });
    // create the Grid
    grid = new Ext.grid.GridPanel({
        store: tableStore,
        // Expander plugins: expander,
        loadMask: true,
        columns: [
            // Expander expander,
            {
                header   : 'Operation',
                width    : 140,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                header   : 'Operating Zone',
                width    : 140,
                sortable : false,
                dataIndex: 'operating_zone_desc'
            },{
                header   : 'Forecast Zone',
                width    : 140,
                sortable : false,
                dataIndex: 'forecast_zone_desc'
            },{
                header   : 'Drainage',
                width    : 140,
                sortable : false,
                dataIndex: 'drainage_desc'
            },{
                header   : 'Name',
                width    : 140,
                sortable : false,
                dataIndex: 'name_nick'
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

    controller = new Controller();
});
