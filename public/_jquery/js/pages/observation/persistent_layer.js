var layerForm, layerHistoryForm, grid,
statusStore, masterStore, fsContainer, controller, powdercloudHighChartsUtil;
function Controller(){
    this.store = masterStore;
    this.isNewPersistantLayer = false;
}
Controller.prototype.load = function(record){
    layerForm.getForm().loadRecord(record);
    this.loadDropdowns(record.data.operation);
    layerHistoryForm.form.getForm().clearInvalid();
    fsContainer.show();
    Ext.getCmp('historyCmp').show();
    Ext.getCmp('layerHistoryFieldsCmp').show();
    this.isNewPersistantLayer = false;
    grid.hide();
    layerHistoryForm.load(record);
};
Controller.prototype.loadDropdowns = function(operationId){
    Ext.StoreMgr.lookup("layerLocationStore").load({params: {operation: operationId}});
    Ext.StoreMgr.lookup("observerActive").load();
};
Controller.prototype.add = function(){
    this.isNewPersistantLayer = true;
    var record = new PersistentLayerVO({operation: operation.key,
                                        operation_desc:operation.name,
                                        created_by: party.key,
                                        created_by_desc: party.name,
					observer: party.key,
                                        date_time_start: new Date(),
                                        created_date: new Date(),
                                        burial_date: new Date()});

    layerForm.getForm().setValues( newRecordForForm(record));

    record = new PersistentLayerHistoryVO({created_by: party.key,
					  date_time_start: new Date(),
					  operation: operation.key,
                                        created_by_desc: party.name,
                                        created_date: new Date()});
    layerHistoryForm.load(record);
    Ext.getCmp('historyCmp').hide();
    Ext.getCmp('layerHistoryFieldsCmp').hide();
    layerHistoryForm.form.getForm().clearInvalid();
    fsContainer.show();
    grid.hide()
};
Controller.prototype.save = function(){
    if(layerHistoryForm.form.getForm().isValid()){
	var tmp = layerForm.getForm().getValues();
	layerForm.getForm().submit({
	    url:layerForm.form_url,
	    waitMsg:'Saving Data...',
	    params: layerForm.form_params,
	    submitEmptyText: false,
	    scope: this,
	    success: function(form, action) {
		var key = Ext.decode(action.response.responseText).key;
		var layerValues = layerForm.getForm().getValues();
		if(!this.isNewPersistantLayer){
		    layerHistoryForm.form.getForm().setValues({
			terrain: layerValues.terrain,
			persistent_layer: key
		    });
		}	else {
		    layerHistoryForm.form.getForm().setValues({
			persistent_layer: key,
			created_date: layerValues.burial_date,
			terrain: layerValues.terrain,
			date_time_start: layerValues.burial_date,
			observer: layerValues.observer
		    });
		}
		layerHistoryForm.form.getForm().submit({
		    url:layerHistoryForm.form.form_url,
		    waitMsg:'Saving Data...',
		    params: layerHistoryForm.form.form_params,
		    submitEmptyText: false,
		    scope:this,
		    success: function(form, action) {
			var key = Ext.decode(action.response.responseText).key;
			fsContainer.hide();
			record = new PersistentLayerHistoryVO({created_by: party.key,
					  date_time_start: new Date(),
                                        created_by_desc: party.name,
					operation: operation.key,
					terrain: layerForm.getForm().getValues().terrain,
                                        created_date: new Date()});
			layerHistoryForm.load(record);
			layerHistoryForm.form.getForm().clearInvalid();
			grid.show();
			masterStore.reload()
			Ext.getCmp('saveButton').enable();
		    },
		    failure: function(form, action){
			Ext.getCmp('saveButton').enable();
			formFailureFunction();
		    }
		});
	    },
	    failure: function(form, action){
		Ext.getCmp('saveButton').enable();
		formFailureFunction();
	    }
	});
    }	else {
	Ext.getCmp('saveButton').enable();
	formFailureFunction();
    }
};
Controller.prototype.saveLayerHistory = function(cmp){
    if(cmp.form.getForm().isValid()){
	Ext.getCmp('saveButton').disable();
	cmp.form.getForm().submit({
	    url:cmp.form.form_url,
	    waitMsg:'Saving Data...',
	    params: cmp.form.form_params,
	    submitEmptyText: false,
	    scope:this,
	    success: function(form, action) {
		var key = Ext.decode(action.response.responseText).key;
		cmp.store.reload();
		cmp.newRecord();
		Ext.getCmp('saveButton').enable();
	    },
	    failure: function(form, action){
		Ext.getCmp('saveButton').enable();
		formFailureFunction();
	    }

	});
    }
};


