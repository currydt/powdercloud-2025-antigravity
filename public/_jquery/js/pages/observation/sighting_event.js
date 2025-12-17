var fs, grid, tableStore, fsContainer, operationTerrainUtil;

Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.StoreMgr.lookup("observerActive").load();
    /*
        FORM
    */
    fs = new Ext.FormPanel({
        form_url: "/json/entity_save/",
        defaults: {
            anchor: '0'
        },
        waitMsgTarget: true,
        reader : new Ext.data.XmlReader({
            record : 'record',
            success: 'success'
        }, [
            {name: 'operation'}
        ]),
        errorReader: new Ext.form.JSONErrorReader(),
        defaults: {
            width: 160
        },
        items:[
            {
                xtype:'hidden',
                name:'key'
            },
	    {
                xtype:'hidden',
                itemId:'created_by',
                id: 'created_by',
                name:'created_by'
            },
	    {
                xtype:'hidden',
                name:'created_date'
            },
	    {
                xtype:'hidden',
                itemId:'map_overlay',
                name:'map_overlay'
            },
	    {
                xtype:'hidden',
                itemId:'operation',
                id: 'operation',
                name:'operation'
            },
	    {
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Operational Header',
                items: [
		{
                    xtype: 'displayfield',
                    fieldLabel: 'Operation',
		    width: 200,
                    id:'operation_desc'
                },
		{
                    xtype: 'displayfield',
                    fieldLabel: 'Data Recorder',
		    width: 200,
                    id:'created_by_desc'
                },
		{
                    xtype:'combo',
                    fieldLabel: 'Observer',
                    hiddenName:'observer',
		     width: 200,
                    id: 'observerCombo',
                    store: 'observerActive',
                    lastQuery: '',
                    valueField:'key',
                    displayField:'full_name',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
		    width: 200,
                    selectOnFocus:true
                },
		{
                    fieldLabel: 'Date and time',
                    name: 'date_time_start',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
		    renderer: formatDate,
		    width: 200
                },
		{
                    xtype:'combo',
                    fieldLabel: 'Location',
                    id: 'location',
                    hiddenName:'terrain',
                     store: new Ext.data.Store({
                        reader: new Ext.data.JsonReader({
                            root: 'rows'
                        }, TerrainVO),
                        root: 'rows',
                        baseParams : {
                            entity: 'Terrain',
                            active: 'True',
			    det: 's',
                            sort: 'name_nick',
                            dir: 'ASC',
                            allowBlankRecord: true
                        },
                        proxy: new Ext.data.ScriptTagProxy({
                            url: '/json/entity_query_all/'
                        })
                    }),
                    valueField:'key',
                    displayField:'name_nick',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    width: 200,
                    selectOnFocus:true
                    },
//		{
//                    xtype:'quickaddlocation'
//                },
//		{
//                    xtype:'combo',
//                    fieldLabel: 'Location',
//                    id: 'location',
//                    hiddenName:'terrain',
//                    width: 200,
//                    store: new Ext.data.Store({
//                        reader: new Ext.data.JsonReader({
//                            root: 'rows'
//                        }, TerrainVO),
//                        root: 'rows',
//                        baseParams : {
//                            entity: 'Terrain',
//                            active: 'True',
//			    det: 'k',
//                            sort: 'name_nick',
//                            dir: 'ASC',
//                            allowBlankRecord: true
//                        },
//                        proxy: new Ext.data.ScriptTagProxy({
//                            url: '/json/entity_query_all/'
//                        })
//                    }),
//                    valueField:'key',
//                    displayField:'name_nick',
//                    editable: false,
//                    triggerAction: 'all',
//                    mode: 'local',
//                    selectOnFocus:true
//                },
		{
                    fieldLabel: 'Notable',
                    name: 'notable',
                    xtype: 'checkbox',
                    width: 100
                },
		{
                    fieldLabel: 'Subject',
                    name: 'subject',
		    width: 600,
                    xtype: 'textfield'
                }
		]
            },{
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Details',
                items: [
                    {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Aspect',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        value: 'Start',
                        cls: 'alignRight',
                        width: 80
                    },{
                        xtype:'combo',
                        hiddenName:'aspect_start',
                        width: 200,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'aspect',
				allowBlankRecord: true
                            },
                            proxy: new Ext.data.ScriptTagProxy({
                                url: '/json/lookup_query_all/'
                            })
                        }),
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },{
                        xtype:'displayfield',
                        value: 'End',
                        cls: 'alignRight',
                        width: 80
                     },{
                        xtype:'combo',

                        hiddenName:'aspect_end',
                        width: 200,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'aspect',
				allowBlankRecord: true
                            },
                            proxy: new Ext.data.ScriptTagProxy({
                                url: '/json/lookup_query_all/'
                            })
                        }),
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Aspect numeric',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        value: 'Start',
                        cls: 'alignRight',
                        width: 80
                    },{
                        name:'aspect_start_numeric',
                         xtype: 'numberfield',
                        width: 200
                    },{
                        xtype:'displayfield',
                        value: 'End',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'aspect_end_numeric',
                         xtype: 'numberfield',
                        width: 200
                    },{
                        xtype:'displayfield',
                        value: 'Measured',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'aspect_measured',
                         xtype: 'checkbox',
                        cls: 'alignLeft',
			 width: 20
                     }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Incline',
                     cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        value: 'Start',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'incline_range_start',
                        width: 200,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        value: 'End',
                         cls: 'alignRight',
                        width: 80
                     },{
			name:'incline_range_end',
			width: 200,
			xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        value: 'Measured',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'incline_measured',
                        xtype: 'checkbox',
                        cls: 'alignLeft',
			width: 20
                    }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Elevation m (feet)',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        value: 'Start',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'elevation_min',
                        width: 200,
                        xtype: 'numberfield'
                    }, {
                        xtype:'displayfield',
                        value: 'End',
                        cls: 'alignRight',
                        width: 80
                    },{
                        name:'elevation_max',
                        width: 200,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        value: 'Measured',
                         cls: 'alignRight',
                        width: 80
                     },{
                        name:'elevation_measured',
                       xtype: 'checkbox',
                        cls: 'alignLeft',
			width: 20
                    }]
                },{
                    xtype:'combo',
                    fieldLabel: 'Sighting Type',
                    hiddenName: 'sighting_type',
                    width: 285,
                    store: new Ext.data.JsonStore({
                        fields: [
                            {name: 'key'},
                            {name: 'value'},
                        ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams : {
                            lookup_code: 'sightingtype',
			    allowBlankRecord: true
                        },
                        proxy: new Ext.data.ScriptTagProxy({
                            url: '/json/lookup_query_all/'
                        })
                    }),
                    valueField:'key',
                    displayField:'value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true
                },{
                    xtype:'combo',
                    fieldLabel: 'Sighting Description',
                    hiddenName: 'observed_how',
                    width: 285,
                    store: new Ext.data.JsonStore({
                        fields: [
                            {name: 'key'},
                            {name: 'value'},
                        ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams : {
                            lookup_code: 'sightingdescriptiontype',
			    allowBlankRecord: true
                        },
                        proxy: new Ext.data.ScriptTagProxy({
                            url: '/json/lookup_query_all/'
                        })
                    }),
                    valueField:'key',
                    displayField:'value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true
                },{
                    xtype:'combo',
                    fieldLabel: 'Activity observed',
                    hiddenName: 'activity',
                    width: 285,
                    store: new Ext.data.JsonStore({
                        fields: [
                            {name: 'key'},
                            {name: 'value'},
                        ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams : {
                            lookup_code: 'sightingactivitytype',
			    allowBlankRecord: true
                        },
                        proxy: new Ext.data.ScriptTagProxy({
                            url: '/json/lookup_query_all/'
                        })
                    }),
                    valueField:'key',
                    displayField:'value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true
                },{
                    xtype:'combo',
                    fieldLabel: 'Species',
                    hiddenName: 'species',
                    width: 285,
                    store: new Ext.data.JsonStore({
                        fields: [
                            {name: 'key'},
                            {name: 'value'},
                        ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams : {
                            lookup_code: 'species',
			    allowBlankRecord: true
                        },
                        proxy: new Ext.data.ScriptTagProxy({
                            url: '/json/lookup_query_all/'
                        })
                    }),
                    valueField:'key',
                    displayField:'value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Number Wildlife Adult',
                     cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        value: 'Male',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'species_number_adult_male',
                        width: 105,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        value: 'Female',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'species_number_adult_female',
                        width: 105,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        value: 'Unknown',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'species_number_adult_unknown',
                        width: 115,
                        xtype: 'numberfield'
                    }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Number Wildlife Juvenile',
                     cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        value: 'Male',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'species_number_juvenile_male',
                       width: 105,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        value: 'Female',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'species_number_juvenile_female',
                        width: 105,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        value: 'Unknown',
                        cls: 'alignRight',
                        width: 80
                     },{
                        name:'species_juvenile_number_unknown',
                        width: 115,
                        xtype: 'numberfield'
                    }]
                },{
                    xtype:'combo',
                    fieldLabel: 'Action taken',
                    hiddenName: 'action_taken',
                    width: 285,
                    store: new Ext.data.JsonStore({
                        fields: [
                            {name: 'key'},
                            {name: 'value'},
                        ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams : {
                            lookup_code: 'sightingactiontaken',
			    allowBlankRecord: true
                        },
                        proxy: new Ext.data.ScriptTagProxy({
                            url: '/json/lookup_query_all/'
                        })
                    }),
                    valueField:'key',
                    displayField:'value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true
                },{
                    fieldLabel: 'Action Taken Remark',
                    name: 'action_taken_remark',
                    xtype: 'textarea',
                    width: 600
                }, {
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 600
                }

                ]
            }
        ]
    });
    /*
        Google map
    */
    googleMap = new Ext.FormPanel({
	 hidden:true,
         defaults: {
            anchor: '0'
        },
        items: [{
            xtype:'fieldset',
            collapsible: false,
            width: '75%',
            itemId: 'mapContainer',
            title:'Map Overlay',
            listeners:{
		scope: this,
		expand: function(cmp){
		    var temp = cmp.get('map');
		    temp.getMap().checkResize();
		}
	    },
            items:[{
                xtype: 'gmappanel',
                itemId: 'map',
                width: 966,
                height: 600,
    		gmapType: 'map'
            }]
        }]
    });
   operationTerrainUtil = new OperationTerrainUtil(fs.get('map_overlay'),
                                                    null,
                                                    Ext.getCmp('observerCombo'),
                                                    Ext.getCmp('location'),
                                                    googleMap.get('mapContainer').get('map') ); /*
                                                     ,obliqueForm.get('photoContainer').get('photoEditor'));*/
    /*
        Form Container
    */
    fsContainer = new Ext.Panel({
        title:'',
        hidden:true,
        renderTo:'form-loc',
        plain: true,
        width   : '100%',
	border: false,
        defaults:{
            plain: true,
            border: false,
            width   : '100%',
            bodyStyle: 'padding: 5px'
        },
        items:[
            fs,
            googleMap
        ],
        buttons:[{
            text: 'Save',
            /*iconCls: 'ui-icon-disk',*/
            handler: function(button){
		button.disable();
                operationTerrainUtil.saveChanges();
                fs.getForm().submit({
                    url:fs.form_url,
                    waitMsg:'Saving Data...',
                    params:{
                        entity: 'Sighting',
                        form: 'pc.forms.observation.SightingEventObservationForm',
			type: 'sightingevent__ObservationType__lookup'
                    },
                    submitEmptyText: false,
                    success: function(form, action) {
                        fsContainer.hide();
                        var key = Ext.decode(action.response.responseText).key;

                        grid.show();
                        tableStore.reload();
			button.enable();

                    },
		    failure: function(form, action){
			button.enable();
			formFailureFunction();
		    }
                });
            }
        },{
            text: 'Cancel',
            handler: function(){
                fsContainer.hide();
                grid.show();
            }
        }]
    });
    /*
        TABLE
    */
    var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    // Create RowActions Plugin
    var action = new Ext.ux.grid.RowActions({
        header:'',
        width: 80,
        keepSelection:true,
        actions:[{
               iconCls:'ui-icon ui-icon-wrench',
               tooltip:'Edit',
               callback:function(grid, records, action) {
                    operationTerrainUtil.reset();
                    operationTerrainUtil.setRecord(records);
                    fs.getForm().loadRecord(records);
                    operationTerrainUtil.loadLocation(records.data.operation);
                    fsContainer.show();
                    grid.hide();
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
                                    entity: 'Sighting'
                                },
                                success: function(action, options) {
                                    tableStore.reload();
                                    deleteFunciton(action, options);
                                }
                            });
                        }
                    }, this);
               }
       }]
    });
    // create the data store
    tableStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, SightingVO),
        remoteSort: true,
        baseParams:{
            entity: 'Sighting',
            operation: operation.key,
            type__ObservationType__lookup: 'sightingevent',
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
        loadMask: true,
        plugins:[action, expander],
	tbar: new Ext.Toolbar({
            items: ['->',{
		    text: 'Add',
		    iconCls: 'add-icon',
		    scope: this,
		    handler: function() {
			var record = new SightingVO({       created_by: party.key,
                                            created_by_desc: party.name,
					    created_date: new Date(),
                                            date_time_start: new Date(),
					    observer: party.key,
					    operation: operation.key,
                                            operation_desc:operation.name
                                            });
			operationTerrainUtil.reset();
			operationTerrainUtil.setRecord(record);
			fs.getForm().setValues( newRecordForForm(record));
			operationTerrainUtil.loadLocation(record.data.operation);
			fsContainer.show();
			grid.hide()
		    }
		}
            ]
        }),
        columns: [
	    expander,
            action,
            {
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dataIndex: 'date_time_start',
                renderer: formatDate
            },{
                id       :'observer',
                header   : 'Observer',
                width    : 140,
                sortable : false,
                dataIndex: 'observer_desc'
            },{
                id       :'terrain',
                header   : 'Location',
                width    : 150,
                sortable : true,
                dataIndex: 'terrain_desc'
            },{
                id       :'notable',
                header   : 'Notable',
                width    : 68,
                sortable : false,
                dataIndex: 'notable'
            },{
                id       :'subject',
                header   : 'Subject',
                width    : 150,
                sortable : false,
                dataIndex: 'subject'
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

     /*
        LinkUtil
    */
    var linkUtil = new LinkUtil({form: fs,
                                entity: 'Sighting',
                                record: new SightingVO(),
                                fn: function(records){
				    operationTerrainUtil.reset();
				    operationTerrainUtil.setRecord(records);
				    fs.getForm().loadRecord(records);
				    operationTerrainUtil.loadLocation(records.data.operation);
				    fsContainer.show();
				    grid.hide();
                                }
    });
});
