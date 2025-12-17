function Controller() {
    this.projectRecord = null;

    this.mainList = new pc.custom.ActivityList({
        itemId: 'mainList'
    });
    this.mainDetail = new pc.custom.ActivityForecastForm({
        itemId: 'mainDetail'
    });

    this.mainContainer = new Ext.Panel({
        renderTo: 'ext-loc',
        plain: true,
        width: '100%',
        border: false,
        layout: 'card',
        activeItem: 0,
        defaults: {
            plain: true,
            width: '100%'
        },
        items: [
            this.mainList,
            this.mainDetail
        ],
        listeners: {
            scope: this,
            render: function() {
                this.init();
            }
        }
    });
}
Controller.prototype.init = function() {
    this.mainList.on('add', this.addActivity, this);
    this.mainList.on('edit', this.editActivity, this);
    this.mainDetail.on('save', this.saveActivity, this);
    this.mainDetail.on('continue', this.continueActivity, this);
    this.mainDetail.on('dataSaved', this.saveActivityRecord, this);
    this.mainDetail.on('cancel', this.cancelActivity, this);
    this.mainDetail.projectCombo.show();
}
Controller.prototype.cancelActivity = function() {
    this.mainContainer.getLayout().setActiveItem('mainList');
    this.mainList.getStore().reload();
}
Controller.prototype.addActivity = function() {
    this.editActivity(new ActivityVO({
        date_time_start: new Date(),
        observer: party.key,
        created_by_desc: party.name,
        operation_desc: operation.name
    }));
}
Controller.prototype.editActivity = function(record) {
    if (this.mainDetail.storesToLoad.concat(['projects'])) {
        Ext.each(this.mainDetail.storesToLoad.concat(['projects']), function(storeName) {
            var store = Ext.StoreMgr.lookup(storeName);
            if (store.getCount() == 0) {
                Ext.StoreMgr.lookup(storeName).load();
            }
        }, this);
    }
    this.mainDetail.mainForm.getForm().setValues(newRecordForForm(record));
    this.mainDetail.mainForm.fireEvent('setValue');
    if (record.data.key) {
        if (this.mainDetail.continueButton) {
            // has continue step
            this.mainDetail.formState('update');
            this.mainDetail.loadData();
        }   else {
            this.mainDetail.saveButton.enable();
        }
        // activity exists on server
    } else {
        if (this.mainDetail.continueButton) {
            // has continue step
            this.mainDetail.formState('create');
        } else {
            // doesn't have continue step
            this.mainDetail.saveButton.enable();
        }
    }
    this.mainDetail.mainForm.getForm().clearInvalid();
    this.mainContainer.getLayout().setActiveItem('mainDetail');
}
Controller.prototype.continueActivity = function() {
    if (this.mainDetail.continueButton && this.mainDetail.continueButton.isVisible()) {
        if(this.mainDetail.mainForm.getForm().isValid()){
            this.mainDetail.resetForms();
            this.mainDetail.formState('update');
        }  else {
            formFailureFunction();
        }
    }
}
Controller.prototype.saveActivity = function() {
    if(this.mainDetail.mainForm.getForm().isValid()){
        this.mainDetail.saveData();
    }
}
Controller.prototype.saveActivityRecord = function() {
    this.mainDetail.saveButton.disable();
    this.mainDetail.mainForm.getForm().submit({
        url: this.mainDetail.mainForm.form_url,
        scope: this,
        waitMsg: 'Saving Data...',
        params: this.mainDetail.mainForm.params,
        submitEmptyText: false,
        success: function(form, action) {
            var key = Ext.decode(action.response.responseText).key;
            this.mainDetail.mainForm.getForm().setValues({
                key: key
            });
            var recordServerJSON = Ext.decode(action.response.responseText).record;
            var record = this.mainList.getStore().reader.extractData([recordServerJSON], true)[0];
            this.cancelActivity();
            this.mainDetail.saveButton.enable();
        },
        failure: function(form, action) {
            this.mainDetail.saveButton.enable();
            formFailureFunction();
        }
    });
}
Ext.onReady(function() {
    Ext.QuickTips.init();
    var controller = new Controller();
});

pc.custom.ActivityList = Ext.extend(Ext.grid.GridPanel, {
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
                                     entity: 'Activity'
                                 },
                                 success: function(action, options) {
				    tableStore.reload()
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
            }, ActivityVO),
            remoteSort: true,
            autoLoad: true,
            baseParams:{
                entity: 'Activity',
                type__ActivityType__lookup: 'hazfore',
                start:0,
                limit:PAGING_LIMIT
            },
            //autoLoad: true,
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all_paging/'
            })
        });
        var expander = new Ext.ux.grid.RowExpander({
            tpl: new Ext.Template('<p><b>Comment:</b> {comments_internal}</p>')
        });
        Ext.applyIf(this, {
            store: tableStore,
            plugins:[action, expander],
            columns: [
                expander,
                action,
                {
                    header   : 'Subject',
                    width    : 120,
                    sortable : false,
                    dataIndex: 'name'
                },
                {
                    header   : 'Forecast Date',
                    sortable : false,
                    dataIndex: 'date_time_start',
                    width: 120,
                    renderer: formatDate
                },
                {
                    header   : 'Forecaster',
                    width    : 120,
                    sortable : false,
                    dataIndex: 'observer_desc'
                },
                {
                    header   : 'Notable',
                    width    : 120,
                    sortable : false,
                    dataIndex: 'notable'
                },
                {
                    id       :'hazard_temporal_scale',
                    header   : 'Temporal Scale',
                    width    : 100,
                    sortable : false,
                    dataIndex: 'temporal_scale_desc'
                },
                {
                    id       :'hazard_spatial',
                    header   : 'Spatial Scale',
                    width    : 100,
                    sortable : false,
                    dataIndex: 'spatial_scale_desc'
                },
                {
                    header   : 'Confidence',
                    width    : 120,
                    sortable : false,
                    dataIndex: 'confidence_desc'
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
        pc.custom.ActivityList.superclass.initComponent.call(this);
    }
});