Ext.onReady(function(){
    Ext.QuickTips.init();
    /*
        CHARTS
    */
    powdercloudHighChartsUtil = new PowderCloudHighChartsUtil();
    /*
        LAYER HISTORY STORE
    */
    statusStore = new Ext.data.JsonStore({
        storeId: 'statusStore',
        fields: [
            {name: 'key'},
            {name: 'value'}
        ],
        autoLoad: true,
        root: 'rows',
        baseParams : {
            lookup_code: 'layerstatus',
            allowBlankRecord: true
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/lookup_query_all/'
        })
    })

    /*
        LAYER HISTORY FORM
    */
    layerHistoryForm = new LayerPanel({});
    /*
        LAYER FORM
    */
    layerForm = new Ext.FormPanel({
        form_url: "/json/entity_save/",
        form_params:{
            entity: 'PersistentLayer',
            form: 'pc.forms.observation.ObservationForm',
            type: 'persistentlayerevent__ObservationType__lookup'
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
            width: 160,
            anchor: '0'
        },
        items:[
            {
                xtype:'hidden',
                name:'key'
            },
	    {
                xtype:'hidden',
                name:'operation'
            },
	    {
                xtype:'hidden',
                name:'created_date'
            },
	    {
                xtype:'hidden',
                name:'created_by'
            },
	    {
                xtype:'hidden',
                name:'color'
            },
	    {
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Layer Initial Status',
                items: [
                {
		    xtype:'container',
		    html:'<p>The following section is used to provide the initial definition of the layer. These data should remain consistent and the below section should be used to upated the status.</p>'
		},
                { xtype: 'displayfield',
                    fieldLabel: 'Operation',
                    name: 'operation_desc',
                    width: 200
                },
		{
                    xtype: 'displayfield',
                    fieldLabel: 'Data Recorder',
                    name: 'created_by_desc',
                    width: 200
                },
		{
                    xtype:'combo',
                    fieldLabel: 'Observer',
                    hiddenName:'observer',
                    store: 'observerActive',
		    lastQuery: '',
                    valueField:'key',
                    displayField:'full_name',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true,
                    width: 200
                },
		{
                    fieldLabel: 'Date and time',
                    name: 'date_time_start',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    width : 200,
                    timeFormat: 'H:i'
                },
		{
                    xtype:'combo',
                    fieldLabel: 'Location',
                    hiddenName:'terrain',
                    store: new Ext.data.Store({
                        storeId: 'layerLocationStore',
                        reader: new Ext.data.JsonReader({
                            root: 'rows'
                        }, TerrainVO),
                        root: 'rows',
                        baseParams : {
                            entity: 'Terrain',
                            active: 'True',
			    det: 'k',
                            sort: 'name_nick',
                            dir: 'ASC',
                            allowBlankRecord: true,
			    feature_type__selfRef: 'Region,Forecast Zone'
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
                    selectOnFocus:true,
                    width: 200
                },
		{
                    fieldLabel: 'Burial date and time',
                    name: 'burial_date',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
                    width: 200
                },
		{
                    fieldLabel: 'Show',
                    name: 'show',
                    xtype: 'checkbox',
                    width: 100
                },
		{
                    fieldLabel: 'Nickname',
                    name: 'nickname_text',
                    xtype: 'textfield',
                    width: 200
                },
		{
                    fieldLabel: 'Color',
                    id:'colorPalette',
                    xtype: 'colorpalette',
                    listeners: {
                        select: function(cp, color){
                            layerForm.getForm().setValues({color: color});
                        }
                    }
                },
		{
                    xtype: 'compositefield',
                    fieldLabel: 'Grain Form',
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
                        displayField:'value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true,
                        cascadeComboId: 'surface_snow_form_minor'
                    },
		    {
                        xtype:'combo',
                         hiddenName:'surface_snow_form_minor',
                        id: 'surface_snow_form_minor',
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                            }, LookupVO)
                        }),
                        valueField:'key',
                        displayField:'value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true,
                        width: 265
                    },
		    {
                        xtype:'displayfield',
                        value: 'Size',
                        width: 60
                    },
		    {
                        fieldLabel: 'Size',
                        name: 'surface_snow_size',
                        xtype: 'numberfield',
                        width: 80
                    },
		    {
                        xtype:'displayfield',
                        value: 'Rimed',
                        width: 60
                    },
		    {
                        name: 'surface_snow_form_rimed',
                        xtype: 'checkbox'
                    }]
                },
		{
                    xtype: 'compositefield',
                    fieldLabel: 'Grain Form 2',
                    msgTarget : 'side',
                    height: 30,
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        //fieldLabel: 'Surface snow form',
                        hiddenName:'surface_snow_form_2',
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
                        displayField:'value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true,
                        cascadeComboId: 'surface_snow_form_2_minor'
                    },
		    {
                        xtype:'combo',
                        hiddenName:'surface_snow_form_2_minor',
                        id: 'surface_snow_form_2_minor',
                        width: 265,
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                            }, LookupVO)
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
                        value: 'Size',
                        width: 60
                    },
		    {
                       name: 'surface_snow_size_2',
                        xtype: 'numberfield',
                        width: 80
                    },
		    {
                        xtype:'displayfield',
                        value: 'Rimed',
                        width: 60
                    },
		    {
                        name: 'surface_snow_form_rimed_2',
                        xtype: 'checkbox'
                }]
                }]
            }
        ]
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
        border: false,
        defaults:{
            plain: true,
            border: false,
            width   : '100%',
            bodyStyle: 'padding: 5px'
        },
        items:[
            layerForm,
            layerHistoryForm

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
            text: 'Cancel',
            handler: function(){
                fsContainer.hide();
                grid.show();
            }
        }]
    });
    /*
        LAYERS STORE
    */
    // create the data store
    masterStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, PersistentLayerVO),
        remoteSort: true,
        autoLoad: true,
        baseParams:{
            entity: 'PersistentLayer',
            operation: operation.key,
            type__ObservationType__lookup: 'persistentlayerevent',
            start:0,
            limit:PAGING_LIMIT
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/entity_query_all_paging/'
        })
    });
    /*
        LAYERS TABLE
    */
    // Create RowActions Plugin
    var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {history_comments_internal}</p>'
        )
    });
    var action = new Ext.ux.grid.RowActions({
        header:'',
        width: 80,
        keepSelection:true,
        actions:[{
               iconCls:'ui-icon ui-icon-wrench',
               tooltip:'Edit',
               callback:function(grid, records, action) {
                    controller.load(records);
               }
       },
       {
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
                                    entity: 'PersistentLayer'
                                },
                                success: function(action, options){
                                    masterStore.reload();
                                    deleteFunciton(action, options);
                                }
                            });
                        }
                    }, this);
               }
       }
       ]
    });
    // create the Grid
    grid = new Ext.grid.GridPanel({
        renderTo:'table-loc',
        store: masterStore,
        enableRowBody: true,
        loadMask: true,
        plugins:[action, expander],
        tbar: new Ext.Toolbar({
            items: ['->',{
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
                id       :'location',
                header   : 'Location',
                width    : 150,
                sortable : true,
                dataIndex: 'terrain_desc'
            },
	    {
                header   : 'Show',
                width    : 60,
                sortable : true,
                dataIndex: 'show'
            },
	    {
                header   : 'Last Updated',
                width    : 100,
                sortable : true,
                dataIndex: 'history_date_time_start',
                renderer: formatDate
            },
	    {
                header   : 'Depth',
                width    : 85,
                sortable : false,
                dataIndex: 'history_typical_depth'
            },
	    {
                header   : 'Status',
                width    : 115,
                sortable : false,
                dataIndex: 'history_status_desc'
            }
        ],
        stripeRows: true,
        height: 400,
        width: '100%',
        view: new Ext.grid.GridView({
            enableRowBody: true
        }),
        // paging bar on the bottom
        bbar: new Ext.PagingToolbar({
            pageSize:PAGING_LIMIT,
            store: masterStore,
            displayInfo: true,
            displayMsg: 'Displaying records {0} - {1} of {2}',
            emptyMsg: "No records to display"
        })
    });
    grid.getView().getRowClass = function(record, index, rowParams ){
        rowParams.bodyStyle = 'color:#'+record.data.color+';';
        rowParams.tstyle = rowParams.tstyle+'color:#'+record.data.color+';';
        var i = 0;
        //$("#"+rowDiv.getId()).css({'background-color':'#'+this.record.data.color});

        //var selector = '#'+this.getId()+' .x-panel-header-text';
        //$('#'+this.getId()+' .x-panel-header').css({'background-color':'#'+this.record.data.color});
        //$('#'+this.getId()+' .x-panel-header').css({'background-image':'none'});

        //return (record.data.color<0.7 ? (record.data.change<0.5 ? (record.data.change<0.2 ? 'red-row' : 'green-row') : 'blue-row') : '');
    };

    controller = new Controller();
    controller.loadDropdowns(operation.key);
    /*
        LinkUtil
    */
    var linkUtil = new LinkUtil({form: layerForm,
                                entity: 'PersistentLayer',
                                record: new PersistentLayerVO(),
                                fn: function(records){
                                    records.data.children = persistentLayerHistoryStoreConvert(null, records.data);
                                    controller.load(records);
                                }
    });
});

