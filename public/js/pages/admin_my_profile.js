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

var detailForm, partyForm , passwordForm, controller;

function Controller(){
}

Controller.prototype.saveParty = function(){
	partyForm.getForm().submit({
		url:partyForm.form_url,
		waitMsg:'Saving Data...',
		params:partyForm.form_params,
		submitEmptyText: false,
		scope: this,
		success: function(form, action) {
			var key = Ext.decode(action.response.responseText).key;
			Ext.getCmp('saveButton').enable();
		},
		failure: function(form, action){
			Ext.getCmp('saveButton').enable();
			formFailureFunction();
		}
	});
	if(passwordForm.getForm().getValues().password != "" || passwordForm.getForm().getValues()['pass-cfrm'] != ""){
		var passwordFormValid = passwordForm.getForm().isValid();
		if (passwordFormValid) {
			passwordForm.getForm().submit({
				url:passwordForm.form_url,
				waitMsg:'Saving Data...',
				submitEmptyText: false,
				scope: this
			});
		}
	}
	else {
		passwordForm.getForm().clearInvalid();
	}
}

Ext.onReady(function(){
	Ext.QuickTips.init();

	// FORM
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
		defaults: { width: 160 },
		errorReader: new Ext.form.JSONErrorReader(),
		items:[
			{
				xtype:'container',
				width: '100%',
				html:'<p>The following section allows you, the user to update personal data (for example, address or phone numbers). These are saved using the below buttons. It should be noted the email address cannot be altered, as it is used for system identification.</p>'
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
				xtype:'hidden',
				name:'active'
			},
			{
				fieldLabel: 'First Name',
				xtype:'textfield',
				name: 'first_name',
				width: 150
			},
			{
				fieldLabel: 'Surname',
				xtype:'textfield',
				name: 'last_name',
				width: 150
			},
			{
				xtype:'textfield',
				fieldLabel: 'Registered Email',
				name: 'email',
				editable: false,
				readOnly:true,
				width: 250
			},
			/*
			{
				fieldLabel: 'Date of birth',
				name: 'date_of_birth',
				xtype: 'datetimefield',
				dateFormat: 'Y-m-d',
				timeFormat: 'H:i'
			},
			*/
			{
				xtype:'combo',
				fieldLabel: 'Gender',
				hiddenName:'gender',
				width: 75,
				store: new Ext.data.JsonStore({
					fields: [
						{name: 'key'},
						{name: 'value'},
					],
					autoLoad: true,
					root: 'rows',
					baseParams : {
						lookup_code: 'gender'
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
				fieldLabel: 'Address',
				name: 'address_line_1',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: '      ',
				name: 'address_line_2',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: '      ',
				name: 'address_line_3',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: 'City',
				name: 'address_city',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: 'State',
				name: 'address_state',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: 'Zip',
				name: 'address_zip',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: 'Country',
				name: 'address_country',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: 'Cell phone',
				name: 'phone_cell',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: 'Work phone',
				name: 'phone_work',
				xtype: 'textfield',
				width: 405
			}
		]
	});

	passwordForm = new Ext.FormPanel({
		form_url: "/json/change_password/",
		border: false,
		defaults: { anchor: '0' },
		waitMsgTarget: true,
		defaults: { width: 160 },
		errorReader: new Ext.form.JSONErrorReader(),
		defaults: { width: 175 },
		items:[
			{
				fieldLabel: 'New Password',
				xtype: 'textfield',
				inputType: 'password',
				name: 'password',
				id: 'pass',
				allowBlank: false,
				required: true,
				maxLength: 30
			},
			{
				xtype: 'textfield',
				inputType: 'password',
				fieldLabel: 'Confirm Password',
				name: 'pass-cfrm',
				vtype: 'password',
				allowBlank: false,
				required: true,
				maxLength: 30,
				initialPassField: 'pass', // id of the initial password field
				listeners:{
					blur:{
						scope:this,
						fn:function(){
							passwordForm.getForm().isValid();
						}
					}
				}
			}
		]
	});

	detailForm = new Ext.Panel({
		title:'',
		renderTo:'form-loc',
		plain: true,
		width: '100%',
		style: { padding: '5px' },
		border: false,
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
				title:'Password',
				items: [passwordForm]
			}
		],
		buttons:[
			{
				text: 'Save',
				id: 'saveButton',
				/*iconCls: 'ui-icon-disk',*/
				handler: function(button){
					button.disable();
					controller.saveParty();
				}
			}
		]
	});

	controller = new Controller();
	partyForm.getForm().load({
		url:'/json/entity_query_single/',
		params:{
			entity: 'Party',
			key: party.key
		},
		waitMsg:'Loading'
	});
});

