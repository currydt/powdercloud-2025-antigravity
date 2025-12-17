Ext.namespace("pc.custom");
pc.custom.ActivityRunStatusForm = Ext.extend(Ext.Panel, {
    border: false,
    defaults: {
        anchor: '0',
        border: false
    },
    autoHeight: true,
    storesToLoad: [ 'observerActive',
                    'locationOperatingZones'],
    initComponent: function() {
        this.projectCombo = new Ext.form.ComboBox({
            fieldLabel: 'Project',
            hiddenName: 'project',
            store: 'projects',
            valueField: 'key',
            displayField: 'name',
            hidden: true,
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus: false,
            forceSelection: false,
            width: 200
        });
        this.runStore =  Ext.StoreMgr.lookup('locationRuns');
        this.runStore.on('load', this.onRunStatusOrRunsLoad, this);
        Ext.StoreMgr.lookup('locationOperatingZones').on('load', this.resetForms, this);
        this.isRunStoreBusy = true;

        this.runStatusStore = new Ext.data.Store({
            storeId: 'runStatus',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, RunVO),
            remoteSort: true,
            baseParams:{
                entity: 'Run'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            }),
            listeners: {
                scope: this,
                load: this.onRunStatusOrRunsLoad
            }
        });
        this.runStatusTerrainStore = new Ext.data.Store({
            //groupField:'terrain_operating_zone_desc',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, ActivityRunStatusTerrainVO)
        });
        /*
            RUN TABLE
        */
        this.operationZoneCombo = new Ext.form.ComboBox({
            width: 250,
            store: 'locationOperatingZones',
            valueField: 'key',
            displayField: 'name_nick',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus: true,
            forceSelection: true,
            autoSelect: true,
            listeners: {
                scope: this,
                select:  function(cmp, record){
                    this.onOperatingZoneChange(record);
                }
            }
        });
        this.statusRadiobuttons = [
                new Ext.grid.RadioColumn({header: 'Not Considered', inputValue: 'NC', dataIndex: 'run_status_code', width: 100, align: 'center', sortable: true}),
                new Ext.grid.RadioColumn({header: 'Open', inputValue: 'O', dataIndex: 'run_status_code', width: 75, align: 'center', sortable: true}),
                new Ext.grid.RadioColumn({header: 'Standby', inputValue: 'STANDBY', dataIndex: 'run_status_code', width: 75, align: 'center', sortable: true}),
                new Ext.grid.RadioColumn({header: 'Closed', inputValue: 'CLOSED', dataIndex: 'run_status_code', width: 75, align: 'center', sortable: true})
        ];
        this.runTable = new Ext.grid.EditorGridPanel({
            form_url: "/json/entity_save_batch/",
            form_params: {
                entity: 'Run',
                form: 'pc.forms.activities.RunForm'
            },
	    tbar:['Operating Zone: ',
                this.operationZoneCombo
            ],
            store: this.runStatusTerrainStore,
            plugins: this.statusRadiobuttons,
            loadMask: true,
            cm: new Ext.grid.ColumnModel([
                {
                // Expander expander,
                    header   : 'Operating Zone',
                    width    : 140,
                    sortable : false,
                    dataIndex: 'terrain_operating_zone_desc',
                    hidden:true
                },{
                    header   : 'Name',
                    width    : 140,
                    sortable : false,
                    dataIndex: 'terrain_name_nick'
                }
            ].concat(this.statusRadiobuttons).concat({
                header: 'Comment',
                sortable: false ,
                dataIndex: 'run_status_narrative',
                width: 175,
                editor: new Ext.form.TextField({
                })
            })),
            view: new Ext.grid.GridView({
                forceFit:true,
                markDirty: false,
                //groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
            }),
            stripeRows: true,
            height: 400,
            width: '100%',
            loadMask: true,
            clicksToEdit: 1,
            listeners: {
                'cellclick':{
                    scope: this,
                    fn: function (grid, rowIndex, columnIndex, e) {
                        if (columnIndex == 1) {
                            var runStatus = grid.store.getAt(rowIndex);
                            var terrain = this.runStore.getAt(this.runStore.find('key',runStatus.data.terrain));
                            runGallery.show(terrain);
                        }
                    }
                }
            }

        });
        this.mainForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            params: {
                entity: 'Activity',
                form: 'pc.forms.activities.ActivityForm',
                type: 'runstatus__ActivityType__lookup'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items: [
            {
                xtype: 'hidden',
                itemId: 'key',
                name: 'key'
            },
            {
                xtype: 'hidden',
                name: 'operation'
            },

            {
                xtype: 'hidden',
                name: 'created_date'
            },
            {
                xtype: 'hidden',
                name: 'created_by'
            },
            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Operational Header',
                items: [
                {
                        xtype:'container',
                        html:'<p> This section allows you to record details related to your operation.</p>'
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Operation',
                    name: 'operation_desc',
                    width: 200
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Data Recorder',
                    width: 200,
                    name: 'created_by_desc'
                },
                    this.projectCombo,
                {
                    xtype: 'combo',
                    fieldLabel: 'Guide',
                    hiddenName: 'observer',
                    itemId: 'observer',
                    store: 'observerActive',
                    lastQuery: '',
                    valueField: 'key',
                    displayField: 'full_name',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: false,
                    forceSelection: false,
                    allowBlank: false,
                    width: 200
                },
                {
                    fieldLabel: 'Date and time',
                    itemId: 'date_time_start',
                    name: 'date_time_start',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
                    allowBlank: false,
                    width: 200
                }, /*{
                    xtype: 'combo',
                    fieldabel: 'Location',
                    itemId: 'location',
                    hiddenName: 'terrain',
                    width: 200,
                    store: 'location',
                    valueField: 'key',
                    displayField: 'name_nick',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    allowBlank: false,
                    selectOnFocus: true
                }, */
                {
                    fieldLabel: 'Description',
                    name: 'name',
                    xtype: 'textfield',
                    allowBlank: false,
                    width: 600
                }
                ]
            }, {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title: 'Details',
                items: [
                    {
                            xtype:'container',
                            html:'<p> This section allows you to write a brief narrative, describing the terrain status. </p>'
                    },
                    {
                        fieldLabel: 'Notes',
                        name: 'comments_internal',
                        xtype: 'textarea',
                        width: 600
                    }
                ]
            }]
        })
        this.runTableContainer = new Ext.form.FieldSet({
            title: 'Run Table',
            collapsible: false,
            collapsed: false,
            items: [{
                xtype:'container',
                html:'<p>Use the table below to enter Run data. The Menu allows your to switch to another operating zone. Switching to a different Operating Zone will automatically save your Run data. The user should allow these data to save and the new item to load before swtiching a second time.</p>'
            },
                this.runTable
            ]
        });
        Ext.applyIf(this, {
            items: [
                this.mainForm,
                this.runTableContainer
            ]
        });
        this.saveButton = new Ext.Button({
            text: 'Save',
            scope: this,
            handler: function(button) {
                this.fireEvent('save');
            }
        });
        this.continueButton = new Ext.Button({
            text: 'Continue',
            scope: this,
            handler: function(button) {
                this.fireEvent('continue');
            }
        });
        this.buttons = [
        this.saveButton,
        this.continueButton,
        {
            text: 'Cancel',
            scope: this,
            handler: function(button) {
                this.fireEvent('cancel');
            }
        }];
        pc.custom.ActivityRunStatusForm.superclass.initComponent.call(this);
        this.mainForm.on('setValue', this.onRecordSet, this)
    },
    formState: function(stateName) {
        if (stateName == 'create') {
            this.continueButton.show();
            this.saveButton.hide();
            this.runTableContainer.hide();
        } else {
            this.continueButton.hide();
            this.saveButton.show();
            this.runTableContainer.show();
        }

    },
    resetForms: function() {
        if(this.operationZoneCombo.getStore().getCount() > 0){
            var firstRec = this.operationZoneCombo.getStore().getAt(0);
            this.operationZoneCombo.setValue(firstRec.get(this.operationZoneCombo.valueField));
            this.onOperatingZoneChange(firstRec);
        }
    },
    onOperatingZoneChange: function(record){
        if(this.currOperatingZone == undefined || this.currOperatingZone != record.data.key){
            this.currOperatingZone = record.data.key;
            if(this.runStatusTerrainStore.getCount() > 0){
                this.on('dataSaved', this.loadOperatingZoneRuns, this);
                this.saveData();
            }   else {
                this.loadOperatingZoneRuns();
            }
        }
    },
    loadOperatingZoneRuns: function(){
        this.removeListener('dataSaved', this.loadOperatingZoneRuns, this);
        this.runTable.loadMask = new Ext.LoadMask(this.runTable.body, {
            msg:'Loading...'
        });
        this.runTable.loadMask.show();
        this.runStore.load({params: {operating_zone: this.currOperatingZone}});
    },
    saveData: function() {
        this.runTable.loadMask = new Ext.LoadMask(this.runTable.body, {
            msg:'Saving...'
        });
        this.runTable.loadMask.show();
        this.saveButton.disable();
        this.saveRunStatus();
    },
    saveRunStatus: function(){
        if(this.runStatusTerrainStore.getCount() > 0){
            var batchSave = new Array();
            this.runStatusTerrainStore.each( function(activityRunStatusTerrain) {
                var temp = new RunVO(activityRunStatusTerrain.data);
                temp.set('date_time_start', this.mainForm.getForm().getFieldValues().date_time_start);
                //temp.set('forecaster', this.mainForm.getForm().getFieldValues().forecaster);
                temp.set('observer', this.mainForm.getForm().getFieldValues().observer);
                temp.set('activity', this.mainForm.getForm().getFieldValues().key);
		temp.set('run_status', temp.get('run_status_code')+'__Lookup__lookup');
                batchSave.push(ServerUtils.prepareFieldsForService(temp));

                var matchingIndex = this.runStatusStore.findExact('terrain', temp.get('terrain'));
                if(matchingIndex >= 0){
                    var orig = this.runStatusStore.getAt(matchingIndex);
                    if(orig != null){
                        orig.data = temp.data
                    }
                }   else {
                    this.runStatusStore.add(temp);
                }   
            }, this);

            Ext.Ajax.request({
                url: this.runTable.form_url,
                params: Ext.apply(this.runTable.form_params, {records: Ext.util.JSON.encode(batchSave)}),
                scope: this,
                success: function(response, opts){

                    this.saveDataComplete();
                },
                failure: function(form, action) {
                    this.saveButton.enable();
                    formFailureFunction();
                }
            });
        }   else {
            this.saveDataComplete();
        }
    },
    saveDataComplete: function(){
        this.saveButton.enable();
        this.runTable.loadMask.hide();
        this.fireEvent('dataSaved');
    },
    onRecordSet: function(){
        if(!Ext.isEmpty(this.mainForm.getForm().getFieldValues().key)){
            this.isRunStatusStoreBusy = true;
            this.resetForms();
            this.runStatusStore.load({params: {activity: this.mainForm.getForm().getFieldValues().key}});
            this.runTable.loadMask = new Ext.LoadMask(this.runTable.body, {
                msg:'Loading...'
            });
            this.runTable.loadMask.show();
        }   else {
            this.isRunStatusStoreBusy = false;
            this.onRunStatusOrRunsLoad(this.runStatusStore);
        }
    },
    loadData: function(){

    },
    onRunStatusOrRunsLoad: function(store, records, options){
        if(store.storeId == 'locationRuns'){
            this.isRunStoreBusy = false;
        }
        if(store.storeId == 'runStatus'){
            this.isRunStatusStoreBusy = false;
        }
        if(this.isRunStoreBusy == false && this.isRunStatusStoreBusy == false){
            // clean runStatusTerrainStore
            this.runStatusTerrainStore.removeAll();
            this.runTable.loadMask.hide();
            // join runStore & runStatusStore into runStatusTerrainStore for runTable
            this.runStore.each( function(terrain) {
                var activityRunStatusTerrain = new ActivityRunStatusTerrainVO();
                var matchingIndex = this.runStatusStore.findExact('terrain', terrain.data.key);
                var activityRunStatus = null;
                if(matchingIndex >= 0){
                    activityRunStatus = this.runStatusStore.getAt(matchingIndex);
                    if(activityRunStatus != null){
                        activityRunStatusTerrain.set(Ext.applyIf(activityRunStatusTerrain.data, activityRunStatus.data));

                    }
                }   else {
                    // default values
                    activityRunStatusTerrain.set('date_time_start', new Date());
                    activityRunStatusTerrain.set('run_status_code', 'NC');
                    activityRunStatusTerrain.set('run_status_narrative', '');
                }
                activityRunStatusTerrain.set('terrain', terrain.data.key);
                activityRunStatusTerrain.set('terrain_name_nick', terrain.data.name_nick);
                activityRunStatusTerrain.set('terrain_operating_zone_desc', terrain.data.operating_zone_desc);
                this.runStatusTerrainStore.add(activityRunStatusTerrain);
            }, this);
        }
    }
});
Ext.reg('activityrunstatusform', pc.custom.ActivityRunStatusForm);
