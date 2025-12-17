var fs, grid, tableStore, photoForm, fsContainer, powdercloudSvgSnowprofile,
testsContainer, testsEditableGrid,
tempContainer, tempEditableGrid,
layerContainer, layerForm,
profileDirection, googleMap, operationTerrainUtil,
chartController, controller;

var snowprofileSvgWidth = 966;
var snowprofileSvgHeight = 600;

function Controller(){
    this.profile = Ext.getCmp('key');
    this.tableSaveCounter = 0;
    this.isSaveForm = false;

    Ext.StoreMgr.lookup('persistantLayerStore').load();
    chartController.regStore(tempEditableGrid.getStore());
    chartController.regStore(testsEditableGrid.getStore());
    chartController.regStore(layerForm.store);
}

Controller.prototype.continueForm = function() {
    if (!fs.getForm().isValid()) {
        return;
    }

    profileDirection = "ASC";
    Ext.StoreMgr.lookup("profileType").each(function(item){
	if(item.data.key == Ext.getCmp('snow_profile_test_typeCombo').getValue()){
	    if(item.data.value == 'Full'){
		profileDirection = "DESC";
	    }
	}
    }, this);
    Ext.getCmp('snow_profile_test_typeCombo').setReadOnly(true);
    Ext.getCmp('continueFormButton').hide();

    // Unhide layer stuff
    Ext.getCmp('chartFieldset').show();
    layerContainer.show();
    tempContainer.show();
    testsContainer.show();
    this.loadTables();
}

Controller.prototype.load = function(record){
    operationTerrainUtil.reset();
    operationTerrainUtil.setRecord(record);
    operationTerrainUtil.loadLocation(record.data.operation);
    this.record = record;
    profileDirection = "ASC";
    if(this.record != null && this.record.data.snow_profile_test_type_code == 'Full'){
	profileDirection = "DESC";
    }
    // Hide contineu button
    Ext.getCmp('continueFormButton').hide();
    Ext.getCmp('snow_profile_test_typeCombo').setReadOnly(true);

    // Unhide layer stuff
    Ext.getCmp('chartFieldset').show();
    layerContainer.show();
    tempContainer.show();
    testsContainer.show();

    fs.getForm().loadRecord(record);
    Ext.getCmp('tempEditableGridSaveButton').show();
    Ext.getCmp('testsEditableGridSaveButton').show();
    Ext.getCmp('layerEditableGridSaveButton').show();
    photoForm.setRecord(record);
    fsContainer.show();
    chartController.initialRenderSnowProfileSvgChart();
    grid.hide();
    this.loadDropdowns(record.data.operation);
    this.loadTables();
}

Controller.prototype.save = function(){
    operationTerrainUtil.saveChanges();
    // Form Validation
    if(!layerForm.validate()){
	Ext.MessageBox.show({
            title: 'Validation',
            msg: 'There are outstanding validation errors in the Layers table.',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARN,
            scope: this
        });
	Ext.getCmp('saveButton').enable();
        return;
    }
    if (!fs.getForm().isValid()) {
        Ext.MessageBox.show({
            title: 'Validation',
            msg: 'There are outstanding validation errors.',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARN,
            scope: this
        });
	Ext.getCmp('saveButton').enable();
        return;
    }

    // Form Submit
    fs.getForm().submit({
        url:fs.form_url,
        params:fs.form_params,
        waitMsg:'Saving Data...',
        submitEmptyText: false,
        scope: this,
        success: function(form, action) {
            var key = Ext.decode(action.response.responseText).key;
            fs.getForm().setValues({key: key});
            this.isSaveForm = true;
            this.tableSaveCounter = 0;
            this.saveTables();
        },
	failure: function(form, action){
	    Ext.getCmp('saveButton').enable();
	    formFailureFunction();
	}
    });
}

Controller.prototype.add = function(){
    fsContainer.show();
    Ext.getCmp('snow_profile_test_typeCombo').setReadOnly(false);
    chartController.initialRenderSnowProfileSvgChart();
    grid.hide();
    var record = new ProfileVO({        created_by: party.key,
                                        created_by_desc: party.name,
                                        created_date: new Date(),
                                        date_time_start: new Date(),
					observer: party.key,
                                        operation: operation.key,
                                        operation_desc:operation.name });
    operationTerrainUtil.reset();
    operationTerrainUtil.setRecord(record);
    fs.getForm().setValues( newRecordForForm(record));
    operationTerrainUtil.loadLocation(record.data.operation);
    this.loadDropdowns(record.data.operation);
    this.clearTables();
    this.loadTables();
    Ext.getCmp('tempEditableGridSaveButton').hide();
    Ext.getCmp('testsEditableGridSaveButton').hide();
    Ext.getCmp('layerEditableGridSaveButton').hide();

    // Unide continue button
    Ext.getCmp('continueFormButton').show();

    // Hide layer stuff
    Ext.getCmp('chartFieldset').hide();
    layerContainer.hide();
    tempContainer.hide();
    testsContainer.hide();
}

Controller.prototype.loadDropdowns = function(operationId){
    Ext.StoreMgr.lookup("quickAddLocationStore").load({params: {operation: operationId}});
    Ext.StoreMgr.lookup("observerActive").load();
};

Controller.prototype.loadTables = function(){
    if(this.profile.getValue() != null && this.profile.getValue() != ""){
	tempEditableGrid.getStore().setBaseParam('sort','height');
        testsEditableGrid.getStore().setBaseParam('sort','height');
        layerForm.store.setBaseParam('sort','start');
	tempEditableGrid.getStore().setBaseParam('dir',profileDirection);
        testsEditableGrid.getStore().setBaseParam('dir',profileDirection);
        layerForm.store.setBaseParam('dir',profileDirection);

        tempEditableGrid.getStore().setBaseParam('profile',this.profile.getValue());
        testsEditableGrid.getStore().setBaseParam('profile',this.profile.getValue());
        layerForm.store.setBaseParam('profile',this.profile.getValue());

        tempEditableGrid.getStore().load();
        testsEditableGrid.getStore().load();
        layerForm.loadMask = new Ext.LoadMask(layerForm.body, {
            msg:'Loading...'
        });
        layerForm.loadMask.show();
        layerForm.store.load();
    } else {
        layerForm.loadMask = new Ext.LoadMask(layerForm.body, {
            msg:'Loading...'
        });
        layerForm.loadMask.show();
        layerForm.onStoreLoad();
    }
}

Controller.prototype.clearTables = function(){
    layerForm.store.removeAll();
    tempEditableGrid.getStore().removeAll();
    testsEditableGrid.getStore().removeAll();
}

Controller.prototype.saveTables = function(){
    this.tableSaveCounter = this.tableSaveCounter + tempEditableGrid.getStore().getCount();
    this.tableSaveCounter = this.tableSaveCounter + testsEditableGrid.getStore().getCount();
    var records = layerForm.save();
    this.tableSaveCounter = this.tableSaveCounter + records.length;

    this.saveTableRows(testsEditableGrid);
    this.saveTableRows(tempEditableGrid);
    this.saveLayerRows(records);
};

Controller.prototype.saveTablesContinue = function(){
    if(this.tableSaveCounter == 0){
        if(this.isSaveForm){
            // photo
            photoForm.savePhoto(this.profile.getValue());
            fsContainer.hide();
            grid.show();
            tableStore.reload()
            this.isSaveForm = false;
        }
		else {
            layerForm.loadMask.hide();
            layerForm.loadMask = new Ext.LoadMask(layerForm.body, {
                msg:'Loading...',
                store: layerForm.store
            });
            layerForm.loadMask.show();
            testsEditableGrid.getStore().reload();
            tempEditableGrid.getStore().reload();
            layerForm.store.reload();
        }
	Ext.getCmp('saveButton').enable();
    }
};

