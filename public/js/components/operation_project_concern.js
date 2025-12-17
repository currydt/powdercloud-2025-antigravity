var chartController;

Ext.namespace("pc.custom");
pc.custom.ConcernCmp = Ext.extend(  Ext.form.FieldSet, {
    title: 'Concerns',
    collapsible: true,
    collapsed: false,
    border: true,
    defaults:{
        border:false
    },
    autoHeight: true,
    storesToLoad: ['observerActive',
                   'locationRegionForecast',
                   'avalanchecharacter',
                   'concern_priority',
                   'avalanchedistribution',
                   'persistantLayerStore',
                   'triggersensitivity',
                   'triggerlikelihood',
                   'sizedestructive',
                   'dangerscale',
                   'stabilitytrending'],
    initComponent: function() {
        /*
            CONCERNS STORE
        */
        this.concernsStore = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, ObservationVO),
            remoteSort: true,
            autoLoad: false,
            baseParams:{
                entity: 'Concerns',
                type__ObservationType__lookup: 'concernsevent',
                start:0,
                limit:PAGING_LIMIT
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all_paging/'
            })
        });
        /*
            CONCERNS FORM
        */
        this.concernsForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            hidden: true,
            form_params:{
                entity: 'Concerns',
                form: 'pc.forms.observation.ObservationForm',
                type: 'concernsevent__ObservationType__lookup'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160,
                anchor: '0'
            },
            items: [{
                xtype: 'hidden',
                name: 'key'
            },
            {
                xtype: 'hidden',
                name: 'created_date'
            },
            {
                xtype: 'hidden',
                itemId: 'operation',
                name: 'operation'
            },
            {
                xtype: 'hidden',
                itemId: 'created_by',
                name: 'created_by'
            },

            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title: 'Operational Header',
                items: [

                {
                        xtype: 'displayfield',
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
                        width: 200,
                        store: 'observerActive',
                        lastQuery: '',
                        valueField:'key',
                        displayField:'full_name',
                        editable: false,
                        triggerAction: 'all',
                        hidden: (this.parent)? true: false,
                        mode: 'local',
                        selectOnFocus:true
                },
                    {
                        fieldLabel: 'Start Time',
                        name: 'date_time_start',
                        xtype: 'datetimefield',
                        dateFormat: 'Y-m-d',
                        timeFormat: 'H:i',
                        width: 200
                    },{
                            xtype:'combo',
                            fieldLabel: 'Location',
                            itemId: 'location',
                            hiddenName:'terrain',
                            store: 'locationRegionForecast',
                            valueField:'key',
                            displayField:'name_nick',
                            editable: false,
                            hidden: (this.parent)? true: false,
                            triggerAction: 'all',
                            mode: 'local',
                            allowBlank: false,
                            width: 200,
                            selectOnFocus:true
                    },
                    {
                        fieldLabel: 'End time',
                        name: 'date_time_end',
                        xtype: 'datetimefield',
                        dateFormat: 'Y-m-d',
                        timeFormat: 'H:i',
                        width: 200
                    },
                    {
                        fieldLabel: 'Notable',
                        name: 'notable',
                        xtype: 'checkbox',
                        width: 100
                    },{
                            fieldLabel: 'Description',
                            name: 'subject',
                            hidden: (this.parent)? true: false,
                            xtype: 'textfield',
                            width: 600
                    }]
            },

            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Concern',
                items: [

                    {
                    xtype: 'combo',
                    fieldLabel: 'Concern',
                    hiddenName: 'expected_avalanche_character',
                    width: 265,
                    store: new Ext.data.JsonStore({
                        storeId: 'avalanchecharacter',
                        fields: [{
                            name: 'key'
                        }, {
                            name: 'code_value'
                        }],
                        root: 'rows',
                        baseParams: {
                            lookup_code: 'avalanchecharacter',
                            allowBlankRecord: true
                        },
                        proxy: new Ext.data.ScriptTagProxy({
                            url: '/json/lookup_query_all/'
                        })
                    }),
                    valueField: 'key',
                    displayField: 'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Distribution',
                    hiddenName: 'avalanche_distribution',
                    width: 265,
                    store: 'avalanchedistribution',
                    valueField: 'key',
                    displayField: 'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Concern Priority',
                    hiddenName: 'concern_priority',
                    width: 265,
                    store: new Ext.data.JsonStore({
                        storeId: 'concern_priority',
                        fields: [{
                            name: 'key'
                        }, {
                            name: 'code_value'
                        }],
                        autoLoad: true,
                        root: 'rows',
                        baseParams: {
                            lookup_code: 'concern_priority',
                            allowBlankRecord: true
                        },
                        proxy: new Ext.data.ScriptTagProxy({
                            url: '/json/lookup_query_all/'
                        })
                    }),
                    valueField: 'key',
                    displayField: 'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Persistent Layers',
                    hiddenName: 'persistent_layer',
                    width: 265,
                    listWidth: 350,
                    store: 'persistantLayerStore',
                    valueField: 'key',
                    displayField: 'full_name',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                },
                {
                    xtype:'fieldset',
                    collapsible: false,
                    collapsed: false,
                    width: '100%',
                    title:'Terrain',
                    items: [

                //{
                //    xtype: 'compositefield',
                //    fieldLabel: 'Elevation',
                //    cls: 'composite-field',
                //    width: '100%',
                //    items: [
                //    //{
                //    //    xtype: 'displayfield',
                //    //    value: '',
                //    //    width: 140
                //    //},
                //    {
                //        xtype: 'ringslicescmp',
                //        name: 'elevation_bands',
                //        width: 80,
                //        height: 80
                //    },
                //    ]
                //},


                // Aspects
                {
                    xtype: 'compositefield',
                    fieldLabel: 'Aspects',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype: 'displayfield',
                        value: 'Alpine',
                        cls: 'alignRight',
                        width: 80
                    },
                    {
                        xtype: 'pieslicescmp',
                        name: 'aspect_concern_in_alpine',
                        width: 80,
                        height: 80
                    },
                    {
                        xtype: 'displayfield',
                        value: 'Treeline',
                        cls: 'alignRight',
                        width: 180
                    },
                    {
                        xtype: 'pieslicescmp',
                        name: 'aspect_concern_in_treeline',
                        width: 80,
                        height: 80
                    },
                    {
                        xtype: 'displayfield',
                        value: 'Below Treeline',
                        cls: 'alignRight',
                        width: 220
                    },
                    {
                        xtype: 'pieslicescmp',
                        name: 'aspect_concern_below_treeline',
                        width: 80,
                        height: 80
                    }
                    ]
                },

                {
                    fieldLabel: 'Terrain Types',
                    name: 'trn_comments',
                    xtype: 'textarea',
                    width: 500
                }
                ]
                },

                // Trigger and Such Fieldset
                {
                    xtype:'fieldset',
                    collapsible: false,
                    collapsed: false,
                    width: '75%',
                    title:'Hazard and Ratings',
                    items: [


                    // Sensitivity
                    {
                        xtype: 'compositefield',
                        height: 30,
                        fieldLabel: 'Sensitivity',
                        cls: 'composite-field',
                        width: '100%',
                        items: [
                        {
                        xtype: 'displayfield',
                        value: '',
                        cls: 'alignRight',
                        width: 80
                    },
                    {
                            xtype: 'combo',
                            hiddenName: 'trigger_sensitivity_in_alpine',
                            width: 190,
                            store: 'triggersensitivity',
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },

                        {
                        xtype: 'displayfield',
                        value: '',
                        cls: 'alignRight',
                        width: 70
                    },
                    {
                            xtype: 'combo',
                            hiddenName: 'trigger_sensitivity_in_treeline',
                            width: 190,
                            store: 'triggersensitivity',
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'displayfield',
                            value: '',
                            cls: 'alignRight',
                            width: 110
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'trigger_sensitivity_in_below_treeline',
                            width: 190,
                            store: 'triggersensitivity',
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        }
                        ]
                    },


                    // LikeLihood
                    {
                        xtype: 'compositefield',
                        height: 30,
                        fieldLabel: 'Likelihood',
                        cls: 'composite-field',
                        width: '100%',
                        items: [
                        {
                        xtype: 'displayfield',
                        value: '',
                        cls: 'alignRight',
                        width: 80
                        },

                        {
                            // High Alpine Likelihood
                            xtype: 'combo',
                            hiddenName: 'likelihood_in_alpine_min',
                            width: 60,
                            store: 'triggerlikelihood',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        }
                        ,{
                            xtype: 'combo',
                            hiddenName: 'likelihood_in_alpine',
                            width: 60,
                            store: 'triggerlikelihood',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'likelihood_in_alpine_max',
                            width:60,
                            store: 'triggerlikelihood',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        // Alpine Likelihood
                        {
                        xtype: 'displayfield',
                        value: '',
                        cls: 'alignRight',
                        width: 70
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'likelihood_in_treeline_min',
                            width: 60,
                            store: 'triggerlikelihood',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'likelihood_in_treeline',
                            width: 60,
                            store: 'triggerlikelihood',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'likelihood_in_treeline_max',
                            width: 60,
                            store: 'triggerlikelihood',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },

                        {
                            xtype: 'displayfield',
                            value: '',
                            width: 110
                        },
                        // Sub alpine Likelihood
                        {
                            xtype: 'combo',
                            hiddenName: 'likelihood_in_below_treeline_min',
                            width: 60,
                            store: 'triggerlikelihood',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'likelihood_in_below_treeline',
                            width: 60,
                            store: 'triggerlikelihood',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'likelihood_in_below_treeline_max',
                            width: 60,
                            store: 'triggerlikelihood',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        }]
                    },
                    // Destructive Size
                    {
                        xtype: 'compositefield',
                        msgTarget: 'side',
                        height: 30,
                        fieldLabel: 'Expected size',
                        cls: 'composite-field',
                        width: '100%',
                        items: [
                        {
                        xtype: 'displayfield',
                        value: '',
                        cls: 'alignRight',
                        width: 80
                    },
                    {

                        // High Alpine
                            xtype: 'combo',
                            hiddenName: 'expected_size_in_alpine_min',
                            width: 60,
                            store: 'sizedestructive',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'expected_size_in_alpine',
                            width: 60,
                            store: 'sizedestructive',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'expected_size_in_alpine_max',
                            width: 60,
                            store: 'sizedestructive',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        // Alpine
                        {
                        xtype: 'displayfield',
                        value: '',
                        cls: 'alignRight',
                        width: 70
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'expected_size_in_treeline_min',
                            width: 60,
                            store: 'sizedestructive',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'expected_size_in_treeline',
                            width: 60,
                            store: 'sizedestructive',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'expected_size_in_treeline_max',
                            width: 60,
                            store: 'sizedestructive',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },

                        // Sub alpine
                        {
                            xtype: 'displayfield',
                            value: '',
                            width: 110
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'expected_size_in_below_treeline_min',
                            width: 60,
                            store: 'sizedestructive',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'expected_size_in_below_treeline',
                            width: 60,
                            store: 'sizedestructive',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        },
                        {
                            xtype: 'combo',
                            hiddenName: 'expected_size_in_below_treeline_max',
                            width: 60,
                            store: 'sizedestructive',
                            valueField: 'key',
                            displayField: 'code',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        }]
                },
                {
                    xtype:'fieldset',
                    title:'Charts',
                    collapsible: false,
                    collapsed: false,
                    autoWidth: true,
                    height: 300,
                    items:[{
                        xtype:'container',
                        html: '<div id="svg_div_hazard_alpine" style="height:310px;width:310px;float:left;"></div><div id="svg_div_hazard_treeline" style="height:310px;width:310px;float:left;"></div><div id="svg_div_hazard_below_treeline" style="height:310px;width:310px;float:left;"></div>',
                        height: 300,
                        width:  930
                    }]
                }]
                },
                // {
                //    xtype: 'combo',
                //    fieldLabel: 'Danger Rating',
                //    hiddenName: 'rating_danger',
                //    width: 265,
                //    store: 'dangerscale',
                //    valueField: 'key',
                //    displayField: 'code_value',
                //    editable: false,
                //    triggerAction: 'all',
                //    mode: 'local',
                //    selectOnFocus: true
                //},
                {
                        xtype:'combo',
                        fieldLabel: 'Trending',
                        hiddenName:'trending',
                        store: 'stabilitytrending',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true,
                        width: 265
                },
                //{
                //        fieldLabel: 'Verified ?',
                //        name: 'verified',
                //        xtype: 'checkbox',
                //        width: 100
                // },
                {
                    fieldLabel: 'Concern Summary',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width:500
                }]
            }],
            buttons:[{
                text: 'Save',
                id: 'concernSaveButton',
                scope: this,
                handler: function(button){
                    button.disable();
                    this.saveConcern();
                }
            },
            {
                text: 'Cancel',
                scope: this,
                handler: function(){
                    this.concernsForm.hide();
                    this.concernsGrid.show();
                }
            }]
        });
        /*
            CONCERNS GRID
        */
        // Create RowActions Plugin
        this.expander = new Ext.ux.grid.RowExpander({
            tpl : new Ext.Template(
                '<p><b>Comment:</b> {comments_internal}</p>'
            )
        });
        this.concernsAction = new Ext.ux.grid.RowActions({
            header:'',
            width: 110,
            keepSelection:true,
            actions:[{
                   iconCls:'ui-icon ui-icon-wrench',
                   tooltip:'Edit',
                   scope: this,
                   callback:function(grid, records, action) {
                        grid.ownerCt.loadConcern(records);
                   }
           },{
                   iconCls:'ui-icon ui-icon-trash',
                   tooltip:'Delete',
                   scope: this,
                   callback:function(grid, records, action) {
                        Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function(btn){
                            if(btn === "yes"){
                                Ext.Ajax.request({
                                    method: 'GET',
                                    url: '/json/entity_delete/',
                                    params:{
                                        key: records.data.key,
                                        entity: 'Concerns'
                                    },
                                    scope: this,
                                    success: function(action, options) {
                                        grid.ownerCt.concernsStore.reload();
                                        deleteFunciton(action, options);
                                     }
                                });
                            }
                        }, this);
                   }
           }]
        });
        this.concernsGrid = new Ext.grid.GridPanel({
            store: this.concernsStore,
            enableRowBody: true,
            loadMask: true,
            border: true,
            plugins:[this.expander,this.concernsAction],
            columns: [
                this.expander,this.concernsAction,
                {
                    header   : 'Start Time',
                    width    : 120,
                    sortable : false,
                    dataIndex: 'date_time_start',
                    renderer: formatDate
                },
                {
                    header   : 'End Time',
                    width    : 120,
                    sortable : false,
                    dataIndex: 'date_time_end',
                    renderer: formatDate
                },
                {
                    header   : 'Observer',
                    width    : 140,
                    sortable : false,
                    dataIndex: 'observer_desc'
                },{
                    header   : 'Location',
                    width    : 150,
                    sortable : false,
                    dataIndex: 'terrain_desc'
                },
                {
                    header   : 'Concern',
                    width    : 100,
                    sortable : false,
                    dataIndex: 'expected_avalanche_character_desc'
                },
                {
                    header   : 'Distribution',
                    width    : 100,
                    sortable : false,
                    dataIndex: 'avalanche_distribution_desc'
                },
                {
                    header   : 'Priority',
                    width    : 100,
                    sortable : false,
                    dataIndex: 'concern_priority_desc'
                }
            ],
            stripeRows: true,
            autoHeight: true,
            boxMinHeight: 100,
            tbar: ['->',{
                text: 'Add',
                iconCls: 'add-icon',
                scope: this,
                handler : function(){
                    this.addConcern();
                }
            }],
            bbar: new Ext.PagingToolbar({
                pageSize:PAGING_LIMIT,
                store: this.concernsStore,
                displayInfo: true,
                displayMsg: 'Displaying records {0} - {1} of {2}',
                emptyMsg: "No records to display"
            })
        });
        Ext.applyIf(this, {
            items: [
                this.concernsGrid,
                this.concernsForm
            ]
        });
        pc.custom.ConcernCmp.superclass.initComponent.call(this);

    },
    /*
     ,
                            listeners:{
                                scope: this,
                                change: function(){
                                    this.concernChange();
                                }
                            }
    concernChange: function(){
        chartController.initialRenderSvgCharts();
        var record = new ObservationVO(this.concernsForm.getForm().getValues());
        console.log(record);
        chartController.drawDataSvgCharts(record);
    },*/
    saveConcern: function(){
        if(this.parent){
            this.concernsForm.getForm().setValues({
                terrain: this.parent.mainForm.getForm().getFieldValues().terrain,
                observer: this.parent.mainForm.getForm().getFieldValues().observer
            });
        }
        this.concernsForm.getForm().submit({
            url:this.concernsForm.form_url,
            waitMsg:'Saving Data...',
            params: this.concernsForm.form_params,
            submitEmptyText: false,
            scope: this,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                this.concernsForm.getForm().setValues({
                    key: this.key
                });
                this.concernsForm.hide();
                this.concernsGrid.show();
                this.concernsStore.reload();
                Ext.getCmp('concernSaveButton').enable();
            },
            failure: function(form, action){
                Ext.getCmp('concernSaveButton').enable();
                formFailureFunction();
            }
        });
    },
    loadConcern: function(record){
        if(!chartController){
            chartController = new ChartController();
        }
        this.concernsForm.getForm().loadRecord(record);
        this.concernsForm.show();
        chartController.initialRenderSvgCharts();
        chartController.drawDataSvgCharts(record);
        this.concernsGrid.hide();
    },
    addConcern: function(){
        if(!chartController){
            chartController = new ChartController();
        }
        Ext.StoreMgr.lookup("persistantLayerStore").load();
        var record = new ObservationVO({operation: operation.key,
                                            operation_desc:operation.name,
                                            date_time_start:  (this.parent)?this.parent.mainForm.getForm().getFieldValues().date_time_start: new Date(),
                                            date_time_end:  (this.parent)?this.parent.mainForm.getForm().getFieldValues().date_time_start: new Date(),
                                            observer: (this.parent)?this.parent.mainForm.getForm().getFieldValues().observer: party.key,
                                            terrain: (this.parent)?this.parent.mainForm.getForm().getFieldValues().terrain: null,
                                            subject: (this.parent)?this.parent.mainForm.getForm().getFieldValues().name: null,
                                            created_by: party.key,
                                            created_by_desc: party.name,
                                            created_date: new Date(),
                                            date: new Date()});
        this.concernsForm.getForm().setValues( newRecordForForm(record));
        this.concernsForm.show();
        chartController.initialRenderSvgCharts();
        this.concernsGrid.hide();
    }
});
Ext.reg('concerncmp', pc.custom.ConcernCmp);

