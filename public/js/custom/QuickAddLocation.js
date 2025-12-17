Ext.namespace("pc.custom");

pc.custom.QuickAddLocation = Ext.extend(Ext.form.CompositeField, {
    height: 30,
    fieldLabel: 'Location',
    cls: 'composite-field',
    width: '100%',
    feature_type__selfRef: null,
    autoLoad: false,
    initComponent: function () {
        this.latestTerrain = null;
        this.locationForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Terrain',
                form: 'pc.forms.admin.TerrainAdminForm'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            items:[{
                xtype:'hidden',
                name:'key'
            },{
                xtype:'hidden',
                name:'operation'
            },
            {
                fieldLabel: 'Nick Name',
                name: 'name_nick',
                xtype:'textfield',
                width:200
            },
            {
                xtype:'combo',
                fieldLabel: 'Country',
                hiddenName:'country',
                width:200,
                store: new Ext.data.JsonStore({
                    storeId:'locCountryStore',
                    fields: [
                        {name: 'key'},
                        {name: 'value'},
                    ],
                    autoLoad: false,
                    root: 'rows',
                    baseParams : {
                        lookup_code: 'country'
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
                    storeId: 'locMountainStore',
                    fields: [
                        {name: 'key'},
                        {name: 'value'},
                    ],
                    autoLoad: false,
                    root: 'rows',
                    baseParams : {
                        lookup_code: 'mountainrange'
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
                    storeId: 'locFeatureType',
                    fields: [
                        {name: 'key'},
                        {name: 'code_value'},
                    ],
                    autoLoad: false,
                    root: 'rows',
                    baseParams : {
                        lookup_code: 'featuretype'
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
            },
            {
                xtype:'combo',
                fieldLabel: 'Region',
                hiddenName:'region',
                width: 200,
                store: new Ext.data.Store({
                    storeId:'locRegionStore',
                    reader: new Ext.data.JsonReader({
                        root: 'rows'
                    }, TerrainVO),
                    root: 'rows',
                    autoLoad: false,
                    baseParams : {
                        entity: 'Terrain',
                        operation: operation.key,
                        det: 'k',
                        feature_type__selfRef: 'Region'
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
                    storeId:'locOpZoneStore',
                    reader: new Ext.data.JsonReader({
                        root: 'rows'
                    }, TerrainVO),
                    root: 'rows',
                    autoLoad: false,
                    baseParams : {
                        entity: 'Terrain',
                        operation: operation.key,
                        det: 'k',
                        feature_type__selfRef: 'Operating Zone'
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
            },{
                xtype:'combo',
                fieldLabel: 'Forecast Zone',
                hiddenName:'forecast_zone',
                width: 200,
                store: new Ext.data.Store({
                    storeId:'locForZoneStore',
                    reader: new Ext.data.JsonReader({
                        root: 'rows'
                    }, TerrainVO),
                    root: 'rows',
                    autoLoad: false,
                    baseParams : {
                        entity: 'Terrain',
                        operation: operation.key,
                        det: 'k',
                        feature_type__selfRef: 'Forecast Zone'
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
                    storeId:'locRouteStore',
                    reader: new Ext.data.JsonReader({
                        root: 'rows'
                    }, TerrainVO),
                    root: 'rows',
                    autoLoad: false,
                    baseParams : {
                        entity: 'Terrain',
                        operation: operation.key,
                        det: 'k',
                        feature_type__selfRef: 'Route'
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
            }]
        })
        this.locationWindow = new Ext.Window({
            width:600,
            height:275,
            closeAction:'hide',
            modal: true,
            title: 'Add a new Location',
            items: [
                this.locationForm
            ],
            buttons: [{
                text:'Cancel',
                scope: this,
                handler: function(){
                    this.locationWindow.hide();
                }
            },{
                text: 'Save',
                scope: this,
                handler: function(){
                    this.locationForm.getForm().submit({
                        url:this.locationForm.form_url,
                        params:this.locationForm.form_params,
                        waitMsg:'Saving Data...',
                        submitEmptyText: false,
                        scope:this,
                        success: function(form, action) {
                            var key = Ext.decode(action.response.responseText).key;
                            this.latestTerrain = key;
                            this.locationWindow.hide();
                            this.store.reload();
                        }
                    });
                }
            }]
        });

        this.store = new Ext.data.Store({
            storeId:'quickAddLocationStore',
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, TerrainVO),
            root: 'rows',
            baseParams : {
                entity: 'Terrain',
                active: 'True',
                sort: 'name_nick',
                det: 's',
                dir: 'ASC',
                allowBlankRecord: true
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            }),
            listeners:{
                load:{
                    scope:this,
                    fn:function(store, records, options){
                        if(this.latestTerrain){
                            this.comboBox.setValue(this.latestTerrain);
                        }   else {
                            this.comboBox.setValue(this.comboBox.getValue());
                        }
                    }
                }
            }
        });
        if(this.feature_type__selfRef != null){
            this.store.setBaseParam('feature_type__selfRef', this.feature_type__selfRef);
        }
        this.comboBox = new Ext.form.ComboBox({
            fieldLabel: 'Location',
            id:'location',
            hiddenName:'terrain',
            width: 200,
            store: this.store,
            valueField:'key',
            displayField:'name_nick',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus:true
        });
        if(this.autoLoad){
            this.store.load();
        }
        Ext.applyIf(this, {
            items:[
                this.comboBox,
                {
                    xtype: 'button',
                    hidden:true,
                    iconCls: 'add-loc-icon',
                    text: 'Add',
                    scope: this,
                    handler: function() {
                        this.latestTerrain = null;
                        var record = new TerrainVO({operation: operation.key});
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
                        this.locationForm.getForm().setValues( values);
                        Ext.StoreMgr.lookup("locFeatureType").load();
                        Ext.StoreMgr.lookup("locRegionStore").load();
                        Ext.StoreMgr.lookup("locCountryStore").load();
                        Ext.StoreMgr.lookup("locOpZoneStore").load();
                        Ext.StoreMgr.lookup("locForZoneStore").load();
                        Ext.StoreMgr.lookup("locMountainStore").load();
                        Ext.StoreMgr.lookup("locRouteStore").load();
                        this.locationWindow.show();
                    }
                }

            ]
	});
        pc.custom.QuickAddLocation.superclass.initComponent.call(this);
    }
});
Ext.reg('quickaddlocation', pc.custom.QuickAddLocation);
