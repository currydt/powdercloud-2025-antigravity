Ext.apply(Ext.form.VTypes, {
    password: function(val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },
    passwordText: 'Passwords do not match'
});

var inviteForm, detailForm, partyForm , passwordForm,operationAssociationForm,
gridUsers, grids, tableStore, tableStoreInvite, gridInvite, fsContainer,
controller;

function Controller(){
    this.saveCounter = 0;
}
Controller.prototype.editParty = function(record){
    this.record = record;
    fsContainer.show();
    detailForm.show();
    grids.hide();
    passwordForm.getForm().reset();

    partyForm.getForm().loadRecord(record);
    passwordForm.getForm().loadRecord(record);

    this.origRoleTypes = [];

    record.data.roles.each(function(item){
	if(item.get('active') === true){
	    this.origRoleTypes.push(item.data.role_type);
	}
    }, this);
    Ext.getCmp('roles').reset();
    if(this.origRoleTypes.length > 0){
	Ext.getCmp('activeUserCheckbox').setValue(true);
    }	else {
	Ext.getCmp('activeUserCheckbox').setValue(false);
    }
    Ext.getCmp('roles').setValue(this.origRoleTypes.join(','));
}
Controller.prototype.savePartyContinue = function(){
    if(this.saveCounter == 0){
	fsContainer.hide();
	detailForm.hide();
	grids.show();
	gridUsers.getStore().reload();
	gridInvite.getStore().reload();
	Ext.getCmp('saveButton').enable();
    }
};
Controller.prototype.saveParty = function(){
    /*
    partyForm.getForm().submit({
	url:partyForm.form_url,
	waitMsg:'Saving Data...',
	params:partyForm.form_params,
	submitEmptyText: false,
	scope: this,
	success: function(form, action) {
	    var key = Ext.decode(action.response.responseText).key;
	    // MOVED CODE OUT
	},
	failure: function(form, action){
	    Ext.getCmp('saveButton').enable();
	    formFailureFunction();
	}

    });
    */

    this.saveCounter = 0;
    this.currRoleTypes = [];
    var allRoles = Ext.getCmp('roles').getValue();
    if(allRoles.length == 0 && Ext.getCmp('activeUserCheckbox').getValue()){
	Ext.getCmp('saveButton').enable();
	Ext.MessageBox.alert('Missing Information', 'Please select at least one role under the Operation Association.', this);
    }	else {
	var roles = [];
	Ext.each(allRoles, function(item){
	    if(item.getValue()){
		roles.push(item.id);
	    }
	}, this);


	this.toDeleteOperationAssociation = [];
	Ext.each(this.origRoleTypes, function(item){
	    var isStillActive = false;
	    Ext.each(roles,function(selected){
		if(item == selected){
		    isStillActive = true;
		}
	    }, this);
	    if(!isStillActive){
		// delete item
		this.toDeleteOperationAssociation.push(item);
	    }
	    this.origRoleTypes.push(item);
	}, this);

	this.toInsertOperationAssociation = [];
	if(roles.length > 0){
	    Ext.each(roles, function(item){
		var isOrigFound = false;
		Ext.each(this.origRoleTypes, function(origItem){
		    if(origItem == item){
			isOrigFound = true;
		    }
		}, this);
		if(!isOrigFound){
		    // insert item
		    this.toInsertOperationAssociation.push(item);
		}
	    },this);
	}

	this.saveCounter = this.toDeleteOperationAssociation.length+this.toInsertOperationAssociation.length;

	this.savePartyContinue();
	Ext.each(this.toDeleteOperationAssociation, function(item){
	    var record = null;
	    this.record.data.roles.each(function(rec){
		if(rec.data.role_type == item){
		    record = rec;
		}
	    }, this);
	    record.data.active = false;
	    record.set('date_time_end', new Date());
	    Ext.Ajax.request({
		method: 'POST',
		url: operationAssociationForm.form_url,
		scope: this,
		params: Ext.apply(ServerUtils.prepareFieldsForService(record), operationAssociationForm.form_params),
		success: function(){
		    this.saveCounter--;
		    this.savePartyContinue();
		}
	    });
	}, this);
	Ext.each(this.toInsertOperationAssociation, function(item){
	    var record = new PartyOperationAssociationVO({
		operation: operation_id,
		party: this.record.data.key,
		role_type: item,
		date_time_start: new Date(),
		active: true
	    });
	    Ext.Ajax.request({
		method: 'POST',
		url: operationAssociationForm.form_url,
		scope: this,
		params: Ext.apply(ServerUtils.prepareFieldsForService(record), operationAssociationForm.form_params),
		success: function(){
		    this.saveCounter--;
		    this.savePartyContinue();
		}
	    });
	}, this);
	if(Ext.getCmp('resetPwd').getValue() == true) {
	    passwordForm.getForm().submit({
		url:passwordForm.form_url,
		method: 'POST',
		success: function(){
		    Ext.Msg.show({
			title:'Password reset successful',
			msg: 'A password reset email has been sent to the user.',
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.INFO
		    });
		},
		failure: function(form ,action){
		    Ext.Msg.show({
			title:'Password reset error',
			msg: 'There was an error sending a password reset to the user.<br>'+action.result.error,
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.ERROR
		    });
		}
	    });
	}
    }

}
Controller.prototype.invite = function(){

}
Ext.onReady(function(){
    Ext.QuickTips.init();
    /*
        Tabs
    */
    $("#tabs").tabs({
        selected: 1,
        select: jqueryTabClick
    });
    /*
        FORM
    */
    partyForm = new Ext.FormPanel({
        form_url: "/json/entity_save/",
	form_params:{
	    entity: 'Party',
	    form: 'pc.forms.admin.PartyForm'
	},
        defaults: {
            anchor: '0'
        },
	border: false,
        waitMsgTarget: true,
	defaults: {
	    width: 160
	},
        errorReader: new Ext.form.JSONErrorReader(),
        items:[
		{
			    xtype:'container',
			    width: '100%',
			    html:'<p>The following section allows you, the manager to associate a user with your operation. You can save or cancel the changes using the below buttons.</p>'
		},
		{
		    xtype:'hidden',
		    name:'key'
		},
		{
		    xtype:'hidden',
		    name:'operation'
		},
		{
		    fieldLabel: 'First Name',
		    xtype:'displayfield',
		    name: 'first_name',
		    width: 150
		},
		{
		    fieldLabel: 'Surname',
		    xtype:'displayfield',
		    name: 'last_name',
		    width: 150
		},
		{
		    xtype:'displayfield',
		    fieldLabel: 'Registered Email',
		    name: 'email',
		    editable: false,
		    readOnly:true,
		    width: 250
		}
	    ]
    });
    operationAssociationForm = new Ext.FormPanel({
        form_url: "/json/entity_save/",
	form_params:{
	    entity: 'PartyOperationAssociation',
	    form: 'pc.forms.admin.PartyOperationAssociationForm'
	},
	border: false,
        defaults: {
            anchor: '0'
        },
        waitMsgTarget: true,
        errorReader: new Ext.form.JSONErrorReader(),
        items:[
	{
		xtype:'container',
		width: '100%',
		html:'<p>The following section allows you, the manager to activate the assocation of the user with your operation. In addtion, the roles of an active user can be edited. Changes can be saved or cencelled using the below buttons.</p>'
	},
	{
	    xtype: 'checkbox',
	    id: 'activeUserCheckbox',
	    fieldLabel: 'Active?',
	    listeners: {
		check: function(field, checked){
		    if(checked){
			Ext.getCmp('roles').enable();
		    }	else {
			Ext.getCmp('roles').reset();
			Ext.getCmp('roles').disable();
		    }
		}
	    }
	},
	{
	    xtype:'remotecheckboxgroup',
	    id: 'roles',
	    fieldLabel: 'Roles',
		cls:'lblDispBlock remotecheckboxgroup',
	    url: '/json/entity_query_all/',
	    reader: new Ext.data.JsonReader({
		totalProperty: 'totalCount',
		root: 'rows'
	    }, RoleTypeVO),
	    baseParams:{
		entity: 'RoleType'
	    },
	    fieldId: 'key',
	    fieldName: 'key',
	    fieldBoxLabel: 'name',
	    columns: 1,
	    fieldValue: 'key',
	    fieldChecked: '',
	    items:[{boxLabel:'Loading'},{boxLabel:'Loading'}],
	    cbRenderer:function(){
	    },
	    cbHandler:function(chkbox, state ){
	    }

	}]
    });
    passwordForm = new Ext.FormPanel({
        form_url: "/password-reset-admin/",
	border: false,
        defaults: {
            anchor: '0'
        },
        waitMsgTarget: true,
	defaults: {
	    width: 160
	},
        items:[
	{
		    xtype:'container',
		    width: '100%',
		    html:'<p>The following section allows you to issue a password reset action to this user. By checkmaking the box below and Saving, this user will receive an email with details how to reset their password.</p>'
	},
	{
	    name: 'resetPwd',
	    id: 'resetPwd',
	    xtype: 'checkbox',
	    value: false
	}, {
	    name: 'email',
	    xtype: 'hidden'
	}]
    });
    detailForm = new Ext.Panel({
	hidden: true,
	items:[
	    {
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Detail',
                items: [partyForm]
	    },
	    {
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Operation Association',
                items: [operationAssociationForm]
	    }
//	    ,
//	    {
//		xtype:'fieldset',
//                collapsible: true,
//                collapsed: false,
//                width: '75%',
//                title:'Password',
//                items: [passwordForm]
//	    }
	],buttons:[{
            text: 'Save',
	    id: 'saveButton',
            /*iconCls: 'ui-icon-disk',*/
            handler: function(button){
		button.disable();
		controller.saveParty();
            }
        },{
            text: 'Cancel',
            handler: function(){
                fsContainer.hide();
                detailForm.hide();
                grids.show();
            }
        }]
    });



    inviteForm = new Ext.FormPanel({
        form_url: "/admin/operation/inviteDetail///",
        hidden: true,
        defaults: {
            anchor: '0'
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
            width: 160
        },
        items:[{
            xtype: 'container',
            width: '100%',
            html: 'Specify the new user\'s name & email address below. An invite email will be sent'
        },{
            xtype:'hidden',
            name:'key'
        },{
            xtype:'hidden',
            name:'operation'
        },{
	    fieldLabel: 'First name',
	    name: 'first_name',
	    xtype: 'textfield'
	},{
	    fieldLabel: 'Last name',
	    name: 'last_name',
	    xtype: 'textfield'
	},{
	    fieldLabel: 'Email',
	    name: 'email',
	    xtype: 'textfield'
	}],
        buttons:[{
            text: 'Save',
            /*iconCls: 'ui-icon-disk',*/
            handler: function(button){
		button.disable();
                inviteForm.getForm().submit({
                    url:inviteForm.form_url,
                    waitMsg:'Saving Data...',
                    submitEmptyText: false,
                    success: function(form, action) {
                        fsContainer.hide();
                        inviteForm.hide();
                        var key = Ext.decode(action.response.responseText).key;
                        grids.show();
                        gridUsers.getStore().reload();
			gridInvite.getStore().reload();
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
                inviteForm.hide();
                grids.show();
            }
        }]
    });
    /*
        Form Container
    */
    fsContainer = new Ext.Panel({
        title:'',
        hidden:true,
        renderTo:'form-loc',
        plain: true,
        width   : 990,
        defaults:{
            plain: true,
            border: false
        },
        items: [
            inviteForm,
            detailForm
        ]
    });
    /*
        TABLE
    */
    // Create RowActions Plugin
    var actiongrid = new Ext.ux.grid.RowActions({
        header:'',
        width: 110,
        keepSelection:true,
        actions:[
	{
               iconCls:'ui-icon ui-icon-wrench',
               tooltip:'Edit',
               callback:function(grid, records, action) {
		    controller.editParty(records);
               }
       },
       //{
       //        iconCls:'ui-icon ui-icon-locked',
       //        tooltip:'Lock',
       //        callback:function(grid, records, action) {
       //             alert('Lock '+records.data.key)// TODO
       //        }
       //},
       //{
       //        iconCls:'ui-icon ui-icon-trash',
       //        tooltip:'Delete',
       //        callback:function(grid, records, action) {
       //             Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function(btn){
       //                 if(btn == "yes"){
       //                     Ext.Ajax.request({
       //                         method: 'GET',
       //                         url: '/json/entity_delete/',
       //                         params:{
       //                             key: records.data.key,
       //                             entity: 'Operation'
       //                         },
       //                         success: function(){
       //                             tableStore.reload()
       //                         }
       //                     });
       //                 }
       //             });
       //        }
       //}
       ]
    });
    // create the data store
    tableStore = new Ext.data.GroupingStore({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, PartyVO),
	groupField: 'active_group_name',
	baseParams:{
	    det: 'f'
	},
	sortInfo: {
	    field: 'full_name',
	    direction: 'ASC'
	},
	proxy: new Ext.data.ScriptTagProxy({
		url: '/json/operation-party-list/'+operation_id+'/'
	})
    });
    // create the Grid
    gridUsers = new Ext.grid.GridPanel({
        store: tableStore,
        loadMask: true,
        plugins:[actiongrid],
	view: new Ext.grid.GroupingView({
            forceFit:true,
	    hideGroupedColumn : false,
	    showGroupName : false,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Users" : "User"]})'
        }),
        tbar: new Ext.Toolbar({
            items: [
                {
                    xtype: 'textfield',
                    name: 'field1',
		    width: 150,
                    emptyText: 'Search by user name'
                },'->',{
                    text: 'Add',
                    iconCls: 'add-icon',
                    scope: this,
                    handler: function() {
                        var record = new OperationInviteVO({operation: operation_id});
			var fields =  record.fields.items;
			var values = new Object();
			for(var key in fields){
			    var name = fields[key].name;
			    if(record.get(name)){
				values[name] = record.get(name);
			    }	else {
				values[name] = null;
			    }
			}
			inviteForm.getForm().setValues( values);
			fsContainer.show();
			inviteForm.show();
			grids.hide();
                    }
                }
            ]
        }),
        columns: [
            actiongrid,
	    {
                header   : '',
                width    : 300,
                sortable : true,
		hidden : true,
                dataIndex: 'active_group_name'
            },
            {
                header   : 'Name',
                width    : 300,
                sortable : true,
                dataIndex: 'full_name'
            },
	    {
                header   : 'Email',
                width    : 200,
                sortable : true,
                dataIndex: 'email'
            }

        ],
        stripeRows: true,
        height: 400,
        width: '100%'
    });
    /*
        TABLE Invited
    */
    // Create RowActions Plugin
    var actionGridInvite = new Ext.ux.grid.RowActions({
        header:'',
        width: 110,
        keepSelection:true,
        actions:[
		 {
               iconCls:'ui-icon ui-icon-locked',
               tooltip:'Deactivate User',
               callback:function(grid, records, action) {
                    window.location = '/admin/operation/inviteDetail/'+operation_id+'/' + records.data.token + '/';
               }
       }/*,{
               iconCls:'ui-icon ui-icon-edit',
               tooltip:'Activate User',
               callback:function(grid, records, action) {
                    window.location = '/opInviteAccept/'+records.data.token+'/';
               }
       }*/]
    });
    // create the data store
    tableStoreInvite = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, OperationInviteVO),
        remoteSort: true,
        baseParams:{
            entity: 'OperationInvite',
            operation: operation_id,
	    start:0,
            limit:PAGING_LIMIT
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/entity_query_all_paging/'
        })
    });
    // create the Grid
    gridInvite = new Ext.grid.GridPanel({
        store: tableStoreInvite,
        loadMask: true,
        plugins:[actionGridInvite],
        tbar: new Ext.Toolbar({
            items: [
                {
                    xtype: 'textfield',
                    name: 'field1',
		    width: 150,
                    emptyText: 'Search by user name'
                }
            ]
        }),
        columns: [
            actionGridInvite,
            {
                header   : 'Name',
                width    : 300,
                sortable : true,
                dataIndex: 'first_name',
                renderer: function(val, meta, record) {
                    return record.data.last_name+', '+record.data.first_name;
                }
            },{
                id       :'email',
                header   : 'Email',
                width    : 200,
                sortable : false,
                dataIndex: 'email'
            },{
                id       :'date_sent',
                header   : 'Date Sent',
                width    : 100,
                sortable : false,
                dataIndex: 'date_sent'
            }
        ],
        stripeRows: true,
        height: 400,
        width: '100%',
        // paging bar on the bottom
        bbar: new Ext.PagingToolbar({
            pageSize:PAGING_LIMIT,
            store: tableStoreInvite,
            displayInfo: true,
            displayMsg: 'Displaying records {0} - {1} of {2}',
            emptyMsg: "No records to display"
        })
    });
    grids = new Ext.Panel({
	title:'',
	border: false,
        renderTo:'table-loc',
        plain: true,
        width   :990,
        defaults:{
            plain: true,
            border: false
            //width   : '100%',
        },
        items: [
		    {
			xtype: 'fieldset',
			collapsible: true,
			collapsed: false,
			width: 960,
			title: 'Users',
			items: [
			            {
					xtype:'container',
					html:'<p>The following text displays all users within the current operation. To edit user details, just select an icon in the list below. Once selected, to save or cancel changes, just select the appropriate button at the bottom of the form.</p>'
				    },
				    gridUsers
			    ]
		    },
		    {
			xtype: 'fieldset',
			collapsible: true,
			collapsed: true,
			width: 960,
			title: 'Invitations',
			items: [
			            {
					xtype:'container',
					html:'<p>The following text displays all inviations, for the current operation, that have been mailed to users. To delete the invitation, just select an icon in the list below.</p>'
				    },
				    gridInvite
			    ]
		    }

        ]
    });
    tableStoreInvite.load({params:{start:0, limit:PAGING_LIMIT}});
    tableStore.load({params:{start:0, limit:PAGING_LIMIT}});
    controller = new Controller();
});