Controller.prototype.saveLayerRows = function(records){
    if(records == null || records.length == 0) {
	this.saveTablesContinue();
	return;
    }
    layerForm.loadMask = new Ext.LoadMask(layerForm.body, {
        msg:'Saving...'
    });

    layerForm.loadMask.show();
    Ext.each(records, function(record){
        //set values
        if(record.get('profile') == null || record.get('profile') == ""){
            record.set('profile',this.profile.getValue());
        }
	layerForm.form_params.terrain = fs.getForm().getValues().terrain;
	layerForm.form_params.date_time_start = fs.getForm().getValues().date_time_start;
	Ext.Ajax.request({
	    url: layerForm.form_url,
	    extraParams: layerForm.form_params,
	    params: Ext.apply(ServerUtils.prepareFieldsForService(record), layerForm.form_params),
	    scope: this,
	    success: function(response, opts){
		//var key = Ext.decode(response.responseText).key;
		this.tableSaveCounter = this.tableSaveCounter - 1;
		this.saveTablesContinue();
	    }
	});
    }, this);
};

Controller.prototype.saveTableRows = function(table){
    var currGrid = table;
    var currStore = table.getStore();
    currStore.each( function (record){
        if(record){
            //set values
            if(record.get('profile') == null || record.get('profile') == ""){
                record.set('profile',this.profile.getValue());
            }
            if(record.get('operation') == null || record.get('operation') == ""){
                record.set('operation',operation.key);
            }
	    currGrid.form_params.terrain = fs.getForm().getValues().terrain;
	    currGrid.form_params.date_time_start = fs.getForm().getValues().date_time_start;
	    
	    currGrid.form_params.aspect_start = fs.getForm().getValues().aspect_start;
	    currGrid.form_params.incline_range_start = fs.getForm().getValues().incline_range_start;
	    currGrid.form_params.elevation_min = fs.getForm().getValues().elevation_min;
            Ext.Ajax.request({
                url: currGrid.form_url,
                extraParams: currGrid.form_params,
                params: Ext.apply(ServerUtils.prepareFieldsForService(record), currGrid.form_params),
                scope: this,
                success: function(response, opts){
                    var key = Ext.decode(response.responseText).key;
                    this.tableSaveCounter = this.tableSaveCounter - 1;
                    this.saveTablesContinue();
                }
            });
        }   else{
            this.tableSaveCounter = this.tableSaveCounter - 1;
            this.saveTablesContinue();
        }
    }, this);
};

