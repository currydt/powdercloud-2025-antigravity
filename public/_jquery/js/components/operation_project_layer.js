Ext.namespace("pc.custom");
pc.custom.LayerCmp = Ext.extend( Ext.form.FieldSet, {
    title: 'Persistent Layers',
    collapsible: true,
    collapsed: false,
    border: true,
    autoHeight: true,
    defaults:{
        border:false
    },
    initComponent: function() {
        /*
            LAYER
        */
        /*
            LAYER STORE
        */
        this.layerStore = Ext.StoreMgr.lookup("persistantLayerStore");
        this.layerStore.on('load', function(store, records, options){
            this.drawLayers(records);
        }, this);

        /*
            LAYER FORM
        */
        this.layerForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'PersistentLayer',
                form: 'pc.forms.observation.ObservationForm',
                type: 'persistentlayerevent__ObservationType__lookup'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, PersistentLayerVO),
            waitMsgTarget: true,
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, PersistentLayerVO),
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
                        store: 'locationRegionForecast',
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
                        xtype: 'colorpalette',
                        listeners: {
                            scope: this,
                            select: function(cp, color){
                                this.layerForm.getForm().setValues({color: color});
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
                            store: 'snowonground',
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
                            store: 'snowonground',
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
            LAYER HISTORY FORM
        */
        this.layerHistoryForm = new LayerHistoryForm({compactView: true});
        /*
            LAYER FORM CONTAINER
        */
        this.layerFormContainer = new Ext.Panel({
            title:'',
            hidden:true,
            autoHeight:true,
            plain: true,
            width   : '100%',
            defaults:{
                plain: true,
                border: false,
                width   : '100%',
                bodyStyle: 'padding: 5px'
            },
            items:[
                this.layerForm,
                this.layerHistoryForm
            ],
            buttons:[{
                text: 'Save',
                id: 'layerSaveButton',
                scope: this,
                handler: function(button){
                    button.disable();
                    this.saveLayer();
                }
            },
            {
                text: 'Cancel',
                scope: this,
                handler: function(){
                    this.layerFormContainer.hide();
                    this.layerGrid.show();
                }
            }]
        });
        /*
            LAYER GRID
        */
        this.layerGrid =  new Ext.Panel({
            border: true,
            autoHeight: true,
            bodyStyle: 'padding: 5px',
            tbar: ['->',{
                text: 'Add Record',
                scope: this,
                handler: function(){
                    this.addLayer();
                }
             }]
        });
        Ext.applyIf(this, {
            items: [
                {
                    xtype: 'container',
                    html: '<p>Persistent layers</p>'
                },
                this.layerGrid,
                this.layerFormContainer
            ]
        });
        pc.custom.LayerCmp.superclass.initComponent.call(this);
    },
    drawLayers: function(records){
        this.layerGrid.removeAll();
        Ext.each(records, function(item){
            var layerPanel = new LayerPanel();
            layerPanel.on('saveLayerHistory', this.saveLayerHistory, this);
            layerPanel.load(item);
            this.layerGrid.add(layerPanel);
            this.layerGrid.doLayout();
            $("#"+layerPanel.header.id).css({'color':"#"+item.get('color')});
            $('#'+layerPanel.header.id+' .x-panel-header').css({'background-image':'none'});
        }, this);
    },
    addLayer: function(){
        var record = new PersistentLayerVO({operation: operation.key,
                                            operation_desc:operation.name,
                                            created_by: party.key,
                                            created_by_desc: party.name,
                                            date_time_start: new Date(),
                                            created_date: new Date(),
                                            burial_date: new Date()});
        this.layerForm.getForm().setValues( newRecordForForm(record));
        record = new PersistentLayerHistoryVO({created_by: party.key,
                                              date_time_start: new Date(),
                                            created_by_desc: party.name,
                                            created_date: new Date()});
        this.layerHistoryForm.getForm().setValues(newRecordForForm(record));
        this.layerGrid.hide();
        this.layerFormContainer.show();
        this.layerHistoryForm.getForm().clearInvalid();
    },
    saveLayer: function(){
        if(this.layerHistoryForm.getForm().isValid()){
            var tmp = this.layerForm.getForm().getValues();
            this.layerForm.getForm().submit({
                url:this.layerForm.form_url,
                waitMsg:'Saving Data...',
                params: this.layerForm.form_params,
                submitEmptyText: false,
                scope: this,
                success: function(form, action) {
                    var record = this.layerForm.reader.extractData([Ext.decode(action.response.responseText).record], true)[0];
                    this.layerForm.getForm().loadRecord(record);
                    var layerValues = this.layerForm.getForm().getValues();
                    this.layerHistoryForm.getForm().setValues({
                        persistent_layer: record.data.key,
                        terrain: layerValues.terrain,
                        created_date: layerValues.burial_date,
                        date_time_start: layerValues.burial_date,
                        observer: layerValues.observer
                    });
                    this.layerHistoryForm.getForm().submit({
                        url:this.layerHistoryForm.form_url,
                        waitMsg:'Saving Data...',
                        params: this.layerHistoryForm.form_params,
                        submitEmptyText: false,
                        scope:this,
                        success: function(form, action) {
                            var key = Ext.decode(action.response.responseText).key;
                            this.layerHistoryForm.getForm().setValues({
                                key: key
                            });
                            this.layerFormContainer.hide();
                            this.layerGrid.show();
                            this.layerStore.reload();
                            Ext.getCmp('layerSaveButton').enable();
                        },
                        failure: function(form, action){
                            Ext.getCmp('layerSaveButton').enable();
                            formFailureFunction();
                        }
                    });
                },
                failure: function(form, action){
                    Ext.getCmp('layerSaveButton').enable();
                    formFailureFunction();
                }
            });
        }	else {
            Ext.getCmp('layerSaveButton').enable();
            formFailureFunction();
        }
    },
    saveLayerHistory: function(cmp){
        cmp.saveLayerHistoryBtn.disable();
        cmp.form.getForm().setValues({
            terrain: cmp.record.data.terrain,
            date_time_start: cmp.record.data.burial_date
        });
        cmp.form.getForm().submit({
            url:cmp.form.form_url,
            waitMsg:'Saving Data...',
            params: cmp.form.form_params,
            submitEmptyText: false,
            scope:this,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                cmp.form.getForm().setValues({
                    key: this.key
                });
                cmp.store.removeAll();
                cmp.store.reload();
                cmp.newRecord();
                cmp.saveLayerHistoryBtn.enable();
                cmp.collapse();
            },
            failure: function(form, action){
                cmp.saveLayerHistoryBtn.enable();
                formFailureFunction();
            }
        });
    }
});
Ext.reg('layercmp', pc.custom.LayerCmp);