function ChartController(){
    var hazardSvgWidth = 300;
    var hazardSvgHeight = 300;

    var svgDivHazardHighAlpine = $('#svg_div_hazard_alpine');
    svgDivHazardHighAlpine.width(hazardSvgWidth);
    svgDivHazardHighAlpine.height(hazardSvgHeight);

    var svgDivHazardAlpine = $('#svg_div_hazard_treeline');
    svgDivHazardAlpine.width(hazardSvgWidth);
    svgDivHazardAlpine.height(hazardSvgHeight);

    var svgDivHazardSubAlpine = $('#svg_div_hazard_below_treeline');
    svgDivHazardSubAlpine.width(hazardSvgWidth);
    svgDivHazardSubAlpine.height(hazardSvgHeight);

    $('#svg_div_hazard_alpine').svg(); // Create svg
    $('#svg_div_hazard_treeline').svg(); // Create svg
    $('#svg_div_hazard_below_treeline').svg(); // Create svg

    powdercloudSvgHazardHighAlpine = new PowdercloudSvgHazard(hazardSvgWidth, hazardSvgHeight);
    $('#svg_div_hazard_alpine').svg({onLoad: powdercloudSvgHazardHighAlpine.drawChart});

    powdercloudSvgHazardAlpine = new PowdercloudSvgHazard(hazardSvgWidth, hazardSvgHeight);
    $('#svg_div_hazard_treeline').svg({onLoad: powdercloudSvgHazardAlpine.drawChart});

    powdercloudSvgHazardSubAlpine = new PowdercloudSvgHazard(hazardSvgWidth, hazardSvgHeight);
    $('#svg_div_hazard_below_treeline').svg({onLoad: powdercloudSvgHazardSubAlpine.drawChart});

}
ChartController.prototype.initialRenderSvgCharts = function(){

    var svgHazardHighAlpine = $('#svg_div_hazard_alpine').svg('get');
    powdercloudSvgHazardHighAlpine.drawChart(svgHazardHighAlpine);

    var svgHazardAlpine = $('#svg_div_hazard_treeline').svg('get');
    powdercloudSvgHazardAlpine.drawChart(svgHazardAlpine);

    var svgHazardSubAlpine = $('#svg_div_hazard_below_treeline').svg('get');
    powdercloudSvgHazardSubAlpine.drawChart(svgHazardSubAlpine);

}