Ext.onReady(function(){
    Ext.QuickTips.init();
    chartController = new ChartController();
    /*
        Stores
    */
    new Ext.data.JsonStore({
        storeId: 'aspectStore',
        fields: [
            {name: 'key'},
            {name: 'value'}
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
    })

    /*
        FORM
    */
    fs = new Ext.FormPanel({
        form_url: "/json/entity_save/",
        form_params:{
            entity: 'Profile',
            form: 'pc.forms.observation.ObservationForm',
            type: 'snowprofileindustrial__ObservationType__lookup'  //TODO Why does this save the third one on save.
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
			itemId:'key',
			id: 'key',
			name:'key'
		    },
		    {
			xtype:'hidden',
			itemId:'operation',
			id: 'operation',
			name:'operation'
		    },
		    {
			xtype:'hidden',
			id:'map_overlay',
			itemId:'map_overlay',
			name:'map_overlay'
		    },
		    {
			xtype:'hidden',
			name:'created_date'
		    },
		    {
			xtype:'hidden',
			itemId:'created_by',
			id: 'created_by',
			name:'created_by'
		    },

		    // Operation Section
		    {
			xtype:'fieldset',
			collapsible: true,
			collapsed: false,
			width: '75%',
			title:'Operational Header',
			items: [
					{
					    xtype:'container',
					    html:'<p>This section allows you, the user, to enter and record basic operational data. If the event is unique, the user is recommmeded to mark it as notable.</p>'
					},
					{
					    xtype: 'displayfield',
					    fieldLabel: 'Operation Details',
					    id:'operation_desc',
					    width: 200
					},
					{
					    xtype:'quickaddlocation',
					    listeners:{
						scope: this,
						select: function(e){

						    googleMap.get('mapContainer').get('map').setMapData(e.record.data.map_overlay, Ext.getCmp('map_overlay').getValue());
						    if(e.cmp.prevLocation == undefined || e.cmp.prevLocation.data.key != e.record.data.key){
							e.cmp.prevLocation = e.record;
							//googleMap.get('mapContainer').get('map').setMapData(e.cmp.prevLocation.data.map_overlay, Ext.getCmp('map_overlay').getValue());


						    }
						}
					    }
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
					    xtype:'combo',
					    fieldLabel: 'Observer 2',
					    hiddenName:'observer_2',
					    id: 'observer_2Combo',
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
					    fieldLabel: 'Date and time',
					    name: 'date_time_start',
					    xtype: 'datetimefield',
					    dateFormat: 'Y-m-d',
					    timeFormat: 'H:i',
					    width: 200
					},
					{
					    fieldLabel: 'Notable',
					    name: 'notable',
					    xtype: 'checkbox',
					    width: 40
					},
					{
					    fieldLabel: 'Subject',
					    name: 'subject',
					    xtype: 'textfield',
					    width: 405
					},
					{
					    fieldLabel: 'Notes',
					    name: 'comments_internal',
					    xtype: 'textarea',
					    width: 600
					}
				    ]
		    },


            // Snow Profile Meta-data Section
            {
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Details',
                items: [
				{
				    xtype:'container',
				    html:'<p>This section allows you, the user, to enter and record basic profile details. Additional details (for example, layers) are entered below.</p>'
				},
				{
				    xtype:'combo',
				    fieldLabel: 'Profile type',
				    hiddenName:'snow_profile_test_type',
				    id:'snow_profile_test_typeCombo',
				    width: 265,
				    store: new Ext.data.JsonStore({
					storeId: 'profileType',
					fields: [
					    {name: 'key'},
					    {name: 'value'}
					],
					autoLoad: true,
					root: 'rows',
					baseParams : {
					    lookup_code: 'snowprofiletype',
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
				    allowBlank: false,
				    required: true
				},
				{
				    xtype: 'compositefield',
				    msgTarget : 'side',
				    height: 30,
				    fieldLabel: 'Site',
				    cls: 'composite-field',
				    width: '100%',
				    items: [{
					xtype:'displayfield',
					value: 'Aspect',
					width: 60
				    }, {
					xtype:'combo',

					hiddenName:'aspect_start',
					id: 'aspect_startCombo',
					width: 200,
					store: 'aspectStore',
					valueField:'key',
					displayField:'value',
					editable: false,
					triggerAction: 'all',
					mode: 'local',
					selectOnFocus:true
				    },
				    {
					xtype:'displayfield',
					value: 'Incline',
					width: 60
				    },
				    {
					name:'incline_range_start',
					width: 200,
					 xtype: 'numberfield'
				    },
				    {
					xtype:'displayfield',
					value: 'Elev. m (feet)',
					width: 60
				    },
				    {
					name:'elevation_min',
					width: 200,
					xtype: 'numberfield'
				    }]
				},
				{
				    xtype:'combo',
				    fieldLabel: 'Sky conditions',
				    hiddenName:'sky_condition',
				    id: 'sky_conditionCombo',
				    store: new Ext.data.JsonStore(
				    {
					fields: [
					    {name: 'key'},
					    {name: 'value'}
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
				    displayField:'value',
				    editable: false,
				    triggerAction: 'all',
				    mode: 'local',
				    width: 265,
				    listWidth: 400,
				    selectOnFocus:true
				},
				{
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
					cascadeComboId: 'precipitation_type_rate_minorCombo'
				    },
				    {
					xtype:'combo',
					hiddenName:'precipitation_type_rate_minor',
					id: 'precipitation_type_rate_minorCombo',
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
				},
				{
				    xtype: 'compositefield',
				    msgTarget : 'side',
				    height: 30,
				    fieldLabel: 'Wind',
				    cls: 'composite-field',
				    width: '100%',
				    items: [{
					xtype:'displayfield',
					value: 'Speed',
					width: 60
				    },{
					xtype:'combo',
					hiddenName:'wind_speed_cat',
					id:'wind_speed_catCombo',
					width: 200,
					store: new Ext.data.JsonStore({
					    fields: [
						{name: 'key'},
						{name: 'value'}
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
					displayField:'value',
					editable: false,
					triggerAction: 'all',
					mode: 'local',
					selectOnFocus:true
				    },
				    {
					xtype:'displayfield',
					value: 'Direction',
					width: 60
				    },
				    {
					xtype:'combo',
					hiddenName:'wind_direction_cat',
					id:'wind_direction_catCombo',
					width: 200,
					store: 'aspectStore',
					valueField:'key',
					displayField:'value',
					editable: false,
					triggerAction: 'all',
					mode: 'local',
					selectOnFocus:true
				    }]
				},
				{
				    fieldLabel: 'Air Temperature',
				    name: 'air_temperature_present',
				    id: 'air_temperature_present',
				    xtype: 'numberfield',
				    width: 100
				},
				{
				    fieldLabel: 'Snow Temperature TO',
				    name: 'snow_temperature_T_0',
				    id: 'snow_temperature_T_0',
				    xtype: 'numberfield',
				    width: 100
				},
				{
				    xtype: 'compositefield',
				    msgTarget : 'side',
				    height: 30,
				    fieldLabel: 'Penetration (cm)',
				     cls: 'composite-field',
				    width: '100%',
				    items: [
						    {
							xtype:'displayfield',
							cls: 'alignRight',
							value: 'Foot',
							width: 60
						    },
						    {
							name:'pen_foot',
							width: 105,
							xtype: 'numberfield'
						    },
						    {
							xtype:'displayfield',
							cls: 'alignRight',
							value: 'Ski',
							width: 60
						    },
						    {
							name:'pen_ski',
							cls: 'alignRight',
							width: 105,
							xtype: 'numberfield'
						    }
						]
				},
				{
				    xtype: 'compositefield',
				    fieldLabel: 'Snow Surface Form',
				    msgTarget : 'side',
				    height: 30,
				    cls: 'composite-field',
				    width: '100%',
				    items: [{
					xtype:'combo',
					hiddenName:'surface_snow_form',
					width: 200,
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
					cascadeComboId: 'surface_snow_form_minorCombo'
				    },
				    {
					xtype:'combo',
					hiddenName:'surface_snow_form_minor',
					id: 'surface_snow_form_minorCombo',
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
					width: 200
				    },
				    {
					xtype:'displayfield',
					value: 'Size (mm)',
					width: 60
				    },
				    {
					fieldLabel: 'Size',
					name: 'surface_snow_size',
					xtype: 'numberfield',
					width: 80
				},{
					boxLabel: 'Rimed',
					name: 'surface_snow_form_rimed',
					xtype: 'checkbox'
				}]
				},
				{
				    xtype: 'compositefield',
				    fieldLabel: 'Snow Surface Form 2',
				    msgTarget : 'side',
				    height: 30,
				    cls: 'composite-field',
				    width: '100%',
				    items: [{
					xtype:'combo',
					hiddenName:'surface_snow_form_2',
					width: 200,
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
					cascadeComboId: 'surface_snow_form_2_minorCombo'
				    },
				    {
					xtype:'combo',
					hiddenName:'surface_snow_form_2_minor',
					id: 'surface_snow_form_2_minorCombo',
					width: 200,
					store: new Ext.data.Store({
					    reader: new Ext.data.JsonReader({
					    }, LookupVO),
					    baseParams : {
						allowBlankRecord: true
					    }
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
					value: 'Size (mm)',
					width: 60
				    },
				    {
					 name: 'surface_snow_size_2',
					xtype: 'numberfield',
					width: 80
				    },
				    {
					boxLabel: 'Rimed',
					name: 'surface_snow_form_rimed_2',
					xtype: 'checkbox'
				    }
				]
				},
				{
				    xtype:'combo',
				    fieldLabel: 'Surface rough',
				    hiddenName:'snow_profile_surface_roughness',
				    width: 265,
				    store: new Ext.data.JsonStore({
					fields: [
					    {name: 'key'},
					    {name: 'value'}
					],
					autoLoad: true,
					root: 'rows',
					baseParams : {
					    lookup_code: 'surfaceroughness',
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
				    fieldLabel: 'HS',
				    name: 'hs_accumulated',
				    xtype: 'numberfield',
				    width: 100
				}

		],
                buttons:[
				{
				    id: 'continueFormButton',
				    text: 'Continue',
				    scope: this,
				    /*iconCls: 'ui-icon-disk',*/
				    handler: function(){
					    controller.continueForm();
					}
				    }
			    ]
	    },

	    // Chart Section
		    {
			xtype:'fieldset',
			id: 'chartFieldset',
			collapsible: true,
			title:'Chart',
			defaults: {
			    allowBlank: false,
			    msgTarget: 'side'
			},
			items:[
				    {
					xtype:'container',
					html:'<p>The following chart displays the snow profile chart. You can mange the view by using the drop-down menu (for example, Basic or Flags). Flags are determined using pre-defined settings (as indicated in the documentation).</p>'
				    },
				    {
					xtype: 'container',
					id: 'snowprofile_svg_div_parent'
				    }
				]
		    }
	]
    });

    // Layers Section
    layerForm = new LayerForm({});
    layerContainer = new Ext.FormPanel({
        defaults: {
            anchor: '0'
        },
        items: [{
            xtype:'fieldset',
            collapsible: true,
            /*width: '75%', */
            title:'Layer',
            defaults: {
                allowBlank: false,
                msgTarget: 'side'
            },
            items:[
                {
		    xtype:'container',
		    html:'<p>This section allows you, the user, to enter and record layers associated with the above profile. The user is required to enter data in the order that matched the above snow profile height (for example, full is measured bottom-up or in descending order).</p>'
		},
                layerForm]
        }]
    })

/* TODO WHY NO ; */

    /*
        TEMP
    */
    // Create RowActions Plugin
    var actionTempEditableGrid = new Ext.ux.grid.RowActions({
	header:'',
	width: 80,
	keepSelection:true,
	actions:[     {
	       iconCls:'ui-icon ui-icon-trash',
	       tooltip:'Delete',
	       scope: this,
	       callback:function(grid, records, action) {
		    Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function(btn){
			if(btn == "yes"){
			    if(!Ext.isEmpty(records.data.key)){
				Ext.Ajax.request(
				    {
				    method: 'GET',
				    url: '/json/entity_delete/',
				    params:{
					key: records.data.key,
					entity: 'TemperatureLayer'
				    },
				    scope: this,
				    success: function(action, options) {
					grid.store.reload()
					deleteFunciton(action, options);
			    
				    }
				});    
			    }   else {
				grid.store.remove(records);
			    }
			    
			}   
		    }, this);
	       }
       }
       ]
    });
    tempEditableGrid = new Ext.grid.EditorGridPanel({
        form_url: "/json/entity_save/",
        form_params :{
            entity: 'TemperatureLayer',
	    type: 'temperaturelayer__ObservationType__lookup',
            form: 'pc.forms.general.TemperatureLayerForm'
        },
	clicksToEdit : 'auto',
	plugins: [actionTempEditableGrid],
        store: new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, TemperatureLayerVO),
            baseParams:{
                entity: 'TemperatureLayer',
		type__ObservationType__lookup: 'temperaturelayer'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        }),
        cm: new Ext.grid.ColumnModel([
	    actionTempEditableGrid, 
            {
                header: 'Height',
                dataIndex: 'height',
                width: 150,
                align: 'right',
                editor: new Ext.form.NumberField({
                    allowBlank: false,
		    allowDecimals : false
                })
            },{
                header: 'Temperature',
                dataIndex: 'temperature',
                width: 150,
                align: 'right',
                editor: new Ext.form.NumberField({
                    allowBlank: false
                })
            }]
        ),
        autoHeight: true,
        //width: 3000,
        border: true,
        unstyled: true,
        frame: true,
        loadMask: true,
        tbar: ['->',{
            text: 'Add Record',
            handler : function(){
                var RecordVO = tempEditableGrid.getStore().recordType;
                var record = new RecordVO({created_by: party.key,
                                          created_date: new Date()});
                tempEditableGrid.stopEditing();
                tempEditableGrid.store.insert(tempEditableGrid.store.getCount(), record);
                tempEditableGrid.startEditing(tempEditableGrid.store.getCount() - 1, 0);
            }
        },{
            text: 'Save',
            id: 'tempEditableGridSaveButton',
            handler : function(){
                controller.tableSaveCounter = controller.tableSaveCounter + tempEditableGrid.getStore().getCount();
                controller.saveTableRows(tempEditableGrid);
            }
        }]
    });


    // Actual Form Panel
    tempContainer = new Ext.FormPanel({
        defaults: {
            anchor: '0'
        },
        items: [
			{
			    xtype:'fieldset',
			    collapsible: true,
			    /*width: '75%', */
			    title: 'Temperature',
			    defaults: {
				allowBlank: false,
				msgTarget: 'side'
			    },
			    items:[
				{
				    xtype:'container',
				    html:'<p>This section allows you, the user, to enter and record temperatures associated with the above profile. The user is required to enter data in the order that matched the above snow profile height (for example, full is measured bottom-up or in descending order).</p>'
				},
				   tempEditableGrid]
			}
		    ]
    })


    /*
        Tests Section
    */
    // Create RowActions Plugin
    var actionSnowpackStructureTestsTable = new Ext.ux.grid.RowActions({
	header:'',
	width: 80,
	keepSelection:true,
	actions:[     {
	       iconCls:'ui-icon ui-icon-trash',
	       tooltip:'Delete',
	       scope: this,
	       callback:function(grid, records, action) {
		    Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function(btn){
			if(btn == "yes"){
			    if(!Ext.isEmpty(records.data.key)){
				Ext.Ajax.request(
				    {
				    method: 'GET',
				    url: '/json/entity_delete/',
				    params:{
					key: records.data.key,
					entity: 'SnowpackTest'
				    },
				    scope: this,
				    success: function(action, options) {
					grid.store.reload()
					deleteFunciton(action, options);
			    
				    }
				});    
			    }   else {
				grid.store.remove(records);
			    }
			    
			}   
		    }, this);
	       }
       }
       ]
    });
    testsEditableGrid = new Ext.grid.EditorGridPanel({
        form_url: "/json/entity_save/",
        loadMask: true,
        form_params :{
            entity: 'SnowpackTest',
	    type: 'snowpacktest__ObservationType__lookup',
            form: 'pc.forms.general.SnowpackTestsForm'
        },
	clicksToEdit : 'auto',
        store: new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, SnowpackTestVO),
            remoteSort: true,
            baseParams:{
                entity: 'SnowpackTest',
		type__ObservationType__lookup: 'snowpacktest'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            })
        }),
	plugins:[actionSnowpackStructureTestsTable], 
        cm: new Ext.grid.ColumnModel([
            actionSnowpackStructureTestsTable, 
	    {
		sortable: false ,
		header: 'Test',
		dataIndex: 'snowpacktest_type',
		renderer: function(value, cmp, record){
		    return record.data.snowpacktest_type_code;
		},
		width: 45,
		editor: new Ext.form.ComboBox({
		    id: 'tests_type',
		    store: new Ext.data.Store({
			reader: new Ext.data.JsonReader({
			    root: 'rows'
			}, LookupVO),
			autoLoad: true,
			baseParams : {
			    lookup_code: 'snowpacktesttype',
			    allowBlankRecord: true
			},
			proxy: new Ext.data.ScriptTagProxy({
			    url: '/json/lookup_query_all/'
			})
		    }),
		    cascadeComboId: 'tests_type_minor',
		    valueField:'key',
		    displayField:'code',
		    editable: false,
		    triggerAction: 'all',
		    mode: 'local',
		    listWidth: 80,
		    selectOnFocus:true
		})
	    },{
		sortable: false ,
		header: 'Value',
		dataIndex: 'snowpacktest_type_minor',
		width:45,
		renderer: function(value, cmp, record){
		    return record.data.snowpacktest_type_minor_code;
		},
		editor: new Ext.form.ComboBox({
		    id: 'tests_type_minor',
		    store: new Ext.data.Store({
			storeId: "tests_type_minor_store",
			reader: new Ext.data.JsonReader({
			}, LookupVO)
		    }),
		    valueField:'key',
		    displayField:'code',
		    editable: false,
		    triggerAction: 'all',
		    mode: 'local',
		    selectOnFocus:true
		})
	    }, {
		header: 'Hits',
		sortable: false ,
		dataIndex: 'hits_num',
		width: 45,
		align: 'right',
		editor: new Ext.form.NumberField({
		    allowBlank: false
		})
	    }, {
		sortable: false ,
		header: 'FC ',
		dataIndex: 'fracture_character',
		width: 45,
		renderer: function(value, cmp, record){
		    return record.data.fracture_character_code;
		},
		editor: new Ext.form.ComboBox({
		    id: 'tests_fracture_character',
		    store: new Ext.data.Store({
			reader: new Ext.data.JsonReader({
			    root: 'rows'
			}, LookupVO),
			autoLoad: true,
			baseParams : {
			    lookup_code: 'snowpacktestfracturecharacter',
			    allowBlankRecord: true
			},
			proxy: new Ext.data.ScriptTagProxy({
			    url: '/json/lookup_query_all/'
			})
		    }),
		    cascadeComboId: 'tests_fracture_character_minor',
		    valueField:'key',
		    displayField:'code',
		    editable: false,
		    triggerAction: 'all',
		    mode: 'local',
		    selectOnFocus:true
		})
	    },{
		sortable: false ,
		header: 'FC Minor',
		dataIndex: 'fracture_character_minor',
		width: 65,
		renderer: function(value, cmp, record){
		    return record.data.fracture_character_minor_code;
		},
		editor: new Ext.form.ComboBox({
		    id: 'tests_fracture_character_minor',
		    store: new Ext.data.Store({
			storeId: "tests_fracture_character_minor_store",
			reader: new Ext.data.JsonReader({
			}, LookupVO)
		    }),
		    valueField:'key',
		    displayField:'code',
		    editable: false,
		    triggerAction: 'all',
		    mode: 'local',
		    selectOnFocus:true
		})
	    }, {
		sortable: false,
		header: 'SQ',
		dataIndex: 'shear_quality',
		width: 45,
		renderer: function(value, cmp, record){
		    return record.data.shear_quality_code;
		},
		editor: new Ext.form.ComboBox({
		    id: 'tests_shear_quality',
		    store: new Ext.data.JsonStore({
			fields: [
			    {name: 'key'},
			    {name: 'value'}
			],
			autoLoad: true,
			root: 'rows',
			baseParams : {
			    lookup_code: 'snowpacktestshearquality',
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
		    listWidth: 100,
		    selectOnFocus:true,
		    lazyRender: true
		})
	    },{
		header: 'Height',
		sortable: false ,
		dataIndex: 'height',
		width: 65,
		align: 'right',
		editor: new Ext.form.NumberField({
		    allowDecimals : false,
		    allowBlank: false
		})
	    },{
		header: 'Comments',
		sortable: false ,
		dataIndex: 'remark',
		width: 175,
		editor: new Ext.form.TextField({
		})
	    }]
	),
	autoHeight: true,
	border: true,
	unstyled: true,
	frame: true,
	listeners:{
	    scope:this,
	    validateedit: function (e){
		if(e.field == 'snowpacktest_type'){
		    e.record.data['snowpacktest_type_code'] = Ext.getCmp('tests_type').getRawValue();
		} else if(e.field == 'snowpacktest_type_minor'){
		    e.record.data['snowpacktest_type_minor_code'] = Ext.getCmp('tests_type_minor').getRawValue();
		} else if(e.field == 'fracture_character'){
		    e.record.data['fracture_character_code'] = Ext.getCmp('tests_fracture_character').getRawValue();
		} else if(e.field == 'fracture_character_minor'){
		    e.record.data['fracture_character_minor_code'] = Ext.getCmp('tests_fracture_character_minor').getRawValue();
		} else if(e.field == 'shear_quality'){
		    e.record.data['shear_quality_code'] = Ext.getCmp('tests_shear_quality').getRawValue();
		} else if(e.field == 'terrain'){
		    e.record.data['terrain_desc'] = Ext.getCmp('terrain').getRawValue();
		}
	    }
	}
    });



    // Actual Grid
    testsContainer = new Ext.FormPanel({
        defaults: {
            anchor: '0'
        },
        items: [{
            xtype:'fieldset',
            collapsible: true,
            autoHeight: true,
            /*width: '75%', */
            title:'Tests',
            items:[{
                xtype: 'panel',
                border: true,
                plain : true,
                unstyled: true,
                width: '100%',
                autoHeight: true,
                autoScroll: true,
                tbar: ['->',{
                    text: 'Add Record',
                    handler : function(){
                        var RecordVO = testsEditableGrid.getStore().recordType;
                        var record = new RecordVO({ created_by: party.key,
                                                    created_date: new Date()});
                        testsEditableGrid.stopEditing();
                        testsEditableGrid.store.insert(testsEditableGrid.store.getCount(), record);
                        testsEditableGrid.startEditing(testsEditableGrid.store.getCount() - 1, 0);
                    }
                },{
                    text: 'Save',
                    id: 'testsEditableGridSaveButton',
                    handler : function(){
                        controller.tableSaveCounter = controller.tableSaveCounter + testsEditableGrid.getStore().getCount();
                        controller.saveTableRows(testsEditableGrid);
                    }
                }],
                items:[
                {
		    xtype:'container',
		    html:'<p>This section allows you, the user, to enter and record snowpack tests associated with the above profile. The user is required to enter data in the order that matched the above snow profile height (for example, full is measured bottom-up or in descending order).</p>'
		},
                    testsEditableGrid
                ]
            }]
        }]
    });
    // create the data store
    tableStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, ProfileVO),
        remoteSort: true,
        baseParams:{
            entity: 'Profile',
            operation: operation.key,
            type__ObservationType__lookup: 'snowprofileindustrial',
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
        entity: 'Profile',
        image_type: 'ow',
        cmpUploadMsg: 'Event Photo',
        storesReload: [
	    tableStore
	]

    });


    /*
        Google map
    */
    googleMap = new Ext.FormPanel({
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
                                                    googleMap.get('mapContainer').get('map'),
                                                    null);
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
            layerContainer,
            tempContainer,
            testsContainer,
            photoForm,
	    googleMap

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
                    controller.load(records);
               }
       },
       {
               iconCls:'ui-icon ui-icon-trash',
               tooltip:'Delete',
               callback:function(grid, records, action) {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function(btn){
                        if(btn == "yes"){
                            Ext.Ajax.request(
                                {
                                method: 'GET',
                                url: '/json/entity_delete/',
                                params:{
                                    key: records.data.key,
                                    entity: 'Profile'
                                },
                                success: function(){
                                    tableStore.reload()
                                }
                            });
                        }
                    });
               }
       }
       ]
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
                        controller.add();
                    }
                }
            ]
        }),
        columns: [
            expander,
            action,
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

    controller = new Controller();
     /*
        LinkUtil
    */
    var linkUtil = new LinkUtil({form: fs,
                                entity: 'Profile',
                                record: new ProfileVO(),
                                fn: function(records){
                                    controller.load(records);
                                }
    });

	// Warn user of change of direction of sort (as layer data isn't sorted on switch .. yet)
    Ext.getCmp('snow_profile_test_typeCombo').on('change', function(field, newVal, oldVal ) {
		if( newVal != oldVal ) {
			if( LUPProfileTypeDesc && LUPProfileTypeDesc.length > 0 ) {
				for( var i = 0; i < LUPProfileTypeDesc.length; i++ ) {
					if( LUPProfileTypeDesc[i] == newVal || LUPProfileTypeDesc[i] == oldVal ) {
						//if( LUPProfileTypeDesc[i] == newVal ) {
						//	alert( "Please note, the chosen profile type requires your layer data to be input in descending order (bottom-up data entry)." );
						//}
						//else {
						//	alert( "Please note, the chosen profile type requires your layer data to be input in ascending order (top-down data entry)." );
						//}
						//break;
					}
				}
			}
		}
	});
});


