var detailForm = new Ext.FormPanel({
    form_url: "/json/entity_save/",
    defaults: {
        anchor: '0'
    },
    waitMsgTarget: true,
    errorReader: new Ext.form.JSONErrorReader(),
    defaults: {
        width: 160
    },
    items:[
    {
        xtype:'hidden',
        name:'key'
    },

    // System Detail Fieldset
    {
        xtype:'fieldset',
        collapsible: true,
        collapsed: false,
        width: '75%',
        title:'System Details',
        items: [
            {
		    xtype:'container',
		    html:'<p>The following section fields are used by the system to present your operation to your users and to users that have shared access to your operation (for example, they can see your name and operation type. It also contains settings to customize your operation (for example, the preferred unit types).</p>'
	    },
            {
                fieldLabel: 'Name',
                name: 'name',
                xtype: 'textfield',
                //readOnly: true,
                width: 200
            },
            {
                xtype:'combo',
                hiddenName:'type',
                fieldLabel: 'Type',
                store: new Ext.data.JsonStore({
                    fields: [
                        {name: 'key'},
                        {name: 'value'},
                    ],
                    autoLoad: true,
                    root: 'rows',
                    baseParams : {
                        lookup_code: 'operationtypes'
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
                width: 200
            },
            {
                xtype:'combo',
                hiddenName:'guideline',
                fieldLabel: 'Guidelines',
                store: new Ext.data.JsonStore({
                    fields: [
                        {name: 'key'},
                        {name: 'value'},
                    ],
                    autoLoad: true,
                    root: 'rows',
                    baseParams : {
                        lookup_code: 'guideline'
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
                width: 200
            },
            {
                fieldLabel: 'Metric data ?',
                name: 'metric_data',
                xtype: 'checkbox',
                width: 100
            },
           // Exchange Directory

      //{
            //    fieldLabel: 'Trip paypal email address',
            //    name: 'trip_paypal_email_address',
            //    xtype: 'textfield'
            //}
        ]
    },

    {
        xtype:'fieldset',
        collapsible: true,
        collapsed: false,
        width: '75%',
        title:'Operation Details',
        items: [
			{
				xtype:'container',
				html:'<p>The following section contains the address and contact information for the selected operation.</p>'
			},

			{
				fieldLabel: 'Address 1',
				name: 'address_line_1',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: 'Address 2',
				name: 'address_line_2',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: 'Address 3',
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
				fieldLabel: 'Email Address',
				name: 'email',
				xtype: 'textfield',
				width: 405
			},
			{
				fieldLabel: 'Phone',
				name: 'phone',
				xtype: 'textfield',
				width: 405
			}
		]
    },

    // Data Sharing
    {
        xtype:'fieldset',
        collapsible: true,
        collapsed: true,
        width: '75%',
        title:'Data Sharing Preferences',
        items: [
            {
		    xtype:'container',
		   // html:'<p>The following section allows general sharing preferences to be enabled or disabled (for example, the "publish in data exchange" allows users to share their data with your operation). Specific sharing details can be found in the documentation.</p>'
		    html:'<p>The following section allows general sharing preferences to be enabled or disabled. Specific sharing details can be found in the documentation.</p>'
	    },

            // Exchange Directory

            {
                xtype:'fieldset',
                collapsible: false,
                collapsed: false,
                width: '75%',
                title:'Publish in Observation Data Exchange Directory',
                items: [
                            {
                                 xtype:'container',
                                html:'<p>If checked, the Operation name will be published in a list of Operations that all other Operation administrators can see. That list enables them to export their Observation data to you.</p>'
                            },
                            {
                                fieldLabel: 'Publish data exchange?',
                                name: 'publish_data_exchange',
                                xtype: 'checkbox',
                                width: 100
                            }
                        ]
            },

            // Weather Badge Sharing
            {
                xtype:'fieldset',
                collapsible: false,
                collapsed: false,
                width: '75%',
                title:'Publish Observation data',
                items: [
                            {
                                 xtype:'container',
                                html:'<p>If checked, the operation weather data can be accessed using the Powdercloud Weather Badge (public, unrestricted, access).</p>'
                            },
                            {
                                fieldLabel: 'Publish Weather Badge?',
                                name: 'publish_weather',
                                xtype: 'checkbox',
                                width: 100
                            },
                            {
                                 xtype:'container',
                                html:'<p>If checked, the observation data can be accessed using the Powdercloud Reports (public, unrestricted, access).</p>'
                            },
                            {
                                fieldLabel: 'Publish Observations?',
                                name: 'publish_web',
                                xtype: 'checkbox',
                                width: 100
                            }
                         ]
                    },

            // Avalanche Hazard Forecast Sharing
            {
                xtype:'fieldset',
                collapsible: false,
                collapsed: false,
                width: '75%',
                title:'Publish Avalanche Hazard Forecast Data',
                items: [
                            {
                                 xtype:'container',
                                html:'<p>If checked, the operation avalanche hazaad forecast data can be accessed using the Powdercloud Hazard Forecast (public, unrestricted, access).</p>'
                            },
                            {
                                fieldLabel: 'Publish forecast data?',
                                name: 'publish_hazard_forecast',
                                xtype: 'checkbox',
                                width: 80
                            }
                        ]
                    }
                ]
            },

            {
             xtype:'fieldset',
             collapsible: true,
             collapsed: true,
             width: '75%',
             title:'Operation Packages',
             items: [
			    {
			    xtype:'container',
			    html:'<p>These items are required for an InfoEx User to perform a submission. These are received from the InfoEx Administrator, and copied to the below fields.</p>'
			    },
			    {
				fieldLabel: 'InfoEx Operation',
				name: 'infoex_alias',
				xtype: 'textfield',
				width: 200
			    },
			    {
				fieldLabel: 'InfoEx User Name',
				name: 'infoex_username',
				xtype: 'textfield',
				width: 200
			    },
			    {
				fieldLabel: 'InfoEx Password',
				name: 'infoex_password',
				// vtype: 'password',
				xtype: 'textfield',
				width: 200
			    }
			]
            }
	],
    buttons:[{
        text: 'Save',
	id: 'saveButton',
        handler: function(button){
	    button.disable();
            detailForm.getForm().submit({
                url:detailForm.form_url,
                waitMsg:'Saving Data...',
                params:{
                    entity: 'Operation',
                    form: 'pc.forms.admin.OperationForm'
                },
                submitEmptyText: false,
                success: function(form, action) {
                    detailForm.fireEvent('saved', action);
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
            detailForm.fireEvent('cancel');
        }
    }]
});