ChartController.prototype.drawDataSvgCharts = function(record){

    var hazardAlpineHigh = new Object();
    // TODO: get color
    hazardAlpineHigh.colour = "#999999"; // type:String
    hazardAlpineHigh.triggerMin = this.translateLikelihood(record.data.likelihood_in_alpine_min_code); // type:Numeric
    hazardAlpineHigh.triggerExpected = this.translateLikelihood(record.data.likelihood_in_alpine_code); // type:Numeric
    hazardAlpineHigh.triggerMax = this.translateLikelihood(record.data.likelihood_in_alpine_max_code); // type:Numeric

    hazardAlpineHigh.sizeMin = this.translateSizeDestructive(record.data.expected_size_in_alpine_min_code); // type:Numeric
    hazardAlpineHigh.sizeExpected = this.translateSizeDestructive(record.data.expected_size_in_alpine_code); // type:Numeric
    hazardAlpineHigh.sizeMax = this.translateSizeDestructive(record.data.expected_size_in_alpine_max_code); // type:Numeric

    var hazardAlpineHighData = new Array();
    hazardAlpineHighData.push(hazardAlpineHigh);

    var hazardAlpine = new Object();
    // TODO: get color
    hazardAlpine.colour = "#999999"; // type:String
    hazardAlpine.triggerMin = this.translateLikelihood(record.data.likelihood_in_treeline_min_code); // type:Numeric
    hazardAlpine.triggerExpected = this.translateLikelihood(record.data.likelihood_in_treeline_code); // type:Numeric
    hazardAlpine.triggerMax = this.translateLikelihood(record.data.likelihood_in_treeline_max_code); // type:Numeric
    hazardAlpine.sizeMin = this.translateSizeDestructive(record.data.expected_size_in_treeline_min_code); // type:Numeric
    hazardAlpine.sizeExpected = this.translateSizeDestructive(record.data.expected_size_in_treeline_code); // type:Numeric
    hazardAlpine.sizeMax = this.translateSizeDestructive(record.data.expected_size_in_treeline_max_code); // type:Numeric
    var hazardAlpineData = new Array();
    hazardAlpineData.push(hazardAlpine);

    var hazardAlpineSub = new Object();
    // TODO: get color
    hazardAlpineSub.colour = "#999999"; // type:String
    hazardAlpineSub.triggerMin = this.translateLikelihood(record.data.likelihood_in_below_treeline_min_code); // type:Numeric
    hazardAlpineSub.triggerExpected = this.translateLikelihood(record.data.likelihood_in_below_treeline_code); // type:Numeric
    hazardAlpineSub.triggerMax = this.translateLikelihood(record.data.likelihood_in_below_treeline_max_code); // type:Numeric
    hazardAlpineSub.sizeMin = this.translateSizeDestructive(record.data.expected_size_in_below_treeline_min_code); // type:Numeric
    hazardAlpineSub.sizeExpected = this.translateSizeDestructive(record.data.expected_size_in_below_treeline_code); // type:Numeric
    hazardAlpineSub.sizeMax = this.translateSizeDestructive(record.data.expected_size_in_below_treeline_max_code); // type:Numeric
    var hazardAlpineSubData = new Array();
    hazardAlpineSubData.push(hazardAlpineSub);

    var svgHazardHighAlpine = $('#svg_div_hazard_alpine').svg('get');
    powdercloudSvgHazardHighAlpine.drawChart(svgHazardHighAlpine);
    powdercloudSvgHazardHighAlpine.drawData(svgHazardHighAlpine, hazardAlpineHighData, false);

    var svgHazardAlpine = $('#svg_div_hazard_treeline').svg('get');
    powdercloudSvgHazardAlpine.drawChart(svgHazardAlpine);
    powdercloudSvgHazardAlpine.drawData(svgHazardAlpine, hazardAlpineData, false);

    var svgHazardSubAlpine = $('#svg_div_hazard_below_treeline').svg('get');
    powdercloudSvgHazardSubAlpine.drawChart(svgHazardSubAlpine);
    powdercloudSvgHazardSubAlpine.drawData(svgHazardSubAlpine, hazardAlpineSubData, false);
}

