var detailForm, tableStore, grid, mapForm,
obliqueWinterPhoto, obliqueSummerPhoto,
aerialWinterPhoto, aerialSummerPhoto,
fsContainer, controller;
function Controller(){

}
Controller.prototype.load = function(record){
    detailForm.getForm().loadRecord(record);
    if(isOperationInfoEx){
	Ext.getCmp('terrainInfoexButton').enable();
    }
    this.loadDropdowns(record.data.operation);
    obliqueWinterPhoto.setRecord(record);
    obliqueSummerPhoto.setRecord(record);
    aerialWinterPhoto.setRecord(record);
    aerialSummerPhoto.setRecord(record);
    fsContainer.show();
    mapForm.get('mapContainer').get('map').setMapData(null, record.data.map_overlay);
    //Ext.get('viewstack-content').hide();
    grid.hide();
}
Controller.prototype.submitInfoEx = function(terrain){
    if(terrain === undefined){
	terrain = null;
    }
    if(operation_id && isOperationInfoEx){
		Ext.MessageBox.show({
		    msg: 'Submitting...',
		    progressText: 'Submitting...',
		    closable: false,
		    modal: true,
		    width:300,
		    wait:true
		});

		Ext.Ajax.request({
		    method: 'POST',
		    url: (terrain === null) ? '/infoex/export-terrain/'+operation_id+'//': '/infoex/export-terrain/'+operation_id+'/'+terrain+'/',
		    success: function(action, options) {
				Ext.MessageBox.hide();
				Ext.Msg.show({
					title:'Success',
					msg: 'InfoEx submitted successfully.',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO
				});
		    },
		    failure: function(action, options) {
				Ext.MessageBox.hide();
				Ext.Msg.show({
					title:'Error Submitting InfoEx',
					msg: 'Error in submitting InfoEx.',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.WARNING
				});
		    }
		});
    }
}
Controller.prototype.add = function(){
    var record = new TerrainVO({active: true, operation: operation_id});
    if(isOperationInfoEx){
	Ext.getCmp('terrainInfoexButton').disable();
    }
    var fields = (record).fields.items;
    var values = new Object();
    for(var key in fields){
	var name = fields[key].name;
	if(record.get(name)){
	    values[name] = record.get(name);
	}	else {
	    values[name] = null;
	}

    }
    mapForm.get('mapContainer').get('map').clearOverlays();
    this.loadDropdowns(record.data.operation);
    detailForm.getForm().setValues( values);
    fsContainer.show();
    //Ext.get('viewstack-content').hide();
    grid.hide();
}
Controller.prototype.save = function(){
    Ext.getCmp('map_overlay').setValue(mapForm.get('mapContainer').get('map').getMapData());
    detailForm.getForm().submit({
	url:detailForm.form_url,
	params:detailForm.form_params,
	waitMsg:'Saving Data...',
	submitEmptyText: false,
	scope: this,
	success: function(form, action) {
	    var key = Ext.decode(action.response.responseText).key;
	     // photos
	    obliqueWinterPhoto.savePhoto(key);
	    obliqueSummerPhoto.savePhoto(key);
	    aerialWinterPhoto.savePhoto(key);
	    aerialSummerPhoto.savePhoto(key);

	    if( isOperationInfoEx ) {
		    Ext.Ajax.request({
				method: 'POST',
				url: '/infoex/export-terrain//'+key+'/',
				callback: function(action, success, response ) {
				    if(response && response.responseText){
					var json = Ext.decode(response.responseText);
					if(json.success){
					    Ext.Msg.show({
						title:'Success',
						msg: 'Data exported.',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.INFO
					    });
					}	else {
					    Ext.Msg.show({
						title:'Error',
						msg: json.errors.join('<br>'),
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.WARNING
					    });
					}
				    }	else {
					Ext.Msg.show({
					    title:'Error',
					    msg: 'Error exporting data.',
					    buttons: Ext.Msg.OK,
					    icon: Ext.MessageBox.WARNING
					});    
				    }
				    
				}
		    });
		}
	    fsContainer.hide();
	    //Ext.get('viewstack-content').show();
	    grid.show();
	    tableStore.reload();
	    this.loadDropdowns(operation_id);
	    Ext.getCmp('saveButton').enable();
	},
	failure: function(form, action){
	    Ext.getCmp('saveButton').enable();
	    formFailureFunction();
	}
    });
}
Controller.prototype.loadDropdowns = function(operationId){
    Ext.StoreMgr.lookup("forecastZoneStore").setBaseParam('operation', operationId);
    Ext.StoreMgr.lookup("forecastZoneStore").reload();
    Ext.StoreMgr.lookup("operatingZoneStore").setBaseParam('operation', operationId);
    Ext.StoreMgr.lookup("operatingZoneStore").reload();
    Ext.StoreMgr.lookup("regionStore").setBaseParam('operation', operationId);
    Ext.StoreMgr.lookup("regionStore").reload();
    Ext.StoreMgr.lookup("routeStore").setBaseParam('operation', operationId);
    Ext.StoreMgr.lookup("routeStore").reload();
}
Ext.onReady(function(){
    Ext.QuickTips.init();
    /*
        Tabs
    */
    $("#tabs").tabs({
        selected: 2,
        select: jqueryTabClick
    });
    /*
        FORM
    */
    detailForm = new Ext.FormPanel({
        form_url: "/json/entity_save/",
	form_params:{
	    entity: 'Terrain',
	    form: 'pc.forms.admin.TerrainAdminForm'
	},
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
        items:[
		{
		    xtype:'hidden',
		    id: 'terrainKey',
		    itemId: 'terrainKey',
		    name:'key'
		},
		{
		    xtype:'hidden',
		    name:'operation'
		},
		{
		    xtype:'hidden',
		    id:'map_overlay',
		    itemId:'map_overlay',
		    name:'map_overlay'
		},
		{
		xtype:'fieldset',
		collapsible: true,
		collapsed: false,
		width: '75%',
		title:'Details',
		items: [
			    {
				xtype:'container',
				cls: 'description-text',
				width: '100%',
				html: '<p>The following is a list of Terrain Features.  Each feature has a Nick Name that will be displayed in the drop-down location menus. The user should include a country and mountain range for each feature, selected form the pre-defined items in these drop-down menus. The user has one default called Tenure and it has a Feature type of Region.<p>'
			    },
			    {
				fieldLabel: 'Nick Name',
				name: 'name_nick',
				xtype:'textfield',
				width:200
			    },
			    {
				fieldLabel: 'Abbreviation',
				name: 'abbreviation',
				xtype:'textfield',
				width:200
			    },
			    {
			    fieldLabel: 'Active',
			    name: 'active',
			    xtype: 'checkbox',
			    width: 100
			    },
			    {
				xtype:'combo',
				fieldLabel: 'Country',
				hiddenName:'country',
				width:200,
				store: new Ext.data.JsonStore({
				    fields: [
					{name: 'key'},
					{name: 'value'},
				    ],
				    autoLoad: true,
				    root: 'rows',
				    baseParams : {
					lookup_code: 'country',
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
			    },
			    {
				xtype:'combo',
				fieldLabel: 'Mountain Range',
				hiddenName:'mountain_range',
				width: 200,
				store: new Ext.data.JsonStore({
				    fields: [
					{name: 'key'},
					{name: 'value'},
				    ],
				    autoLoad: true,
				    root: 'rows',
				    baseParams : {
					lookup_code: 'mountainrange',
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
			    },
			    {
				xtype:'combo',
				fieldLabel: 'Feature Type',
				hiddenName:'feature_type',
				width: 200,
				store: new Ext.data.JsonStore({
				    fields: [
					{name: 'key'},
					{name: 'code'},
				    ],
				    autoLoad: true,
				    root: 'rows',
				    baseParams : {
					lookup_code: 'featuretype'
				    },
				    proxy: new Ext.data.ScriptTagProxy({
					url: '/json/lookup_query_all/'
				    })
				}),
				valueField:'key',
				displayField:'code',
				editable: false,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			    },
			    {
				xtype:'combo',
				fieldLabel: 'Region',
				hiddenName:'region',
				width: 200,
				store: new Ext.data.Store({
				    storeId: 'regionStore',
				    reader: new Ext.data.JsonReader({
					root: 'rows'
				    }, TerrainVO),
				    root: 'rows',
				    baseParams : {
					entity: 'Terrain',
					feature_type__selfRef: 'Region',
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
				selectOnFocus:true
			    },
			    {
				xtype:'combo',
				fieldLabel: 'Operating Zone',
				hiddenName:'operating_zone',
				width: 200,
				store: new Ext.data.Store({
				    storeId: 'operatingZoneStore',
				    reader: new Ext.data.JsonReader({
					root: 'rows'
				    }, TerrainVO),
				    root: 'rows',
				    baseParams : {
					entity: 'Terrain',
					feature_type__selfRef: 'Operating Zone',
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
				selectOnFocus:true
			    },
			    {
				xtype:'combo',
				fieldLabel: 'Forecast Zone',
				hiddenName:'forecast_zone',
				width: 200,
				store: new Ext.data.Store({
				    storeId: 'forecastZoneStore',
				    reader: new Ext.data.JsonReader({
					root: 'rows'
				    }, TerrainVO),
				    root: 'rows',
				    baseParams : {
					entity: 'Terrain',
					feature_type__selfRef: 'Forecast Zone',
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
				selectOnFocus:true
			    },
			    {
				xtype:'combo',
				fieldLabel: 'Route',
				hiddenName:'route',
				width: 200,
				store: new Ext.data.Store({
				    storeId: 'routeStore',
				    reader: new Ext.data.JsonReader({
					root: 'rows'
				    }, TerrainVO),
				    root: 'rows',
				    baseParams : {
					entity: 'Terrain',
					feature_type__selfRef: 'Route',
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
				selectOnFocus:true
			    },
			    {
				fieldLabel: 'Sort Order',
				name: 'sort_order',
				xtype: 'numberfield',
				width: 80
			    },
			    {
				xtype: 'compositefield',
				msgTarget : 'side',
				height: 30,
				fieldLabel: 'Aspect',
				cls: 'composite-field',
				width: '100%',
				items: [
					{
					    xtype:'displayfield',
					    value: 'Start',
					    cls: 'alignRight',
					    width: 60
					},
					{
					    xtype:'combo',

					    hiddenName:'aspect_start',
					    width: 200,
					    store: new Ext.data.JsonStore({
						fields: [
						    {name: 'key'},
						    {name: 'value'},
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
					    displayField:'value',
					    editable: false,
					    triggerAction: 'all',
					    mode: 'local',
					    selectOnFocus:true
					},
					{
                                xtype:'displayfield',
                                value: 'End',
                                cls: 'alignRight',
                                width: 60
                            },
                            {
                                xtype:'combo',

                                hiddenName:'aspect_end',
                                width: 200,
                                store: new Ext.data.JsonStore({
                                    fields: [
                                        {name: 'key'},
                                        {name: 'value'},
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
                                displayField:'value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                selectOnFocus:true
                            }
                        ]
                        },
			{
				xtype: 'compositefield',
				msgTarget : 'side',
				height: 30,
				fieldLabel: 'Elevation (OGRS units in meters & SWAG in feet)',
				cls: 'composite-field',
				width: '100%',
				items: [
					    {
						xtype:'displayfield',
						value: 'Min',
						cls: 'alignRight',
						width: 60
					    },
					    {
						name:'elevation_min',
						width: 200,
						xtype: 'numberfield'
					    },
					    {
						xtype:'displayfield',
						value: 'Max',
						cls: 'alignRight',
						width: 60
					    },
					    {
						name:'elevation_max',
						width: 200,
						xtype: 'numberfield'
					    }
					]
			    },
			    {
				xtype: 'compositefield',
				msgTarget : 'side',
				height: 30,
				fieldLabel: 'Incline',
				 cls: 'composite-field',
				width: '100%',
				items: [
					    {
						xtype:'displayfield',
						value: 'Start',
						cls: 'alignRight',
						width: 60
					    },
					    {
						name:'incline_range_start',
						width: 200,
						xtype: 'numberfield'
					    },
					    {
						xtype:'displayfield',
						value: 'End',
						cls: 'alignRight',
						width: 60
					    },
					    {
						name:'incline_range_end',
						width: 200,
						xtype: 'numberfield'
					    }
					]
                        },
			{
			    xtype: 'compositefield',
			    msgTarget : 'side',
			    height: 30,
			    fieldLabel: 'Coordinates',
			    cls: 'composite-field',
			    width: '100%',
			    items: [
					{
					    xtype:'displayfield',
					    value: 'Lattitude',
					    cls: 'alignRight',
					    width: 60
					},
					{
					    name:'latitude',
					    width: 200,
					    xtype: 'textfield'
					},
					{
					    xtype:'displayfield',
					    value: 'Longitude',
					    cls: 'alignRight',
					    width: 60
					},
					{
					    name:'longitude',
					    width: 200,
					    xtype: 'textfield'
					}
				   ]
			},
			{
			    fieldLabel: 'Terrain Summary',
			    name: 'comments_internal',
			    xtype: 'htmleditor',
			    width: 600
			}


		    ]
	    }
	]
    });


    mapForm = new Ext.FormPanel({
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
            items:[
	    {
		xtype:'container',
		cls: 'description-text',
		width: '100%',
		html: '<p>The following map displays the location of the various observations. You can mange the view by using the toolbar (for example, Map or Earth). You can alter the scale using the vertical scale, and while in Earth mode you can alter the prespecitve with the upper left control.<p>'
	    }
	    ,{
                xtype: 'gmappanel',
                itemId: 'map',
                width: 910,
                height: 600,
    		gmapType: 'map'
            }]
        }]
    });


    // create the data store
    tableStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, TerrainVO),
        remoteSort: true,
        baseParams:{
            entity: 'Terrain',
            operation: operation_id,
	    start:0,
	    limit:PAGING_LIMIT
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/entity_query_all_paging/'
        })
    });
    obliqueWinterPhoto = new pc.custom.PhotoUploadCmp({
        cmpTitle: 'Oblique Winter Photo',
	storesReload: [
	    tableStore
	],
        entity: 'Terrain',
        image_type: 'ow',
        cmpUploadMsg: 'Oblique Winter Photo'
    });

    obliqueSummerPhoto = new pc.custom.PhotoUploadCmp({
        cmpTitle: 'Oblique Summer Photo',
	storesReload: [
	    tableStore
	],
        entity: 'Terrain',
        image_type: 'os',
        cmpUploadMsg: 'Oblique Summer Photo'
    });
    aerialWinterPhoto = new pc.custom.PhotoUploadCmp({
        cmpTitle: 'Aerial Winter Photo',
	storesReload: [
	    tableStore
	],
        entity: 'Terrain',
        image_type: 'aw',
        cmpUploadMsg: 'Aerial Winter Photo'
    });
    aerialSummerPhoto = new pc.custom.PhotoUploadCmp({
        cmpTitle: 'Aerial Summer Photo',
	storesReload: [
	    tableStore
	],
        entity: 'Terrain',
        image_type: 'as',
        cmpUploadMsg: 'Aerial Summer Photo'
    });


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
		detailForm,
		mapForm,
		obliqueWinterPhoto,
		obliqueSummerPhoto,
		aerialWinterPhoto,
		aerialSummerPhoto
	    ],
        buttons:[{
            text: 'Save',
	    id: 'saveButton',
            /*iconCls: 'ui-icon-disk',*/
            handler: function(button){
		button.disable();
                controller.save();
            }
        },{
	    text: 'InfoEx',
	    tooltip: 'Submit to InfoEx',
	    id: 'terrainInfoexButton',
	    //iconCls: 'add-icon',
	    scope: this,
	    hidden: !isOperationInfoEx,
	    handler: function() {
		controller.submitInfoEx(Ext.getCmp('terrainKey').getValue());
	    }
	},{
            text: 'Cancel',
            handler: function(){
                //Ext.get('viewstack-content').show();
		grid.show();
                fsContainer.hide();
            }
        }]
    });



    // TABLE Expander
	var expander = new Ext.ux.grid.RowExpander({
		tpl : new Ext.Template( '<p><b>Comment:</b> {comments_internal}</p>' )
	});
    /*
        TABLE
    */
    // Create RowActions Plugin
//    var actiongrid = new Ext.ux.grid.RowActions({
    var action = new Ext.ux.grid.RowActions({
        header:'',
        width: 110,
        keepSelection:true,
        actions:[{
               iconCls:'ui-icon ui-icon-wrench',
               tooltip:'Edit',
               callback:function(grid, records, action) {
		    controller.load(records);
               }
       },{
               iconCls:'ui-icon ui-icon-locked',
               tooltip:'Lock',
               callback:function(grid, records, action) {
                    alert('Lock '+records.data.key)// TODO
               }
       }
	   /* Delete disabled for now
	    ,{
               iconCls:'ui-icon ui-icon-trash',
               tooltip:'Delete',
               callback:function(grid, records, action) {
		    this.doDelRecord = records;
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete the record?', function(btn){
                        if(btn == "yes"){
			    this.doDelRecord.set('active', false);
			    Ext.Ajax.request({
				method: 'POST',
				url: detailForm.form_url,
				scope: this,
				params: Ext.apply(detailForm.form_params, ServerUtils.prepareFieldsForService(this.doDelRecord)),
				success: function(){
				    tableStore.reload();
				}
			    });
                        }
                    }, this);
               }
       }*/
       ]
    });


    // create the Grid
    grid = new Ext.grid.GridPanel({
        store: tableStore,
        loadMask: true,
// plugins:[actiongrid],
	plugins:[action, expander],

        tbar: new Ext.Toolbar({
            items: [{
                    xtype: 'textfield',
                    searchBy: 'name_nick',
		    store:tableStore,
		    width: 150,
                    emptyText: 'Search by exact name',
		    listeners: {
			keyup: {
			    scope:this,
			    fn: function(obj, a ,b,c) {
				obj.store.setBaseParam(obj.searchBy,obj.getValue());
				obj.store.load();
			    },
			    buffer: 1200
			}
		    }
                },'->',{
		    text: 'InfoEx',
		    tooltip: 'Submit to InfoEx',
		    //iconCls: 'add-icon',
		    scope: this,
		    hidden: !isOperationInfoEx,
		    handler: function() {
			controller.submitInfoEx();
		    }
		},{
		    text: 'Add',
		    iconCls: 'add-icon',
		    scope: this,
		    handler: function() {
			controller.add();
		    }
		}
            ]
        }),
        columns: [
//actiongrid,
		    expander,
		    action,
		    {
			id       :'name_nick',
			header   : 'Nick name',
			width    : 120,
			sortable : true,
			dataIndex: 'name_nick'
		    },
		    {
			header: 'Sort Order',
			dataIndex: 'sort_order',
			sortable : true,
			width: 100
		    },
		    {
			header   : 'Active',
			width    : 80,
			sortable : true,
			dataIndex: 'active',
			renderer: function(val, meta, record) {
			    return (record.data.active)?'Active':'';
			}
		    },
		    {
			header   : 'Oblique Photo',
			width    : 100,
			sortable : true,
			dataIndex: 'photo_oblique_winter_present',
			renderer: function(val, meta, record) {
			    return (record.data.photo_oblique_winter_present)?'Yes':'';
			}
		    },
		    {
			header: 'Country',
			dataIndex: 'country_desc',
			sortable : true,
			width: 105
		    },
		    {
			header: 'Mountain Range',
			dataIndex: 'mountain_range_desc',
			sortable : true,
			width: 120
		    },
		    {
			header: 'Feature Type',
			dataIndex: 'feature_type_desc',
			sortable : true,
			width: 120
		    },
		    {
			header: 'Region',
			dataIndex: 'region_desc',
			sortable : true,
			width: 120
		    },
		    {
			header: 'Operating Zone',
			dataIndex: 'operating_zone_desc',
			sortable : true,
			width: 120
		    },
		    {
			header: 'Forecast Zone',
			dataIndex: 'forecast_zone_desc',
			sortable : true,
			width: 120
		    },
		    {
			header: 'Route',
			dataIndex: 'route_desc',
			sortable : true,
			width: 120
		    },
		    {
			id       :'aspect_start',
			header   : 'Aspect Start',
			width    : 100,
			sortable : true,
			dataIndex: 'aspect_start_code'
		    },
		    {
			id       :'aspect_end',
			header   : 'Aspect End',
			width    : 100,
			sortable : true,
			dataIndex: 'aspect_end_code'
		    },
		    {
			id       :'elevation_min',
			header   : 'Elevation Min',
			width    : 100,
			sortable : true,
			dataIndex: 'elevation_min'
		    },
		    {
			id       :'elevation_max',
			header   : 'Elevation Max',
			width    : 100,
			sortable : true,
			dataIndex: 'elevation_max'
		    },
		    {
                            id       :'incline_range_start',
                            header   : 'Incline Start',
                            width    : 100,
                            sortable : true,
                            dataIndex: 'incline_range_start'
                    },
		    {
                            id       :'incline_range_end',
                            header   : 'Incline End',
                            width    : 100,
                            sortable : true,
                            dataIndex: 'incline_range_end'
                    },
		    {
                            id       :'latitude',
                            header   : 'Latitude',
                            width    : 100,
                            sortable : true,
                            dataIndex: 'latitude'
                    },
		    {
                            id       :'longitude',
                            header   : 'Longitude',
                            width    : 100,
                            sortable : true,
                            dataIndex: 'longitude'
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
    tableStore.load();
    /*
       TREE

    var tree = new Ext.tree.TreePanel({
        height: 400,
        width: 810,
        renderTo: 'tree-terrain-list',
        useArrows: true,
        autoScroll: true,
        animate: true,
        enableDD: true,
        // auto create TreeLoader
        //dataUrl: '/static/dummydata/treegrid-data.js',
        autoScroll: true,
        split: true,
        loader: new Ext.tree.TreeLoader(),
        root: new Ext.tree.AsyncTreeNode({
            expanded: true,
            children: [{
                text: 'Menu Option 1',
                leaf: true
            }, {
                text: 'Menu Option 2',
                leaf: true
            }, {
                text: 'Menu Option 3',
                leaf: true
            }]
        })
    });
    tree.getRootNode().expand();
    */
    /*
       Image Gallery

    var xd = Ext.data;

    var store = new Ext.data.JsonStore({
        url: '/static/dummydata/image-gallery.js',
        root: 'images',
        fields: ['name', 'url', {name:'size', type: 'float'}, {name:'lastmod', type:'date', dateFormat:'timestamp'}]
    });
    store.load();

    var tpl = new Ext.XTemplate(
		'<tpl for=".">',
            '<div class="thumb-wrap" id="{name}">',
		    '<div class="thumb"><img src="{url}" title="{name}"></div>',
		    '<span class="x-editable">{shortName}</span></div>',
        '</tpl>',
        '<div class="x-clear"></div>'
	);

    var panel = new Ext.Panel({
        renderTo: 'gallery-terrain-list',
        id:'images-view',
        frame:true,
        width:810,
        autoHeight:true,
        layout:'fit',
        items: new Ext.DataView({
            store: store,
            tpl: tpl,
            autoHeight:true,
            loadMask: true,
            multiSelect: true,
            overClass:'x-view-over',
            itemSelector:'div.thumb-wrap',
            emptyText: 'No images to display',

            plugins: [
                new Ext.DataView.DragSelector(),
                new Ext.DataView.LabelEditor({dataIndex: 'name'})
            ],

            prepareData: function(data){
                data.shortName = Ext.util.Format.ellipsis(data.name, 15);
                data.sizeString = Ext.util.Format.fileSize(data.size);
                data.dateString = data.lastmod.format("m/d/Y g:i a");
                return data;
            },

            listeners: {
            	selectionchange: {
            		fn: function(dv,nodes){
            			var l = nodes.length;
            			var s = l != 1 ? 's' : '';
            			//panel.setTitle('Simple DataView ('+l+' item'+s+' selected)');
            		}
            	}
            }
        })
    });
    */
    controller = new Controller();
});