LayerHistoryForm = Ext.extend(Ext.FormPanel, {
    form_url: "/json/entity_save/",
    form_params:{
        entity: 'PersistentLayerHistory',
        form: 'pc.forms.observation.ObservationForm',
        type: 'persistentlayerhistory__ObservationType__lookup'
    },
    autoHeight: true,
    waitMsgTarget: true,
    reader : new Ext.data.XmlReader({
        record : 'record',
        success: 'success'
    }, [
        {name: 'operation'}
    ]),
    errorReader: new Ext.form.JSONErrorReader(),
    initComponent: function() {
        this.tpl = new Ext.Template(this.tplMarkup);
        Ext.apply(this, {
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
                    name:'operation'
                },
		{
                    xtype:'hidden',
                    name:'terrain'
                },
		{
                    xtype:'hidden',
                    name:'persistent_layer'
                },
		{
                    xtype:'hidden',
                    name:'created_by'
                },
		{
                    xtype:'hidden',
                    name:'created_date'
                },

               {
		    xtype:'container',
                    width: '100%',
		    html:'<p>The following section is used to update the current status of the layer. This includes the observer that provided the updated data, the date of update and its new status and depth.</p>'
		},
		{
		    xtype:'fieldset',
		    collapsable: false,
		    id:'layerHistoryFieldsCmp',
		    autoHeight: true,
		    autoWidth: true,
		    padding: 0,
		    labelWidth: 140,
		    cls: 'no-style-fieldset',
		    items:[
				{
				    xtype:'combo',
					fieldLabel: 'Observer',
					hiddenName:'observer',
					store: 'observerActive',
					lastQuery: '',
					valueField:'key',
					displayField:'full_name',
					editable: false,
					triggerAction: 'all',
					mode: 'local',
					selectOnFocus:true,
					width: 200
				},
				{
				    fieldLabel: 'Date and time',
				    name: 'date_time_start',
				    xtype: 'datetimefield',
				    dateFormat: 'Y-m-d',
				    width : 200,
				    timeFormat: 'H:i'
				}
			    ]
		},
                {
                    xtype:'combo',
                    fieldLabel: 'Status',
		    allowBlank: false,
                    hiddenName:'status',
                    width: 200,
                    store: 'statusStore',
                    valueField:'key',
                    displayField:'value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true
                },
                {
                    fieldLabel: 'Depth',
		    allowBlank: false,
                    name: 'typical_depth',
                    xtype: 'numberfield',
                    width: 200
                },
		{
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 400
                }
            ]
        });
        LayerHistoryForm.superclass.initComponent.call(this);
    }
});

