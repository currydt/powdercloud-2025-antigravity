pc.custom.TaskList = Ext.extend(Ext.grid.GridPanel, {
    stripeRows: true,
    height: 400,
    width: '100%',
    initComponent: function(){
        this.tbar = new Ext.Toolbar({
            items: [
                '->',{
                    text: 'Print',
		    id: 'PrintBtnRunUsage',
                    iconCls: 'print-icon',
		    disabled: true,
                    scope: this,
                    handler: function() {
                        this.fireEvent('print');
                    }                      
                }, {
                    text: 'Add',
                    iconCls: 'add-icon',
                    scope: this,
                    menu: [
                            {
                                text: 'Generic Activity',
                                scope: this,
                                handler: function() {
                                        this.fireEvent('add_generic_task');
                                    }
                            },
                            {
                                text: 'Avalanche Hazard Forecast',
                                scope: this,
                                handler: function() {
                                        this.fireEvent('add_activity_forecast');
                                    }
                            },
                            {
                                text: 'Avalanche Hazard Evaluation',
                                scope: this,
                                handler: function() {
                                        this.fireEvent('add_activity_evaluation');
                                    }
                            },
                            {
                                text: 'Run Usage',
                                scope: this,
                                handler: function() {
                                        this.fireEvent('add_activity_runusage');
                                    }
                            },
                            {
                                text: 'Run Status',
                                scope: this,
                                handler: function() {
                                        this.fireEvent('add_activity_runstatus');
                                    }
                            },
                            {
                                text: 'Run Usage for Operating Zone',
                                scope: this,
                                handler: function() {
                                        this.fireEvent('add_activity_runusage_opzone');
                                    }
                            },
                            {
                                text: 'Run Status for Operating Zone',
                                scope: this,
                                handler: function() {
                                        this.fireEvent('add_activity_runstatus_opzone');
                                    }
                            }
                    ]

                }
            ]
        });
        var action = new Ext.ux.grid.RowActions({
            header:'',
            width: 110,
            keepSelection:true,
            actions:[{
                iconCls:'ui-icon ui-icon-wrench',
                tooltip:'Edit',
                callback:function(grid, records, action) {
                     grid.fireEvent('edit', records);
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
                                     entity: 'Activity'
                                 },
                                 success: function(action, options) {
                                    tableStore.reload();                                    
                                    deleteFunciton(action, options);
                                 }
                             });
                         }
                     });
                }
           }]
        });

        // create the data store
        var tableStore = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, ActivityVO),
            remoteSort: true,
            baseParams:{
                entity: 'Activity',
                start:0,
                limit:PAGING_LIMIT
            },
            //autoLoad: true,
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all_paging/'
            })
        });
        var expander = new Ext.ux.grid.RowExpander({
            tpl: new Ext.Template('<p><b>Comment:</b> {comments_internal}</p>')
        });
        Ext.applyIf(this, {
            store: tableStore,
            plugins:[action, expander],
            columns: [
                expander,
                action,
                {
                    header   : 'Type',
                    width    : 120,
                    dataIndex: 'type_desc',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        switch(value){
                            case 'hazeval':
                                return 'Hazard Evaluation'
                                break;
                            case 'hazfore':
                                return 'Hazard Forecast'
                                break;
                            case 'runusage':
                                return 'Run Usage'
                                break;
                            case 'runstatus':
                                return 'Run Status'
                                break;
                            case 'todo':
                                return 'Generic'
                                break;
                            case 'infoexsub':
                                return 'INFOEX Submission'
                                break;
                        };
                        return value;
                    }
                },
                {
                    header   : 'Date and Time',
                    width    : 120,
                    sortable : true,
                    dataIndex: 'date_time_start',
                    renderer: formatDate
                },
                {
                    header   : 'Observer',
                    width    : 140,
                    sortable : false,
                    dataIndex: 'observer_desc'
                },
                {
                    header   : 'Location',
                    width    : 150,
                    sortable : true,
                    dataIndex: 'terrain_desc'
                },
                {
                    header   : 'Notable',
                    width    : 68,
                    sortable : false,
                    dataIndex: 'notable'
                },
                {
                    header   : 'Name',
                    width    : 150,
                    sortable : false,
                    dataIndex: 'name'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize:PAGING_LIMIT,
                store: tableStore,
                displayInfo: true,
                displayMsg: 'Displaying records {0} - {1} of {2}',
                emptyMsg: "No records to display"
            })
        });
        pc.custom.TaskList.superclass.initComponent.call(this);
    }
});