LayerFormRow = Ext.extend(Ext.Container,{
    record: null,
    heightStart: 'start',
    initComponent: function () {

        this.startHeight = new Ext.form.NumberField({
            width: 50,
	    allowDecimals : false,
            name: this.record.id+'_height',
	    msgTarget : 'qtip',
	    allowNegative: false,
	    value: this.record.get(this.heightStart),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
			this.record.set(this.heightStart, newValue);
                        this.fireEvent('startChanged', this.record);
                    }
                }
            }
        });

        this.hardness = new Ext.form.ComboBox({
            id: this.record.id+'_hardness',
            width: 50,
	    //listWidth: 250,
            store: 'hardnessStore',
            valueField:'key',
            displayField:'code',
            editable: false,
	    msgTarget : 'qtip',
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus:true,
            lazyRender: true,
            value: this.record.get('hardness'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('hardness', newValue);
                    }
                }
            }
        });

        this.remark =  new Ext.form.TextField({
            id: this.record.id+'_remark',
            width: 80,
            value: this.record.get('remark'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('remark', newValue);
                    }
                }
            }
        });

        this.liquid_water_content = new Ext.form.ComboBox({
            id: this.record.id+'_liquid_water_content',
            width: 50,
	    listWidth: 250,
            store: 'liquidWaterContentStore',
            valueField:'key',
            displayField:'code_value',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus:true,
            lazyRender: true,
            value: this.record.get('liquid_water_content'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('liquid_water_content', newValue);
                    }
                }
            }
        });

        this.density =  new Ext.form.NumberField({
            id: this.record.id+'_density',
            width: 75,
            value: this.record.get('density'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('density', newValue);
                    }
                }
            }
        });

        this.estimated =  new Ext.form.Checkbox({
            id: this.record.id+'_estimated',
            width: 30,
            value: this.record.get('estimated'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('estimated', newValue);
                    }
                }
            }
        });

        this.snow_size =  new Ext.form.NumberField({
            id: this.record.id+'_snow_size',
            width: 75,
            value: this.record.get('surface_snow_size'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('surface_snow_size', newValue);
                    }
                }
            }
        });

        this.snow_size_2 =  new Ext.form.NumberField({
            id: this.record.id+'_snow_size_2',
            width: 75,
            value: this.record.get('surface_snow_size_2'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('surface_snow_size_2', newValue);
                    }
                }
            }
        });

        this.snow_form_rimed =  new Ext.form.Checkbox({
            id: this.record.id+'_snow_form_rimed',
            width: 30,
            value: this.record.get('surface_snow_form_rimed'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('surface_snow_form_rimed', newValue? "on": "off");
                    }
                }
            }
        });

        this.snow_form_rimed_2 =  new Ext.form.Checkbox({
            id: this.record.id+'_snow_form_rimed_2',
            width: 30,
            value: this.record.get('surface_snow_form_rimed_2'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('surface_snow_form_rimed_2',  newValue? "on": "off");
                    }
                }
            }
        });

        this.snow_form = new Ext.form.ComboBox({
            id: this.record.id+'_snow_form',
            width: 80,
	    listWidth: 250,
            store: 'snowFormStore',
            valueField:'key',
            displayField:'code_value',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus:true,
            lazyRender: true,
            value: this.record.get('surface_snow_form'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('surface_snow_form', newValue);
                    }
                },
                select: {
                    scope: this,
                    fn: function(cmp, record, index){
                        this.snow_form_minor.getStore().loadData(record.data.children);
                    }
                }
            }
        });

        this.snow_form_minor = new Ext.form.ComboBox({
            id: this.record.id+'_snow_form_minor',
            store: new Ext.data.Store({
                reader: new Ext.data.JsonReader({
                }, LookupVO)
            }),
            width: 80,
	    listWidth: 350,
            valueField:'key',
            displayField:'code_value',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus:true,
            lazyRender: true,
            value: this.record.get('surface_snow_form_minor'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('surface_snow_form_minor', newValue);
                    }
                }
            }
        });

        this.snow_form_2 = new Ext.form.ComboBox({
            id: this.record.id+'_snow_form_2',
            width: 80,
	    listWidth: 250,
            store: 'snowFormStore',
            valueField:'key',
            displayField:'code_value',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus:true,
            lazyRender: true,
            value: this.record.get('surface_snow_form_2'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('surface_snow_form_2', newValue);
                    }
                },
                select: {
                    scope: this,
                    fn: function(cmp, record, index){
                        this.snow_form_2_minor.getStore().loadData(record.data.children);
                    }
                }
            }
        });

        this.snow_form_2_minor = new Ext.form.ComboBox({
            id: this.record.id+'_snow_form_2_minor',
            store: new Ext.data.Store({
                reader: new Ext.data.JsonReader({
                }, LookupVO)
            }),
            width: 80,
	    listWidth: 350,
            valueField:'key',
            displayField:'code_value',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus:true,
            lazyRender: true,
            value: this.record.get('surface_snow_form_2_minor'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('surface_snow_form_2_minor', newValue);
                    }
                }
            }
        });

        this.persistant_layer = new Ext.form.ComboBox({
            id: this.record.id+'_persistant_layer',
            store: 'persistantLayerStore',
            width: 85,
            listWidth: 250,
            valueField:'key',
            displayField:'full_name',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus:true,
            lazyRender: true,
            value: this.record.get('persistent_layer'),
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
                        this.record.set('persistent_layer', newValue);
                    }
                }
            }
        });

        this.composite = new Ext.form.CompositeField({
            width: 963,
            style: {
                padding: '5px 0 0 60px'
            },
            items:[
                this.hardness,
                this.snow_form,
                this.snow_form_minor,
                this.snow_size,
                this.snow_form_2,
                this.snow_form_2_minor,
                this.snow_size_2,
                this.liquid_water_content,
                this.estimated,
                this.density,
                this.persistant_layer,
                this.remark
                //this.snow_form_rimed,
                //this.snow_form_rimed_2,
            ]
        });

        Ext.applyIf(this, {
            items:[this.startHeight,
                   this.composite]
	});
        LayerFormRow.superclass.initComponent.call(this);
    },
    isHeightSet: function(){
	var height = this.startHeight.getValue();
	if(!isNaN(parseFloat(height))){
	    if(height >= 0){
		return true;
	    }
	}
	return false;
    },
    isHardnessSet: function(){
	var hardness = this.hardness.getValue();
	if(hardness != null && hardness != "" ){
	    return true;
	}
	return false;
    },
    validateRow: function(){
	var valid = true;
	// height set
	valid = this.isHeightSet();
	if(!valid){
	    this.startHeight.markInvalid('You must set this value');
	}	else {
	    valid = this.isHardnessSet();
	    if(!valid){
		if(this.record.get(this.heightStart) != null && !isNaN(this.record.get(this.heightStart)) && this.record.get(this.heightStart) != "" && this.record.get(this.heightStart) >= 0 ){
		    this.hardness.markInvalid('You must set this value');
		}
	    }
	}
	return valid;
    }
});

