Ext.namespace("pc.custom");
pc.custom.ProjectForm = Ext.extend(Ext.Panel, {
    border: false,
    defaults: {
        anchor: '0'
    },
    autoHeight: true,
    
    initComponent: function () {
        Ext.StoreMgr.lookup("observerActive").load();
        this.mainForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            defaults: {
                anchor: '0'
            },
            autoHeight: true,
            border: false,
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items: [{
                xtype:'hidden',
                name:'key'
            },{
                xtype:'hidden',
                name:'operation'
            },{
                xtype:'hidden',
                name:'color'
            },{
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Project Detail',
                items: [{
                    xtype: 'displayfield',
                    name: 'operation_desc',
                    fieldLabel: 'Operation'
                },{
                    fieldLabel: 'Name',
                    name: 'name',
                    xtype: 'textfield',
                    width: 400
                },{
                    fieldLabel: 'Date and time start',
                    name: 'date_time_start',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
                    width: 200
                },{
                    fieldLabel: 'Date and time end',
                    name: 'date_time_end',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
                    width: 200
                },/*{
                    fieldLabel: 'Color',
                    id:'colorPalette',
                    xtype: 'colorpalette',
                    listeners: {
                        select:{
                            scope: this,
                            fn: function(cp, color){
                                fs.getForm().setValues({color: color});
                            }
                        }
                    }
                },*/{
                    xtype:'combo',
                    fieldLabel: 'Status',
                    hiddenName:'status',
                    width: 200,
                    store: new Ext.data.JsonStore({
                        fields: [
                            {name: 'key'},
                            {name: 'value'},
                        ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams : {
                            lookup_code: 'projectstatustypes'
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
                },{
                    xtype:'combo',
                    fieldLabel: 'Lead Party',
                    hiddenName:'lead_party',
                    store: 'observerActive',
                    lastQuery: '',
                    valueField:'key',
                    displayField:'full_name',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true,
                    width: 200
                },{
                    fieldLabel: 'Notes',
                    name: 'notes',
                    xtype: 'textarea',
                    width: 400
                }]
            }]
        });
        Ext.applyIf(this, {
            items: [
            this.mainForm]
        });
        this.buttons = [{
            text: 'Save',
            id: 'saveProjectButton',
            scope: this,
            handler: function(button){
                this.fireEvent('save');
            }
        },{
            text: 'Continue',
            id: 'continueProjectButton',
            scope: this,
            handler: function(button){
                this.fireEvent('continue');
            }
        },{
            text: 'Cancel',
            scope: this,
            handler: function(button){
                this.fireEvent('cancel');
            }
        }];
        pc.custom.ProjectForm.superclass.initComponent.call(this);
    }
});
Ext.reg('projectform', pc.custom.ProjectForm);

pc.custom.ProjectList = Ext.extend(Ext.grid.GridPanel, {
    stripeRows: true,
    height: 400,
    width: '100%',
    initComponent: function(){
        this.tbar = new Ext.Toolbar({
            items: [
                '->',{
                    text: 'Add',
                    iconCls: 'add-icon',
                    scope: this,
                    handler: function() {
                        this.fireEvent('add');
                    }
                }
            ]
        });
        var action = new Ext.ux.grid.RowActions({
            header:'',
            width: 110,
            keepSelection:true,
            actions:[{
                iconCls:'ui-icon ui-icon-wrench',
                tooltip:'Edit',
                callback:function(grid, records, action) {
                     grid.fireEvent('edit', records);
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
                                     entity: 'Project'
                                 },
                                 success: function(action, options) {
                                    tableStore.reload();
                                    deleteFunciton(action, options);
                                 }
                             });
                         }
                     });
                }
           }]
        });

        // create the data store
        var tableStore = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, ProjectVO),
            remoteSort: true,
            autoLoad: true,
            baseParams:{
                entity: 'Project',
                start:0,
                limit:PAGING_LIMIT
            },
            //autoLoad: true,
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all_paging/'
            })
        });
        var expander = new Ext.ux.grid.RowExpander({
            tpl: new Ext.Template('<p><b>Comment:</b> {notes}</p>')
        });
        Ext.applyIf(this, {
            store: tableStore,
            plugins:[action, expander],
            columns: [
                expander,
                action,
                {
                    header   : 'Date and Time',
                    width    : 200,
                    sortable : false,
                    dataIndex: 'date_time_start',
                    renderer: formatDate
                },{
                    header   : 'Name',
                    width    : 140,
                    sortable : false,
                    dataIndex: 'name'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize:PAGING_LIMIT,
                store: tableStore,
                displayInfo: true,
                displayMsg: 'Displaying records {0} - {1} of {2}',
                emptyMsg: "No records to display"
            })
        });
        pc.custom.ProjectList.superclass.initComponent.call(this);
    }
});
Ext.reg('projectlist', pc.custom.ProjectList);