ChartController.prototype.translateLikelihood = function(likelihoodCode){
    var likelihoodNum = null;
    if (likelihoodCode) {
        switch( likelihoodCode ) {

            case "VU" :
                    likelihoodNum = 1;
                    break;
            case "VU+" :
                    likelihoodNum = 2;
                    break;
            case "U" :
                    likelihoodNum = 3;
                    break;
            case "U+" :
                    likelihoodNum = 4;
                    break;
            case "P" :
                    likelihoodNum = 5;
                    break;
            case "P+" :
                    likelihoodNum = 6;
                    break;
            case "L" :
                    likelihoodNum = 7;
                    break;
            case "L+" :
                    likelihoodNum = 8;
                    break;
            case "AC" :
                    likelihoodNum = 9;
                    break;
        }
    }

    return likelihoodNum;
}

ChartController.prototype.translateSizeDestructive = function(sizeDestructiveCode){
    var sizeDestructiveNum = null;
    if (sizeDestructiveCode) {
        switch( sizeDestructiveCode ) {

            case "1" :
                    sizeDestructiveNum = 1;
                    break;
            case "1.5" :
                    sizeDestructiveNum = 1.5;
                    break;
            case "2" :
                    sizeDestructiveNum = 2;
                    break;
            case "2.5" :
                    sizeDestructiveNum = 2.5;
                    break;
            case "3" :
                    sizeDestructiveNum = 3;
                    break;
            case "3.5" :
                    sizeDestructiveNum = 3.5;
                    break;
            case "4" :
                    sizeDestructiveNum = 4
                    break;
            case "4.5" :
                    sizeDestructiveNum = 4.5;
                    break;
            case "5" :
                    sizeDestructiveNum = 5;
                    break;
        }
    }

    return sizeDestructiveNum;
}