LayerForm = Ext.extend(Ext.Panel, {
    form_url: "/json/entity_save/",
    form_params:{
        entity: 'Layer',
	type: 'layerevent__ObservationType__lookup',
        form: 'pc.forms.general.Layer'
    },
    anchor: '100%',
    layout: 'fit',
    autoHeight: true,
    autoScroll: true,
    bodyStyle: 'padding: 5px',
    border: false,
    MAX_ROWS: 10,
    rowIndex: 0,
    tbar: ['->', {
        text: 'Add Record',
        scope: this,
        handler : function(){
            layerForm.addRow();
        }
    },
    {
        text: 'Save',
        id: 'layerEditableGridSaveButton',
        handler : function(){
	    if(layerForm.validate()){
		var records = layerForm.save();
		controller.tableSaveCounter = controller.tableSaveCounter + records.length;
		controller.saveLayerRows(records);
	    }
        }
    }],
    initComponent: function () {
        this.hardnessStore = new Ext.data.JsonStore({
            storeId: 'hardnessStore',
            fields: [
                {name: 'key'},
                {name: 'code'}
            ],
            autoLoad: true,
            root: 'rows',
            baseParams : {
                lookup_code: 'snowhardness',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });
        this.liquidWaterContentStore = new Ext.data.JsonStore({
            storeId: 'liquidWaterContentStore',
            fields: [
                {name: 'key'},
                {name: 'code_value'}
            ],
            autoLoad: true,
            root: 'rows',
            baseParams : {
                lookup_code: 'liquidwatercontent',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });
        this.snowFormStore = new Ext.data.JsonStore({
            storeId: 'snowFormStore',
            fields: [
                {name: 'key'},
                {name: 'code_value'},
                {name: 'children'}
            ],
            autoLoad: true,
            root: 'rows',
            baseParams : {
                lookup_code: 'snowonground',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/lookup_query_all/'
            })
        });
        this.store = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, LayerVO),
            baseParams:{
                entity: 'Layer',
		type__ObservationType__lookup: 'layerevent'
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
        this.gridHeader = new Ext.Container({
            height: 40,
            width: '100%',
            boxMinWidth: 958,
            boxMaxHeight: 40,
            forceLayout : true,
            contentEl: 'layer-header'
        });
        this.rows = new Ext.Container({
            layout: 'form',
            autoHeight: true,
            labelWidth: 75
        });
        this.endHeight = new Ext.form.NumberField({
            width: 50,
	    allowNegative: false,
            id: 'end_layerContainer',
            listeners:{
                change:{
                    scope: this,
                    fn: function(field, newValue, oldValue){
			this.store.getAt(this.store.getCount() - 1).set(this.heightEnd, newValue);
                    }
                }
            }
        });
        Ext.applyIf(this, {
            items:[
                   this.gridHeader,
                   this.rows,
                   this.endHeight]
	});
        LayerForm.superclass.initComponent.call(this);
    },
    save: function(){
	// prepare all records for saving

        var records = [];
	var lastRecord = null;

        this.store.each( function(record){
            var tempStart = record.get('start');
	    var tempEnd = record.get('end');
	    var tempHardness = record.get('hardness');
	    if( tempStart != null && !isNaN(tempStart) && tempStart >= 0 &&
		tempEnd != null && !isNaN(tempEnd) && tempEnd >= 0 && tempStart != tempEnd &&
		tempHardness != null && tempHardness != "") {
		records.push(record);
	    }
        }, this);
        return records;
    },

    validateHeight: function(height){
	if(!isNaN(parseFloat(height))){
	    if(height >= 0){
		return true;
	    }
	}
	return false;
    },

    validate: function(){

	var isFullyValid = true;
	var isFirstRow = true;
	var prevHeightField = null;

	var items = layerForm.rows.items.items.slice(0);

	Ext.getCmp('end_layerContainer').clearInvalid();
	Ext.each(items.reverse(), function(row){
	    row.startHeight.clearInvalid();
	    row.hardness.clearInvalid();
	    if(isFullyValid){

		if(prevHeightField == null){
		    prevHeightField = Ext.getCmp('end_layerContainer');
		}

		if(row.isHardnessSet()){
		    // check start height set
		    if(!row.isHeightSet()){
			// invalid, height missing
			row.startHeight.markInvalid('This value is missing');

			isFullyValid = false;
		    }
		    // check end height set
		    if(!this.validateHeight(prevHeightField.getValue())){
			prevHeightField.markInvalid('This value is missing');

			isFullyValid = false;
		    }
		}	else {

		    if(this.validateHeight(prevHeightField.getValue())){

			row.hardness.markInvalid('This value is missing');
			isFullyValid = false;
			if(!row.isHeightSet()){
			    // invalid, height missing

			    row.startHeight.markInvalid('This value is missing');
			    isFullyValid = false;
			}
		    }
		}
		if(isFullyValid && row.isHeightSet() && row.isHardnessSet()){
		    if(profileDirection == "DESC"){
			// order of height is 20 10 0
			if(prevHeightField.getValue() >= row.startHeight.getValue()){
			    // wrong order, invalid

			    prevHeightField.markInvalid('This value needs to be less than the above row');
			    isFullyValid = false;
			}
		    }	else {
			// order of height is 0 10 20
			if(prevHeightField.getValue() <= row.startHeight.getValue()){
			    // wrong order, invalid

			    prevHeightField.markInvalid('This value needs to be greater than the above row');
			    isFullyValid = false;
			}
		    }
		}
	    }	else {

		return false;
	    }
	    prevHeightField = row.startHeight;
	    return true;
	}, this);
	return isFullyValid;
    },

    addRow: function(){
        var blankRecords = [];
        layerForm.rowIndex ++;
        var record = new LayerVO({created_by: party.key,
                                  created_date: new Date()}, layerForm.rowIndex);
	record.set(this.heightStart, this.store.getAt(this.store.getCount() - 1).get(this.heightEnd));
        blankRecords.push(record);

        layerForm.store.insert(layerForm.store.getCount(), blankRecords);

        var row = new LayerFormRow({record: record, heightStart:this.heightStart, heightEnd:this.heightEnd});
        layerForm.rows.add(row);
        this.endHeight.setValue('');
        layerForm.rows.doLayout();
        layerForm.doLayout();
    },

    startChanged: function(record){
	if( record && record.store && record.store.indexOfId( record.id ) > 0 ) {
	    this.store.getAt( record.store.indexOfId( record.id ) - 1 ).set(this.heightEnd, record.get(this.heightStart));
        }
    },

    onStoreLoad: function(){
        this.loadMask.hide();
        this.endHeight.setValue("");
	/*
	    FULL - DESC
		    end > start
	    FRACTURE - ASC
		    start > end
	*/
	if(profileDirection == "DESC"){
	    this.heightStart = 'end';
	    this.heightEnd = 'start';
	}	else {
	    this.heightStart = 'start';
	    this.heightEnd = 'end';
	}
        this.rows.removeAll();
        var blankRecords = [];
        var lastRecord = null;
        var isSetLastRecordEnd = false;
        if(this.store.getCount() > 0){
            lastRecord = this.store.getAt(this.store.getCount() - 1);
        }
        for(var i=0; i < (this.MAX_ROWS - this.store.getCount()); i++){
            this.rowIndex ++;
            var record = null;
            if(i == 0 && lastRecord != null){
		record = new LayerVO({start: lastRecord.get(this.heightEnd), end: lastRecord.get(this.heightEnd)}, this.rowIndex);
                isSetLastRecordEnd = true;
            }
			else {
                record = new LayerVO({}, this.rowIndex);
            }
            blankRecords.push(record);
        }
        if(!isSetLastRecordEnd && lastRecord != null){
            //this.endHeight.setValue(lastRecord.get('end'));DRASKO
	    this.endHeight.setValue(lastRecord.get(this.heightEnd));
        }
        this.store.add(blankRecords);
        this.store.each(function (item){
            var row = new LayerFormRow({record: item, heightStart: this.heightStart, heightEnd: this.heightEnd});
            row.on('startChanged', this.startChanged, this);
            this.rows.add(row);
        }, this);
        /*
        if(this.rows){
            this.rows.doLayout();
        }
        */
        this.doLayout();
    }
});

function ChartController(){
    this.storeLoadCounter = 3;
    this.stores = [];
}

ChartController.prototype.regStore = function(store){
    this.stores.push(store);
    store.on('load', this.storeLoad, this);
    store.on('add', this.storeChange, this)
    store.on('update', this.storeChange, this)
}

ChartController.prototype.storeLoad = function(){
    this.storeLoadCounter--;
    if(this.storeLoadCounter == 0){
        this.drawSnowProfileSvgChartData();
    }
}

ChartController.prototype.storeChange = function(){
    // TODO: add a delay here because this will trigger as the user enters data
    this.drawSnowProfileSvgChartData();
}

ChartController.prototype.drawSnowProfileSvgChartData = function(){
    if (this.stores != null && this.stores.length == 3) {

        this.removeTablesPropertiesSelectorDiv();
        this.createTablesPropertiesSelectorDiv();

        this.removeSnowProfileSvgDiv(); // remove div if existing
        this.createSnowProfileSvgDiv(); // add div to parent
        this.renderSnowProfileSvgChart(); // render svg chart

        // TODO: Prove that we can get snowprofile (air temp, description). Not sure how to get this data here.

        var svg = $('#snowprofile_svg_div').svg('get');
        var snowprofile = this.generateSnowprofile();
        var snowprofilePreferences = this.generateSnowprofilePreferences();
        powdercloudSvgSnowprofile.drawData(svg, snowprofile, snowprofilePreferences);
    }
}

ChartController.prototype.initialRenderSnowProfileSvgChart = function(){
    if(powdercloudSvgSnowprofile === undefined) {
        this.removeSnowProfileSvgDiv(); // remove div if existing
        this.createSnowProfileSvgDiv(); // add div to parent
        this.renderSnowProfileSvgChart(); // render svg chart
    }
}

ChartController.prototype.removeTablesPropertiesSelectorDiv = function(){
    var propertiesTableDiv = $('#properties_table_div');
    propertiesTableDiv.remove();
}

ChartController.prototype.createTablesPropertiesSelectorDiv = function(){
    var snowprofileSvgDivParent = $('#snowprofile_svg_div_parent');
    snowprofileSvgDivParent.append("<div id='properties_table_div'>Properties Table: <select id='properties_table_combo' onchange='onChangePropertiesTableCombo(this.value)'></select></div>");

    var types = powdercloudSvgSnowprofile.getPropertiesTableTypes();

    var propertiesTableCombo = $('#properties_table_combo');
    if (types) {
            for (i=0;i<types.length;i++) {
                    var type = types[i];
                    if (type) {
                            propertiesTableCombo.append("<option value='" + type.value + "'>" + type.name + "</option>");
                    }
            }
    }
}

function onChangePropertiesTableCombo(value) {
        if (powdercloudSvgSnowprofile && value) {

                // Set table type
                powdercloudSvgSnowprofile.setPropertiesTableType(value);

                // Remove old
                var oldSvgDiv = document.getElementById("snowprofile_svg_div");
                var snowprofileSvgDivParent = document.getElementById("snowprofile_svg_div_parent");
                snowprofileSvgDivParent.removeChild(oldSvgDiv);

                // Create new
                chartController.createSnowProfileSvgDiv();

                // Re-draw
                chartController.renderSnowProfileSvgChart();

                // Draw data
                var svg = $('#snowprofile_svg_div').svg('get');
                var snowprofile = chartController.generateSnowprofile();
                var snowprofilePreferences = chartController.generateSnowprofilePreferences();
                powdercloudSvgSnowprofile.drawData(svg, snowprofile, snowprofilePreferences);
        }
}

ChartController.prototype.removeSnowProfileSvgDiv = function(){
    var snowprofileSvgDiv = $('#snowprofile_svg_div');
    snowprofileSvgDiv.remove();
}

ChartController.prototype.createSnowProfileSvgDiv = function(){
    var snowprofileSvgDivParent = $('#snowprofile_svg_div_parent');
    snowprofileSvgDivParent.append("<div id='snowprofile_svg_div'></div>");
    var snowprofileSvgDiv = $('#snowprofile_svg_div');
    snowprofileSvgDiv.width(snowprofileSvgWidth);
    snowprofileSvgDiv.height(snowprofileSvgHeight);
}

ChartController.prototype.renderSnowProfileSvgChart = function(){
    powdercloudSvgSnowprofile = new PowdercloudSvgSnowprofile(snowprofileSvgWidth, snowprofileSvgHeight);
    $('#snowprofile_svg_div').svg({onLoad: powdercloudSvgSnowprofile.drawChart});

}

ChartController.prototype.generateSnowprofile = function () {
    var snowprofile = new Object();
    snowprofile.surfaceTemperature = Ext.getCmp('snow_temperature_T_0').getValue();
    snowprofile.airTemperature = Ext.getCmp('air_temperature_present').getValue(); // type:Numeric

	// sort direction
    snowprofile.isLayersDescendingTopDown = true;
    if(profileDirection == "ASC"){
	snowprofile.isLayersDescendingTopDown = false;
    }

    var snowLayers = new Array();
    if (this.stores[2] != null && this.stores[2].data != null && this.stores[2].data.items != null) {
        for (i=0;i<=this.stores[2].data.items.length;i++) {
            var item = this.stores[2].data.items[i];
            if (item != null && item.data != null) {

                if (item.data.start == null || item.data.start == undefined
                    || item.data.end == null || item.data.end == undefined
                    || item.data.hardness_code == null || item.data.hardness_code == undefined || item.data.hardness_code == '') {
                    continue;
                }

                var snowLayer = new Object();
                snowLayer.density = item.data.density; // type:Numeric
		if(profileDirection == "DESC"){
		    snowLayer.heightStart = item.data.end;
		    snowLayer.heightEnd = item.data.start;
		}	else {
		    snowLayer.heightStart = item.data.start;
		    snowLayer.heightEnd = item.data.end;
		}
                snowLayer.comments = item.data.remark; // type:String

                snowLayer.crystalSize01 = item.data.surface_snow_size; // type:Numeric

                snowLayer.crystalSize02 = item.data.surface_snow_size_2; // type:Numeric

                if (item.data.liquid_water_content_code == '')
		{
                    snowLayer.liquidWaterContent = null; // type:String
                }
		else
		{
                    snowLayer.liquidWaterContent = item.data.liquid_water_content_code; // type:String
                }

                if (item.data.hardness_code == '')
		{
                    snowLayer.snowHardness = null; // type:String
                }
		else
		{
                    snowLayer.snowHardness = item.data.hardness_code; // type:String
                }

                if (item.data.surface_snow_form_code == '')
		{
                    snowLayer.snowForm01 = null; // type:String
                }
		else
		{
                    snowLayer.snowForm01 = item.data.surface_snow_form_code; // type:String
                }
		if (item.data.surface_snow_form_minor_code == '')
		{
                    snowLayer.snowFormMinor01 = null; // type:String
                }
		else
		{
                    snowLayer.snowFormMinor01 = item.data.surface_snow_form_minor_code; // type:String
                }
                if (item.data.surface_snow_form_2_code == '')
		{
                    snowLayer.snowForm02 = null; // type:String
                }
		else
		{
                    snowLayer.snowForm02 = item.data.surface_snow_form_2_code; // type:String
                }
		if (item.data.surface_snow_form_2_minor_code == '')
		{
                    snowLayer.snowFormMinor02 = null; // type:String
                }
		else
		{
                    snowLayer.snowFormMinor02 = item.data.surface_snow_form_2_minor_code; // type:String
                }
                snowLayers.push(snowLayer);
            }
        }
    }

    var temperatureLayers = new Array();
    if (this.stores[0] != null && this.stores[0].data != null && this.stores[0].data.items != null) {
        for (i=0;i<=this.stores[0].data.items.length;i++) {
            var item = this.stores[0].data.items[i];
            if (item != null && item.data != null) {

                var temperatureLayer = new Object();
                temperatureLayer.height = item.data.height;
                temperatureLayer.temperature = item.data.temperature;
                temperatureLayers.push(temperatureLayer);
            }
        }
    }

    var shears = new Array();
    if (this.stores[1] != null && this.stores[1].data != null && this.stores[1].data.items != null) {
        for (i=0;i<=this.stores[1].data.items.length;i++) {
            var item = this.stores[1].data.items[i];
            if (item != null && item.data != null) {

                var shear = new Object();
                shear.comments = item.data.remark; // type: String
                shear.height = item.data.height; // type: Numeric
                shear.hits = item.data.hits_num; // type: Numeric
                if (item.data.fracture_character_code == '') {
                    shear.fractureCharacterCode = null; // type:String
                } else {
                    shear.fractureCharacterCode = item.data.fracture_character_code; // type:String
                }
                if (item.data.shear_quality_code == '') {
                    shear.shearQualityCode = null; // type:String
                } else {
                    shear.shearQualityCode = item.data.shear_quality_code; // type:String
                }
                if (item.data.type_code == '') {
                    shear.snowObservationTestCode = null; // type:String
                } else {
                    shear.snowObservationTestCode = item.data.type_code; // type:String
                }

		shear.fracture_character_code = null;
		shear.fracture_character_minor_code = null;
		shear.shear_quality_code = null;
		shear.snowpacktest_type_code = null;
		shear.snowpacktest_type_minor_code = null;
		if(item.data.fracture_character_code != '') {
		    shear.fracture_character_code = item.data.fracture_character_code;
		}
		if(item.data.fracture_character_minor_code != '') {
		    shear.fracture_character_minor_code = item.data.fracture_character_minor_code;
		}
		if(item.data.shear_quality_code != '') {
		    shear.shear_quality_code = item.data.shear_quality_code;
		}
		if(item.data.snowpacktest_type_code != '') {
		    shear.snowpacktest_type_code = item.data.snowpacktest_type_code;
		}
		if(item.data.snowpacktest_type_minor_code != '') {
		    shear.snowpacktest_type_minor_code = item.data.snowpacktest_type_minor_code;
		}

		//console.info('Preparing to draw');
		//console.info(item.data); //show all data available
		//console.info(shear); // show data sent to svg drawing function
                shears.push(shear);
            }
        }
    }

    snowprofile.snowLayers = snowLayers; // Array of snowLayer objects
    snowprofile.temperatureLayers = temperatureLayers; // Array of temperatureLayer objects
    snowprofile.shears = shears; // Array of shears objects

    return snowprofile;
}

ChartController.prototype.generateSnowprofilePreferences = function () {

    // TODO: just chose some snowprofile preferences at random.

    var prefs = new Object();

    prefs.flagHexColor = "#FFFF00";
    prefs.potentialFailureHexColor = "#66FF00";

    prefs.averageGrainSizeFlagValue = 2;
    prefs.snowHardnessCode = "P";
    prefs.snowFormCodes = ["SH", "PP"];

    prefs.differenceAverageGrainSizeFlagValue = 1;
    prefs.differenceHardnessFlagValue = 1;

    prefs.depthOfInterfaceStart = 0;
    prefs.depthOfInterfaceEnd = 200.0;

    prefs.highlightInterfaceCount = 1;

    return prefs;
}
