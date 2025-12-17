Ext.namespace("pc.custom");
pc.custom.ActivityRunUsageForm = Ext.extend(Ext.Panel, {
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
        this.runStore.on('load', this.onRunUsagesOrRunsLoad, this);
        Ext.StoreMgr.lookup('locationOperatingZones').on('load', this.resetForms, this);
        this.isRunStoreBusy = true;

        this.runUsageStore = new Ext.data.Store({
            storeId: 'runUsage',
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
                load: this.onRunUsagesOrRunsLoad
            }
        });
        this.runUsageTerrainStore = new Ext.data.Store({
            //groupField:'terrain_operating_zone_desc',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, ActivityRunUsageTerrainVO)
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
        this.runTable = new Ext.grid.EditorGridPanel({
            form_url: "/json/entity_save_batch/",
            form_params: {
                entity: 'Run',
                form: 'pc.forms.activities.RunForm'
            },
            tbar:['Operating Zone: ',
                this.operationZoneCombo
            ],
            store: this.runUsageTerrainStore,
            /*plugins: [new Ext.ux.grid.ColumnHeaderGroup({
                rows: [
                    [
                        {},
                        {},
                        {header: 'Line', colspan: 3, align: 'center', dataIndex: 'line_left'},
                        {header: 'Transport Details', colspan: 3, align: 'center', dataIndex: 'transport_pickup'},
                        {}
                    ]
                ],
                hierarchicalColMenu: true
            })],*/
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
                }, /*{
                    xtype: 'checkboxcolumn',
                    header: 'Left',
                    dataIndex: 'line_left'
                }, {
                    xtype: 'checkboxcolumn',
                    header: 'Center',
                    dataIndex: 'line_center'
                }, {
                    xtype: 'checkboxcolumn',
                    header: 'Right',
                    dataIndex: 'line_right'
                }, {
                    xtype: 'checkboxcolumn',
                    header: 'Pickup High',
                    dataIndex: 'transport_pickup'
                }, {
                    xtype: 'checkboxcolumn',
                    header: 'Dropoff Low',
                    dataIndex: 'transport_dropoff'
                }, {
                    xtype: 'checkboxcolumn',
                    header: 'Other',
                    dataIndex: 'transport_other'
                }, */{
                    header: 'Times Skied',
                    sortable: false ,
                    dataIndex: 'remark',
                    width: 100,
                    editor: new Ext.form.NumberField({
                    })
                }, {
                    header: 'Comment',
                    sortable: false ,
                    dataIndex: 'run_status_narrative',
                    width: 250,
                    editor: new Ext.form.TextField({
                    })
                }
            ]),
            view: new Ext.grid.GridView({
                forceFit:true,
                markDirty: false
                //,groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
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
                            var runUsage = grid.store.getAt(rowIndex);
                            var terrain = this.runStore.getAt(this.runStore.find('key',runUsage.data.terrain));
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
                type: 'runusage__ActivityType__lookup'
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
                },
                {
                    fieldLabel: 'Name',
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
                            html:'<p> This section allows you to write a brief narrative, describing the terrain usage. </p>'
                    },
                    {
                    fieldLabel: 'Run Usage Summary',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 600
                }]
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
        pc.custom.ActivityRunUsageForm.superclass.initComponent.call(this);
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
            if(this.runUsageTerrainStore.getCount() > 0){
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
        this.saveRunUsage();
    },
    saveRunUsage: function(){
        if(this.runUsageTerrainStore.getCount() > 0){
            var batchSave = new Array();
            this.runUsageTerrainStore.each( function(activityRunUsageTerrain) {
                var temp = new RunVO(activityRunUsageTerrain.data);
                temp.set('date_time_start', this.mainForm.getForm().getFieldValues().date_time_start);
                //temp.set('forecaster', this.mainForm.getForm().getFieldValues().forecaster);
                temp.set('observer', this.mainForm.getForm().getFieldValues().observer);
                temp.set('activity', this.mainForm.getForm().getFieldValues().key);
                batchSave.push(ServerUtils.prepareFieldsForService(temp));
                var matchingIndex = this.runUsageStore.findExact('terrain', temp.get('terrain'));
                if(matchingIndex >= 0){
                    var orig = this.runUsageStore.getAt(matchingIndex);
                    if(orig != null){
                        orig.data = temp.data;
                    }
                }   else {
                    this.runUsageStore.add(temp);
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
            this.isRunUsageStoreBusy = true;
            this.resetForms();
            this.runUsageStore.load({params: {activity: this.mainForm.getForm().getFieldValues().key}});
            this.runTable.loadMask = new Ext.LoadMask(this.runTable.body, {
                msg:'Loading...'
            });
            this.runTable.loadMask.show();
        }   else {
            this.isRunUsageStoreBusy = false;
            this.onRunUsagesOrRunsLoad(this.runUsageStore);
        }
    },
    loadData: function(){

    },
    onRunUsagesOrRunsLoad: function(store, records, options){
        if(store.storeId == 'locationRuns'){
            this.isRunStoreBusy = false;
        }
        if(store.storeId == 'runUsage'){
            this.isRunUsageStoreBusy = false;
        }
        if(this.isRunStoreBusy == false && this.isRunUsageStoreBusy == false){
            // clean runUsageTerrainStore
            this.runUsageTerrainStore.removeAll();
            this.runTable.loadMask.hide();
            // join runStore & runUsageStore into runUsageTerrainStore for runTable
            this.runStore.each( function(terrain) {
                var activityRunUsageTerrain = new ActivityRunUsageTerrainVO();
                var matchingIndex = this.runUsageStore.findExact('terrain', terrain.data.key);
                var activityRunUsage = null;
                if(matchingIndex >= 0){
                    activityRunUsage = this.runUsageStore.getAt(matchingIndex);
                    if(activityRunUsage != null){
                        console.log(activityRunUsage);
                        activityRunUsageTerrain.set(Ext.applyIf(activityRunUsageTerrain.data, activityRunUsage.data));

                    }
                }   else {
                    // default values
                    activityRunUsageTerrain.set('date_time_start', new Date());
                    activityRunUsageTerrain.set('remark', '');
                }
                activityRunUsageTerrain.set('terrain', terrain.data.key);
                activityRunUsageTerrain.set('terrain_name_nick', terrain.data.name_nick);
                activityRunUsageTerrain.set('terrain_operating_zone_desc', terrain.data.operating_zone_desc);
                this.runUsageTerrainStore.add(activityRunUsageTerrain);
            }, this);
        }
    }
});
Ext.reg('activityrunusageform', pc.custom.ActivityRunUsageForm);