LayerPanel = Ext.extend(Ext.Panel, {
    anchor: '100%',
    layout: 'fit',
    forceLayout: true,
    plain: true,
    initComponent: function () {
        this.form = new LayerHistoryForm({
            border: false
        });
        this.form.enableBubble('save');
        this.enableBubble('save');
        this.chartDepthContainer = new Ext.Container({
            id:this.getId()+'-chart',
            width: 900,
            height: 300,
            html: '<div style="float:left;width:50%; height:300px;" id="'+this.getId()+'-chartDepth'+'"></div><div style="float:right;width:50%;height:300px;" id="'+this.getId()+'-chartDual'+'"></div>',
            listeners:{
                afterrender:{
                    scope:this,
                    fn:this.onAfterRenderChartDepthContainer
                }
            }
        });
        this.chartDepthContainer.doLayout();

        this.store = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, PersistentLayerHistoryVO),
            remoteSort: true,
            baseParams:{
                entity: 'PersistentLayerHistory',
		type__ObservationType__lookup: 'persistentlayerhistory'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            }),
            listeners:{
                load:{
                    scope:this,
                    fn:this.onStoreLoad
                }
            }
        });
        this.grid = new Ext.grid.GridPanel({
            store: this.store,
            loadMask: true,
            columns: [
                 {
                    header   : 'Status',
                    width    : 120,
                    sortable : true,
                    dataIndex: 'status_desc'
                },
		{
                    header   : 'Date',
                    width    : 140,
                    sortable : true,
                    dataIndex: 'date_time_start',
                    renderer: formatDate
                },
		{
                    header   : 'Depth',
                    width    : 100,
                    sortable : true,
                    dataIndex: 'typical_depth'
                },
		{
                    header   : 'Comments',
                    width    : 560,
                    sortable : false,
                    dataIndex: 'comments_internal'
                }
            ],
            stripeRows: true,
            autoHeight: true,
            width: '100%'
        });


        Ext.applyIf(this, {
	    items: [
                this.form,
            {
                xtype:'fieldset',
                collapsible: true,
                collapsed: true,
                autoHeight: true,
                width: '90%',
                id: 'historyCmp',
                title:'History',
                items: [
                {
		    xtype:'container',
		    html:'<p>The following charts display historical trends for the current layer. These charts provide both the depth of layer and status over the entire time period of this layer.</p>'
		},

                    this.chartDepthContainer,
                    this.grid
                ],
                listeners:{
                    expand:{
                        scope: this,
                        fn: this.redrawCharts
                    }
                }
            }]
	});
	// call the superclass's initComponent implementation
        LayerPanel.superclass.initComponent.call(this);
    },
    onAfterRenderChartDepthContainer: function(){
        this.chartDual = new Highcharts.Chart({
            chart: {
                    renderTo: this.getId()+'-chartDual',
		    width: 450
            },
            exporting: {
                enabled: false
            },
            title: {
                    text: 'Status',
                    style: {
                        color: powdercloudHighChartsUtil.getTextColor()
                    }
            },
            xAxis:{
                    id: 'xAxis',
                    type: 'datetime',
                    dateTimeLabelFormats: {
                            day: '%b %e'
                    },
                    title: {
                            text: null
                    },
                    labels: {
                        style: {
                            color: powdercloudHighChartsUtil.getTextColor()
                        }
                    },
                    max: new Date(),
                    min: new Date(),
                    plotBands: [
                            {
                                    from: new Date(),
                                    to:   new Date(),
                                    color: 'rgba(68, 170, 213, .1)',
                                    events: {
                                            click: function(e) {
                                                    hs.htmlExpand(null, {
                                                            pageOrigin: {
                                                                    x: e.pageX,
                                                                    y: e.pageY
                                                            },
                                                            headingText: 'Today',
                                                            maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', plotBand_today_date),
                                                            width: 200
                                                    });
                                            }
                                    }
                            }
                    ]


            },
            yAxis: [{
                // Primary y-axis
                title: {
                    text: 'Status',
                    style: {
                        color: powdercloudHighChartsUtil.getTextColor()
                    }
                },
                labels:{enabled:false},
                    min: 0,
		    max: 12,
		    startOnTick: false,
                    minorGridLineWidth: 0,
                    gridLineWidth: 0,
                    alternateGridColor: null,
                    plotBands: [{
                            from: 0.5,
                            to: 1.5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'Developing',
                               style: {
				    color: powdercloudHighChartsUtil.getTextColor()
				}
                            }
                    }, {
                            from: 1.5,
                            to: 3.0,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'Active',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 3.0,
                            to: 4.5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'Lingering',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 4.5,
                            to: 7.5,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'Dormant',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 7.5,
                            to: 10.5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'Inactive',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 10.5,
                            to: 12.0,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'Bonded',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }]
            }

            ],
            tooltip: {
                    shared: true,
                    crosshairs: true
            },
            credits: {
                    enabled: false
            },
            plotOptions: {
                    series: {
                            step: true,
                            cursor: 'pointer',
                            marker: {
                                    lineWidth: 1
                            }
                    }
            },
            legend: {
                    enabled: false
            },
            series: [{
                id: 'statusSeries',
                name: 'Status',
                color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                data: [
                ]
                }
            ]
        });

        this.chartDepth = new Highcharts.Chart({
            chart: {
                    renderTo: this.getId()+'-chartDepth',
                    defaultSeriesType: 'line',
                    marginLeft: 75,
                    marginBottom: 50,
		    width: 450
            },
            exporting: {
                enabled: false
            },
            title: {
                    text: 'Depth of Layer'
            },
            xAxis: {
                    id: 'xAxis',
                    type: 'datetime',
                    dateTimeLabelFormats: {
                            day: '%b %e'
                    },
                    title: {
                            text: null
                    },
                    max: new Date(),
                    min: new Date()
            },
            yAxis: {
                    title: {
                            text: 'Depth of Layer'
                    },
                    min: 0
            },
            tooltip: {
                    shared: false,
                    crosshairs: true
                    /*
                    ,
                    formatter: function() {
                            return 'The value for <b>'+ this.x + '</b> is <b>'+ this.y +'</b>';
                    }
                    */
            },
            credits: {
                    enabled: false,
                    text: chartConfig.creditsText,
                    href: chartConfig.creditsHref,
                    style: chartConfig.creditsStyle
            },
            plotOptions: {
                    series: {
                            cursor: 'pointer',
                            point: {
                                    events: {
                                            click: function(e) {
                                                    hs.htmlExpand(null, {
                                                            pageOrigin: {
                                                                    x: e.pageX,
                                                                    y: e.pageY
                                                            },
                                                            headingText: this.series.name,
                                                            maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
                                                                    this.y + ' cm' + '<br/><a href="#">View Observation</a>',
                                                            width: 200
                                                    });
                                            }
                                    }
                            },
                            marker: {
                                    lineWidth: 1
                            }
                    }
            },
            legend: {
                    enabled: false
            },
            series: [{
                    id: 'depthSeries',
                    name: 'Depth',
                    data: []
            }]
        });
    },

    onStoreLoad: function(store, records, options){
        if(records === undefined){
            if(this.record !== undefined && this.record.data !== undefined && this.record.data.children !== undefined){
                var temp = [];
                this.store.removeAll();
                Ext.each(this.record.data.children.data.items, function(item){
                    this.store.insert(0 , item);
                }, this);
                this.store.commitChanges();

                this.chart_data = [];
                this.chart_data_dual = [];
                var maxDate = null;
                var minDate = null;
                this.store.each(function (item, index){
                    var date = item.data.date_time_start;
                    if(minDate == null){
                        minDate = date;
                    }   else if(minDate.getTime() - date.getTime() > 0){
                        minDate = date;
                    }
                    if(maxDate == null){
                        maxDate = date;
                    }   else if(maxDate.getTime() - date.getTime() < 0){
                        maxDate = date;
                    }
                    this.chart_data.push([date.getTime(), item.data.typical_depth]);

                    if (item.data.status_code) {
                            var iconValue = null;
                            var yValue = null;
                            switch(item.data.status_code)
                            {
                                    case "D":
                                            iconValue = "obscured.gif";
                                            yValue = 1;
                                            break;
                                    case "A":
                                            iconValue = "overcast.gif";
                                            yValue = 2;
                                            break;
                                    case "L":
                                            iconValue = "broken.gif";
                                            yValue = 4;
                                            break;
                                    case "O":
                                            iconValue = "scattered.gif";
                                            yValue = 6;
                                            break;
                                    case "I":
                                            iconValue = "few.gif";
                                            yValue = 8;
                                            break;
                                    case "B":
                                            iconValue = "clear.gif";
                                            yValue = 12;
                                            break;
                            }
                            if (iconValue != null && yValue != null) {
                                    this.chart_data_dual.push({
                                            //marker: {symbol: 'url(/static/client/hc/graphics/' + iconValue + ')'},
                                            x: date.getTime(),
                                            y: yValue
                                    });
                            }
                    }
                }, this);
                var half_day = 12*60*60*10*10*10;
                this.minDate = minDate.getTime() - half_day;
                this.maxDate = maxDate.getTime() + half_day;
		this.redrawCharts();
            }
        }
    },
    redrawCharts: function(){

	if (this.chartDepth.get('xAxis')) {
            this.chartDepth.get('xAxis').setExtremes(this.minDate, this.maxDate);
        }
        if (this.chartDepth.get('depthSeries')) {
            this.chartDepth.get('depthSeries').setData(this.chart_data, false);
        }

        if (this.chartDual.get('xAxis')) {
            this.chartDual.get('xAxis').setExtremes(this.minDate, this.maxDate);
        }
        if (this.chartDual.get('statusSeries')) {
            this.chartDual.get('statusSeries').setData(this.chart_data_dual, false);
        }
	this.chartDual.redraw();
	this.chartDepth.redraw();

    },
    newRecord: function(){
        var temp = new PersistentLayerHistoryVO({persistent_layer: this.record.data.key,
                                        created_by: party.key,
                                        created_by_desc: party.name,
					operation: operation.key,
					terrain: layerForm.getForm().getValues().terrain,
                                        created_date: new Date(),
					date_time_start: new Date()});
        this.form.getForm().setValues( newRecordForForm(temp));
    },
    load: function(layerRecord){
        this.record = layerRecord;
        this.store.setBaseParam('persistent_layer',this.record.data.key);
        this.onStoreLoad();
        this.setTitle(layerRecord.data.nickname_text);
        this.newRecord();
    }
});
