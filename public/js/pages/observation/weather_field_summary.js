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
			    itemId:'map_overlay',
			    name:'map_overlay'
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
						html:'<p> This section allows you to specify the observation date and time, and its key location. Locations are limited to type Region, Operating Zone, and Forecast Zone.</p>'
					},
					//{
					//	fieldLabel: 'Date and time',
					//	name: 'date_time_start',
					//	xtype: 'datetimefield',
					//	dateFormat: 'Y-m-d',
					//	timeFormat: 'H:i',
					//	width: 200
					//},
                        {
                                            xtype: 'compositefield',
                                            msgTarget : 'side',
                                            height: 30,
                                            fieldLabel: 'Date Range',
                                            cls: 'composite-field',
                                            width: '100%',
                                            items: [
                                            //{
                                            //    xtype:'displayfield',
                                            //    cls: 'alignRight',
                                            //    value: 'Start',
                                            //    width: 60
                                            //}
                                            {
                                            name: 'date_time_start',
                                            xtype: 'datetimefield',
                                            dateFormat: 'Y-m-d',
                                            timeFormat: 'H:i',
                                            renderer: formatDate,
                                            width: 200
                                        }
                                        ,{
                                                xtype:'displayfield',
                                                cls: 'alignRight',
                                                value: 'End',
                                                width: 60
                                         }
                                         ,{
                                            name: 'date_time_end',
                                            xtype: 'datetimefield',
                                            dateFormat: 'Y-m-d',
                                            timeFormat: 'H:i',
                                            width: 200
                                        }]
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

//            // TODO Regular Add
            {   // Details Section
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
                    width: 60
                }
                ,{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Aspect',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Start',
                        width: 60
                }
                ,{
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
                }
                ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'End',
                        width: 60
                }
                ,{
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
                    },]
                }
                ,{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Incline',
                     cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Start',
                        width: 60
                    }
                    ,{
                        name:'incline_range_start',
                        width: 200,
                        xtype: 'numberfield'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'End',
                        width: 60
                    }
                    ,{
                        name:'incline_range_end',
                        width: 200,
                        xtype: 'numberfield'
                    }]
                }
                ,{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Elevation m (feet)',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Start',
                        width: 60
                    }
                    ,{
                        name:'elevation_min',
                        width: 200,
                        xtype: 'numberfield'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'End',
                        width: 60
                    }
                    ,{
                        name:'elevation_max',
                        width: 200,
                        xtype: 'numberfield'
                    }]
                }
                ,{
                    xtype:'combo',
                    fieldLabel: 'Sky conditions',
                    hiddenName:'sky_condition',
                    store: new Ext.data.JsonStore({
                        fields: [
                            {name: 'key'},
                            {name: 'code_value'}
                        ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams : {
                            lookup_code: 'skyconditons',
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
                    width: 265,
                    selectOnFocus:true
                },{
                    xtype: 'compositefield',
                    fieldLabel: 'Precipitation Type & Rate',
                    msgTarget : 'side',
                    height: 30,
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        hiddenName:'precipitation_type_rate',
                        width: 265,
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root: 'rows'
                            }, LookupVO),
                            autoLoad: true,
                            baseParams : {
                                lookup_code: 'precipitationtyperate',
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
                        cascadeComboId: 'precipitation_type_rate_minor'
                    },{
                        xtype:'combo',
                        hiddenName:'precipitation_type_rate_minor',
                        id: 'precipitation_type_rate_minor',
                        width: 265,
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
                }
                ,{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Air temperature &deg;C (&deg;F)',
                     cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Minimum',
                        width: 60
                    }
                    ,{
                        name:'air_temperature_min',
                        width: 105,
                        xtype: 'numberfield'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Maximum',
                        width: 60
                    }
                    ,{
                        name:'air_temperature_max',
                        width: 105,
                        xtype: 'numberfield'
                    }]
                }
                ,{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Field snow height mm (inch)',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'HN24',
                        width: 60
                    }
                    ,{
                        name:'hn24_accumulated',
                        xtype: 'numberfield',
                        width: 200
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'HST',
                        width: 60
                    }
                    ,{
                        name:'hst_accumulated',
                        xtype: 'numberfield',
                        width: 200
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'HS',
                        width: 60
                    }
                    ,{
                        name:'hs_accumulated',
                        xtype: 'numberfield',
                        width: 200
                    },]
                }
                ,{
                    xtype: 'compositefield',
                    fieldLabel: 'Surface form',
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
                         hiddenName:'surface_snow_form_minor',
                        id: 'surface_snow_form_minor',
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
                        cls: 'alignRight',
                        value: 'Size (mm)',
                        width: 60
                    },{
                        fieldLabel: 'Size',
                        name: 'surface_snow_size',
                        xtype: 'numberfield',
                        width: 80
                    },{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Rimed',
                        width: 60
                    },{
                        name: 'surface_snow_form_rimed',
                        xtype: 'checkbox'
                    }]
                },

                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Wind',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Direction',
                        width: 60
                    }
                    ,{
                        xtype:'combo',

                        hiddenName:'wind_direction_cat',
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
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Speed',
                        width: 60
                    }
                    ,{
                        xtype:'combo',

                        hiddenName:'wind_speed_cat',
                        width: 200,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
	                            lookup_code: "windspeedestimation" + ( isOperationSWAG ? "_swag" : "" ),
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
                    fieldLabel: 'Ridge blowing snow',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Transport',
                        width: 60
                    }
                    ,{
                        xtype:'combo',

                        hiddenName:'ridge_blowing_snow_transport',
                        width: 200,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'blowingsnow',
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
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Direction',
                        width: 60
                    }
                    ,{
                        xtype:'combo',
                        hiddenName:'ridge_blowing_snow_direction',
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
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width:530
                }

                ]
            }
        ]
    });
    // create the data store
    tableStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, WeatherVO),
        remoteSort: true,
        baseParams:{
            entity: 'Weather',
            type__ObservationType__lookup: 'weatherfieldsummary',
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
        cmpTitle: 'Event Photo Upload',
        entity: 'Weather',
        image_type: 'ow',
        cmpUploadMsg: 'Event Photo',
        hidden:true,
        storesReload: [
	    tableStore
	]
    });
    /*
        Oblique Photo section
    */
    obliqueForm = new Ext.FormPanel({
         hidden:true,
        form_url: "/observation/weather-field-summary/detailEdit//",
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
        form_url: "/observation/weather-field-summary/detailEdit//",
        defaults: {
            anchor: '0'
        },
        items: [{
            xtype:'fieldset',
            collapsible: false,
            width: '75%',
            itemId: 'mapContainer',
            title:'Map Overlay',
            hidden:true,
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
                                                        googleMap.get('mapContainer').get('map') );
                                                        //obliqueForm.get('photoContainer').get('photoEditor'));
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
                        entity: 'Weather',
                        form: 'pc.forms.observation.ObservationForm',
                        type: 'weatherfieldsummary__ObservationType__lookup'
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
                        if(btn === "yes"){
                            Ext.Ajax.request({
                                method: 'GET',
                                url: '/json/entity_delete/',
                                params:{
                                    key: records.data.key,
                                    entity: 'Weather'
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
                        var record = new WeatherVO({    operation: operation.key,
                                            operation_desc:operation.name,
                                            created_by: party.key,
                                            created_by_desc: party.name,
                                            observer: party.key,
                                            created_date: new Date(),
                                            date_time_start: new Date()});
                        operationTerrainUtil.reset();
                        operationTerrainUtil.setRecord(record);
                        fs.getForm().setValues( newRecordForForm(record));
                        operationTerrainUtil.loadLocation(record.data.operation);
                        fsContainer.show();
                        grid.hide();
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
            },
            {
                id       :'observer',
                header   : 'Observer',
                width    : 140,
                sortable : false,
                dataIndex: 'observer_desc'
            },
            {
                id       :'terrain',
                header   : 'Location',
                width    : 150,
                sortable : true,
                dataIndex: 'terrain_desc'
            },
            {
                id       :'notable',
                header   : 'Notable',
                width    : 68,
                sortable : false,
                dataIndex: 'notable'
            },
            {
                id       :'subject',
                header   : 'Description',
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
                                entity: 'Weather',
                                record: new WeatherVO(),
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
