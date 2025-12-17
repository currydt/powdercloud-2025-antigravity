var fs, grid, tableStore, photoForm, obliqueForm, googleMap, fsContainer, operationTerrainUtil ;

Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.StoreMgr.lookup("observerActive").load();

 	// FORM
	fs = new Ext.FormPanel({
		form_url: "/json/entity_save/",
		defaults: {
			anchor: '0'
		},
		waitMsgTarget: true,
		reader : new Ext.data.XmlReader({
			record : 'record',
			success: 'success'
			},
			[
				{name: 'operation'}
			]
		),
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
				name:'created_date'
			},
			{
				xtype:'hidden',
				itemId:'operation',
				id: 'operation',
				name:'operation'
			},
			{
				xtype:'hidden',
				itemId:'created_by',
				id: 'created_by',
				name:'created_by'
			},
			{	// Operation
				xtype:'fieldset',
				collapsible: true,
				collapsed: true,
				width: '75%',
				title:'Operational Header',
				items: [
					{
						xtype:'container',
						html:'<p> This section allows you to record details related to your operation. The notable and description fields are provided to assist in identifying specific obserations. </p>'
					},
					{
						xtype: 'displayfield',
						fieldLabel: 'Operation',
						width: 200,
						id:'operation_desc'
					},
					{
						xtype: 'displayfield',
						fieldLabel: 'Data Recorder',
						id:'created_by_desc',
						width: 200
					},
					{
						xtype:'combo',
						fieldLabel: 'Observer',
						hiddenName:'observer',
						id: 'observerCombo',
						width: 200,
						store: 'observerActive',
                                                lastQuery: '',
						valueField:'key',
						displayField:'full_name',
						editable: false,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true
					},
					{
						fieldLabel: 'Notable',
						name: 'notable',
						xtype: 'checkbox',
						width: 100
					},
					{
						fieldLabel: 'Description',
						name: 'subject',
						xtype: 'textfield',
						width: 600
					}
				]
			},
			{	// Scope
				xtype:'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title:'Scope',
				items: [
					{
						xtype:'container',
						html:'<p> This section allows you to specify the observation date and time, and its key location. Locations are limited to type Region, Forecast, and Operating Zone.</p>'
					},
					{
						fieldLabel: 'Date and time',
						name: 'date_time_start',
						xtype: 'datetimefield',
						dateFormat: 'Y-m-d',
						timeFormat: 'H:i',
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
								det: 'k',
								active: 'True',
								sort: 'name_nick',
								dir: 'ASC',
								allowBlankRecord: true,
								feature_type__selfRef: 'Region,Operating Zone,Forecast Zone'
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
					}
				]
			},
                { // Details
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Details',
                items: [
                {
                    fieldLabel: 'Percent Observed',
                    name: 'tenure_observed_percent',
                    xtype: 'numberfield',
                    width: 200
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Occurrence',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    // {
                    //    xtype:'displayfield',
                    //    value: 'Date/Time',
                    //    cls: 'alignRight',
                    //    width: 80
                    //},
                    //
                    {
                        name: 'date_time_occurrence',
                       xtype: 'datetimefield',
                        dateFormat: 'Y-m-d',
                        timeFormat: 'H:i',
                        width: 200

                    },{
                        xtype:'displayfield',
                        value: 'Range',
                        cls: 'alignRight',
                        width: 80
                    },{
                        name: 'time_range',
                        xtype: 'textfield',
                        width: 200
                    }]
                    },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Distribution',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    //{
                    //    xtype:'displayfield',
                    //    value: 'Descriptor',
                    //    cls: 'alignRight',
                    //    width: 80
                    //},
                    {
                        xtype:'combo',

                        hiddenName:'multiple_descriptor',
                        width: 200,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'avalanchedistribution',
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
                    }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Aspect',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
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
                    }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Incline',
                     cls: 'composite-field',
                    width: '100%',
                    items: [{
                        name:'incline_range_start',
                        width: 200,
                        xtype: 'numberfield'
                    }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Elevation m (feet)',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        name:'elevation_min',
                        width: 200,
                        xtype: 'numberfield'
                    }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Destructive size',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    //{
                    //    xtype:'displayfield',
                    //    value: 'Max',
                    //    width: 60
                    //},
                    {
                        xtype:'combo',
                        hiddenName:'destructive_size_max',
                        width: 405,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'sizedestructive',
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
                    fieldLabel: 'Trigger',
                    msgTarget : 'side',
                    height: 30,
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        hiddenName:'trigger',
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root: 'rows'
                            }, LookupVO),
                            autoLoad: true,
                            baseParams : {
	                            lookup_code: "trigger" + ( isOperationSWAG ? "_swag" : "" ),
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
                        selectOnFocus:true,
                        width: 200,
                        cascadeComboId: 'trigger_minor'
                    },{
                        xtype:'combo',
                        hiddenName:'trigger_minor',
                        id: 'trigger_minor',
                        width: 200,
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                            }, LookupVO)
                        }),
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    }]
                },{
                    xtype:'combo',
                    fieldLabel: 'Failure type',
                    hiddenName:'failure_type',
                    store: new Ext.data.JsonStore({
                        fields: [
                            {name: 'key'},
                            {name: 'code_value'},
                        ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams : {
                            lookup_code: "failuretype" + ( isOperationSWAG ? "_swag" : "" ),
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
                    selectOnFocus:true,
                    width:200
                },{
                    fieldLabel: 'Failure plane age',
                    name: 'failure_plane_age',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
                    width:200
                },{
                    xtype: 'compositefield',
                    fieldLabel: 'Failure plain grain',
                    msgTarget : 'side',
                    height: 30,
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        hiddenName:'surface_snow_form',
                        width: 265,
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root: 'rows'
                            }, LookupVO),
                            autoLoad: true,
                            baseParams : {
                                lookup_code: 'snowonground',
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
                        selectOnFocus:true,
                        cascadeComboId: 'surface_snow_form_minor'
                    },{
                        xtype:'combo',
                        id: 'surface_snow_form_minor',
                        hiddenName:'surface_snow_form_minor',
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                            }, LookupVO)
                        }),
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true,
                        width: 265
                    },{
                        xtype:'displayfield',
                        value: 'Size m',
                        cls: 'alignRight',
                        width: 40
                    },{
                        fieldLabel: 'Size',
                        name: 'surface_snow_size',
                        xtype: 'numberfield',
                        width: 40
                    },{
                        xtype:'displayfield',
                        value: 'Rimed',
                        cls: 'alignRight',
                        width: 60
                    },{
                        name: 'surface_snow_form_rimed',
                        xtype: 'checkbox',
                        cls: 'alignLeft',
                        width: 20
                    }]
                },{
                    xtype: 'compositefield',
                    height: 30,
                    fieldLabel: 'Slab m',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        value: 'Thickness',
                        cls: 'alignRight',
                        width: 60
                    },{
                        name:'slab_thickness_avg',
                        width: 115,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        value: 'Width',
                        cls: 'alignRight',
                        width: 60
                    },{
                        name:'slab_width_avg',
                        width: 115,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        value: 'Path run',
                        cls: 'alignRight',
                        width: 60
                    },{
                        name:'path_run_length_min',
                        width: 115,
                        xtype: 'numberfield'
                    }]
                },{
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width:600
                }]
            }]
    });
    // create the data store
    tableStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, AvalancheVO),
        remoteSort: true,
        baseParams:{
            entity: 'Avalanche',
            type__ObservationType__lookup: 'avalanchesummary',
            operation: operation.key,
            start:0,
            limit:PAGING_LIMIT
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/entity_query_all_paging/'
        })
    });
    /*
        Photo Upload section
    */
    photoForm = new pc.custom.PhotoUploadCmp({
        hidden:true,
        cmpTitle: 'Event Photo Upload',
        entity: 'Avalanche',
        image_type: 'ow',
        cmpUploadMsg: 'Event Photo',
        storesReload: [
	    tableStore
	]
    });
    /*
        Oblique Photo section
    */
    obliqueForm = new Ext.FormPanel({
        hidden:true,
        form_url: "/observation/avalanche-summary/detailEdit//",
        defaults: {
            anchor: '0'
        },
        items: [{
            xtype:'fieldset',
            itemId: 'photoContainer',
            collapsible: true,
            collapsed: true,
            width: '75%',
            title:'Oblique Photo Overlay',
            defaults: {
                allowBlank: false,
                msgTarget: 'side',
                id: 'file',
                name: 'file'
            },
            items:[{
                xtype: 'container',
                itemId: 'oblique-photo-base',
                id: 'oblique-photo-base',
                width: 800,
                height: 800
            },{
                xtype: 'button',
                itemId: 'photoEditor',
                width: 40,
                text: 'Edit',
                handler: function(button, event){
                    operationTerrainUtil.editPhoto();
                }
            }]
        }]
    });
    /*
        Google map
    */
    googleMap = new Ext.FormPanel({
        hidden:true,
        form_url: "/observation/avalanche-summary/detailEdit//",
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
                                                    fs.get('photo_overlay'),
                                                        Ext.getCmp('observerCombo'),
                                                        Ext.getCmp('location'),
                                                        googleMap.get('mapContainer').get('map'),
                                                        obliqueForm.get('photoContainer').get('photoEditor') );
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
            googleMap,
            photoForm,
            obliqueForm

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
                        entity: 'Avalanche',
                        form: 'pc.forms.observation.ObservationForm',
                        type: 'avalanchesummary__ObservationType__lookup'
                    },
                    submitEmptyText: false,
                    success: function(form, action) {
                        fsContainer.hide();
                        var key = Ext.decode(action.response.responseText).key;
                        // photo
                        photoForm.savePhoto(key);
                        // svg

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
                    photoForm.setRecord(records);
                    Ext.getCmp('oblique-photo-base').update('<img src="/photos/terrain/'+records.data.terrain+'/ow/m/"/>');
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
                                    entity: 'Avalanche'
                                },
                                success: function(action, options){
                                    tableStore.reload();
                                    deleteFunciton(action, options);
                                }
                            });
                        }
                    }, this);
               }
       }]
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
                        var record = new AvalancheVO({      created_by: party.key,
                                                created_by_desc: party.name,
                                            created_date: new Date(),
                                            observer: party.key,
                                            date_time_start: new Date(),
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
                header   : 'Description',
                width    : 150,
                sortable : false,
                dataIndex: 'subject'
            },{
                id       :'comments_internal',
                header   : 'Comment',
                width    : 300,
                sortable : false,
                dataIndex: 'comments_internal'
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
                                entity: 'Avalanche',
                                record: new AvalancheVO(),
                                fn: function(records){
                                    operationTerrainUtil.reset();
                                    operationTerrainUtil.setRecord(records);
                                    fs.getForm().loadRecord(records);
                                    operationTerrainUtil.loadLocation(records.data.operation);
                                    Ext.getCmp('photo-display').update('<img src="/photos/observation/'+records.data.key+'/ow/m/"/>');
                                    Ext.getCmp('oblique-photo-base').update('<img src="/photos/terrain/'+records.data.terrain+'/ow/m/"/>');
                                    fsContainer.show();
                                    grid.hide();
                                }
    });
});
