var fs, grid, tableStore, fsContainer, operationTerrainUtil;

Ext.onReady(function () {
	console.log('observation.js: Ext.onReady started');
	Ext.QuickTips.init();
	var observerStore = Ext.StoreMgr.lookup("observerActive");
	console.log('observerActive store:', observerStore);
	if (observerStore) {
		observerStore.load();
	} else {
		console.error('observerActive store NOT FOUND!');
	}
	// FORM
	console.log('About to create FormPanel');
	console.log('Ext.FormPanel:', Ext.FormPanel);
	console.log('Ext.data.XmlReader:', Ext.data.XmlReader);

	fs = new Ext.FormPanel({
		form_url: "/json/entity_save/",
		defaults: {
			anchor: '0'
		},
		waitMsgTarget: true,
		reader: new Ext.data.XmlReader({
			record: 'record',
			success: 'success'
		},
			[
				{ name: 'operation' }
			]
		),
		// errorReader: new Ext.form.JSONErrorReader(),
		defaults: {
			width: 160
		},
		items: [
			{
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
				id: 'operation',
				name: 'operation'
			},
			{
				xtype: 'hidden',
				itemId: 'created_by',
				id: 'created_by',
				name: 'created_by'
			},
			// Operation
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Operation',
				items: [
					{
						xtype: 'container',
						html: '<p>The following table displays the avalanche fields in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
					},
					{
						xtype: 'displayfield',
						fieldLabel: 'Operation',
						width: 200,
						id: 'operation_desc'
					},
					//{
					//	xtype: 'displayfield',
					//	fieldLabel: 'Data Recorder',
					//	id:'created_by_desc',
					//	width: 200
					//},
					{
						xtype: 'combo',
						fieldLabel: 'Observer',
						hiddenName: 'observer',
						id: 'observerCombo',
						width: 200,
						store: 'observerActive',
						lastQuery: '',
						valueField: 'key',
						displayField: 'full_name',
						editable: false,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus: true
					},
					{
						fieldLabel: 'Notable',
						name: 'notable',
						xtype: 'checkbox',
						width: 100
					},
					{
						fieldLabel: 'Description',
						name: 'subject',
						xtype: 'textfield',
						width: 600
					}
				]
			},
			/*
			// Scope
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Scope',
				items: [
					{
						xtype: 'container',
						html: '<p>The following table displays the avalanche fields in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
					},
					{
						fieldLabel: 'Date and time',
						name: 'date_time_start',
						xtype: 'datetimefield',
						dateFormat: 'Y-m-d',
						timeFormat: 'H:i',
						width: 200
					},
					{
						xtype: 'combo',
						fieldLabel: 'Location',
						id: 'location',
						hiddenName: 'terrain',
						store: new Ext.data.Store({
							reader: new Ext.data.JsonReader({
								root: 'rows'
							}, TerrainVO),
							root: 'rows',
							baseParams: {
								entity: 'Terrain',
								det: 'k',
								active: 'True',
								sort: 'name_nick',
								dir: 'ASC',
								allowBlankRecord: true
							},
							proxy: new Ext.data.ScriptTagProxy({
								url: '/json/entity_query_all/'
							})
						}),
						valueField: 'key',
						displayField: 'name_nick',
						editable: false,
						triggerAction: 'all',
						mode: 'local',
						width: 200,
						selectOnFocus: true
					},
				]
			},
			// General
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'General Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The General....</p>'
					}
				]
			},
			// Avalanche
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Avalanche Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The Avalanche....</p>'
					}
				]
			},
			// Concerns
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Concerns Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The Concerns ....</p>'
					}
				]
			},
			// Layers
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Layer Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The Layers ....</p>'
					}
				]
			},
			// Layers History
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Layer History Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The Layer History ....</p>'
					}
				]
			},
			// Snowpack Structure
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Snowpack Structure Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The Snowpack Structure ....</p>'
					}
				]
			},
			// Newss
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'News Details',
				items: [
					{
						xtype: 'container',
						html: '<p>News Details</p>'
					}
				]
			},
			// Snow Profile
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Snow Profile Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The Snow Profile ....</p>'
					}
				]
			},
			// Snow Profile Layers
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Snow Profile Layers Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The Snow Profile Layers ....</p>'
					}
				]
			},
			// Snow Profile Temperatures
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Snow Profile Temerature Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The Snow Profile Temperature ....</p>'
					}
				]
			},
			// Snow Profile Tests
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Snow Profile Tests Details',
				items: [
					{
						xtype: 'container',
						html: '<p>The Snow Profile Tests ....</p>'
					}
				]
			},
			// Ratings Danger
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Ratings Danger Details',
				items: [
					{
						xtype: 'container',
						html: '<p>Ratings Danger Details. The following table displays the avalanche fields in textual format. </p>'
					},
					{
						xtype: 'compositefield',
						msgTarget: 'side',
						height: 30,
						fieldLabel: 'Below Treeline',
						cls: 'composite-field',
						width: '100%',
						items: [
							{
								xtype: 'combo',
								hiddenName: 'danger_scale_below_treeline',
								width: 200,
								store: new Ext.data.JsonStore(
									{
										fields: [
											{ name: 'key' },
											{ name: 'value' },
										],
										autoLoad: true,
										root: 'rows',
										baseParams: {
											lookup_code: 'dangerscale',
											allowBlankRecord: true
										},
										proxy: new Ext.data.ScriptTagProxy({
											url: '/json/lookup_query_all/'
										})
									}
								),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								typeAhead: true,
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Remark',
								width: 60
							},
							{
								name: 'remark_below_treeline',
								xtype: 'textfield'
							}
						]
					},
					{
						xtype: 'compositefield',
						msgTarget: 'side',
						height: 30,
						fieldLabel: 'Treeline',
						cls: 'composite-field',
						width: '100%',
						items: [
							{
								xtype: 'combo',
								hiddenName: 'danger_scale_treeline',
								width: 200,
								store: new Ext.data.JsonStore(
									{
										fields: [
											{ name: 'key' },
											{ name: 'value' },
										],
										autoLoad: true,
										root: 'rows',
										baseParams: {
											lookup_code: 'dangerscale',
											allowBlankRecord: true
										},
										proxy: new Ext.data.ScriptTagProxy({
											url: '/json/lookup_query_all/'
										})
									}
								),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Remark',
								width: 60
							},
							{
								name: 'remark_treeline',
								xtype: 'textfield'
							}
						]
					},
					{
						xtype: 'compositefield',
						msgTarget: 'side',
						height: 30,
						fieldLabel: 'Alpine',
						cls: 'composite-field',
						width: '100%',
						items: [
							{
								xtype: 'combo',
								hiddenName: 'danger_scale_alpine',
								width: 200,
								store: new Ext.data.JsonStore(
									{
										fields: [
											{ name: 'key' },
											{ name: 'value' },
										],
										autoLoad: true,
										root: 'rows',
										baseParams: {
											lookup_code: 'dangerscale',
											allowBlankRecord: true
										},
										proxy: new Ext.data.ScriptTagProxy({
											url: '/json/lookup_query_all/'
										})
									}
								),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Remark',
								width: 60
							},
							{
								name: 'remark_alpine',
								xtype: 'textfield'
							}
						]
					}
				]
			},
			// Ratings Stability
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Ratings Stability Details',
				items: [
					{
						xtype: 'container',
						html: '<p>Ratings Stability Details. The following table displays the avalanche fields in textual format. </p>'
					},
					{
						xtype: 'compositefield',
						msgTarget: 'side',
						height: 30,
						fieldLabel: 'Below Treeline',
						cls: 'composite-field',
						width: '100%',
						items: [
							{
								xtype: 'combo',
								hiddenName: 'stability_scale_below_treeline',
								width: 200,
								store: new Ext.data.JsonStore(
									{
										fields: [
											{ name: 'key' },
											{ name: 'value' },
										],
										autoLoad: true,
										root: 'rows',
										baseParams: {
											lookup_code: 'stabilityratingscale',
											allowBlankRecord: true
										},
										proxy: new Ext.data.ScriptTagProxy({
											url: '/json/lookup_query_all/'
										})
									}
								),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Remark',
								width: 60
							},
							{
								name: 'remark_below_treeline',
								xtype: 'textfield'
							}
						]
					},
					{
						xtype: 'compositefield',
						msgTarget: 'side',
						height: 30,
						fieldLabel: 'Treeline',
						cls: 'composite-field',
						width: '100%',
						items: [
							{
								xtype: 'combo',
								hiddenName: 'stability_scale_treeline',
								width: 200,
								store: new Ext.data.JsonStore(
									{
										fields: [
											{ name: 'key' },
											{ name: 'value' },
										],
										autoLoad: true,
										root: 'rows',
										baseParams: {
											lookup_code: 'stabilityratingscale',
											allowBlankRecord: true
										},
										proxy: new Ext.data.ScriptTagProxy({
											url: '/json/lookup_query_all/'
										})
									}
								),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Remark',
								width: 60
							},
							{
								name: 'remark_treeline',
								xtype: 'textfield'
							}
						]
					},
					{
						xtype: 'compositefield',
						msgTarget: 'side',
						height: 30,
						fieldLabel: 'Alpine',
						cls: 'composite-field',
						width: '100%',
						items: [
							{
								xtype: 'combo',
								hiddenName: 'stability_scale_alpine',
								width: 200,
								store: new Ext.data.JsonStore(
									{
										fields: [
											{ name: 'key' },
											{ name: 'value' },
										],
										autoLoad: true,
										root: 'rows',
										baseParams: {
											lookup_code: 'stabilityratingscale',
											allowBlankRecord: true
										},
										proxy: new Ext.data.ScriptTagProxy({
											url: '/json/lookup_query_all/'
										})
									}
								),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Remark',
								width: 60
							},
							{
								name: 'remark_alpine',
								xtype: 'textfield'
							}
						]
					},
					{
						xtype: 'combo',
						fieldLabel: 'Stability Trending',
						hiddenName: 'stability_trending',
						store: new Ext.data.JsonStore({
							fields: [
								{ name: 'key' },
								{ name: 'code_value' },
							],
							autoLoad: true,
							root: 'rows',
							baseParams: {
								lookup_code: 'stabilitytrending',
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
						selectOnFocus: true,
						width: 265
					}
				]
			},
			// Weather
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Weather',
				items: [
					{
						xtype: 'container',
						html: '<p>The Weather.</p>'
					}
				]
			},
			// Weather Forecasts
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Weather Forecast',
				items: [
					{
						xtype: 'container',
						html: '<p>The Weather Forecasts.This section provides the standard forecast weather that is set the location, date, and forecaster completing this evaluation.</p>'
					},
					{
						fieldLabel: 'Weather Systems and 500 mb flow',
						name: 'weather_sysyem_flow_500_mb',
						xtype: 'textarea',
						width: 500
					},
					{
						fieldLabel: 'Freezing Level',
						name: 'elevation_freezing_level',
						xtype: 'numberfield',
						width: 200
					},
					{
						xtype: 'compositefield',
						msgTarget: 'side',
						height: 30,
						fieldLabel: '850 mb',
						cls: 'composite-field',
						width: '100%',
						items: [
							{
								xtype: 'displayfield',
								value: 'Wind direction',
								width: 60
							},
							{
								xtype: 'combo',
								hiddenName: 'actuals_wind_direction_850_mb',
								width: 100,
								store: new Ext.data.JsonStore({
									fields: [
										{ name: 'key' },
										{ name: 'value' }
									],
									autoLoad: true,
									root: 'rows',
									baseParams: {
										lookup_code: 'aspect'
									},
									proxy: new Ext.data.ScriptTagProxy({
										url: '/json/lookup_query_all/'
									})
								}),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Wind speed',
								width: 60
							},
							{
								xtype: 'combo',
								hiddenName: 'actuals_wind_speed_850_mb',
								width: 100,
								store: new Ext.data.JsonStore({
									fields: [
										{ name: 'key' },
										{ name: 'value' }
									],
									autoLoad: true,
									root: 'rows',
									baseParams: {
										lookup_code: "windspeedestimation" + (isOperationSWAG ? "_swag" : "")
									},
									proxy: new Ext.data.ScriptTagProxy({
										url: '/json/lookup_query_all/'
									})
								}),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Temperature',
								width: 100
							},
							{
								name: 'actuals_air_temperature_present_850_mb',
								width: 105,
								xtype: 'numberfield'

							},
							{
								xtype: 'displayfield',
								value: 'Dew Point',
								width: 60
							},
							{
								name: 'actuals_due_point_850_mb',
								width: 105,
								xtype: 'numberfield'
							}
						]
					},
					{
						xtype: 'compositefield',
						msgTarget: 'side',
						height: 30,
						fieldLabel: '700 mb',
						cls: 'composite-field',
						width: '100%',
						items: [
							{
								xtype: 'displayfield',
								value: 'Wind direction',
								width: 60
							},
							{
								xtype: 'combo',
								hiddenName: 'actuals_wind_direction_700_mb',
								width: 100,
								store: new Ext.data.JsonStore({
									fields: [
										{ name: 'key' },
										{ name: 'value' }
									],
									autoLoad: true,
									root: 'rows',
									baseParams: {
										lookup_code: 'aspect'
									},
									proxy: new Ext.data.ScriptTagProxy({
										url: '/json/lookup_query_all/'
									})
								}),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Wind speed',
								width: 60
							},
							{
								xtype: 'combo',
								hiddenName: 'actuals_wind_speed_700_mb',
								width: 100,
								store: new Ext.data.JsonStore({
									fields: [
										{ name: 'key' },
										{ name: 'value' }
									],
									autoLoad: true,
									root: 'rows',
									baseParams: {
										lookup_code: "windspeedestimation" + (isOperationSWAG ? "_swag" : "")
									},
									proxy: new Ext.data.ScriptTagProxy({
										url: '/json/lookup_query_all/'
									})
								}),
								valueField: 'key',
								displayField: 'value',
								editable: false,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus: true
							},
							{
								xtype: 'displayfield',
								value: 'Temperature',
								width: 100
							},
							{
								name: 'actuals_air_temperature_present_700_mb',
								width: 105,
								xtype: 'numberfield'

							},
							{
								xtype: 'displayfield',
								value: 'Dew Point',
								width: 60
							},
							{
								name: 'actuals_due_point_700_mb',
								width: 105,
								xtype: 'numberfield'
							}]
					},
					{
						xtype: 'compositefield',
						fieldLabel: 'Precipitation Type & Rate',
						msgTarget: 'side',
						height: 30,
						cls: 'composite-field',
						width: '100%',
						items: [{
							xtype: 'combo',
							hiddenName: 'precipitation_type_rate',
							width: 265,
							store: new Ext.data.Store({
								reader: new Ext.data.JsonReader({
									root: 'rows'
								}, LookupVO),
								autoLoad: true,
								baseParams: {
									lookup_code: 'precipitationtyperate'
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
							selectOnFocus: true,
							cascadeComboId: 'precipitation_type_rate_minor'
						},
						{
							xtype: 'combo',
							hiddenName: 'precipitation_type_rate_minor',
							id: 'precipitation_type_rate_minor',
							width: 265,
							store: new Ext.data.Store({
								reader: new Ext.data.JsonReader({
								}, LookupVO)
							}),
							valueField: 'key',
							displayField: 'code_value',
							editable: false,
							triggerAction: 'all',
							mode: 'local',
							selectOnFocus: true
						}]
					},
					{
						xtype: 'compositefield',
						msgTarget: 'side',
						height: 30,
						fieldLabel: 'Wind',
						cls: 'composite-field',
						width: '100%',
						items: [{
							xtype: 'displayfield',
							value: 'Direction',
							width: 60
						},
						{
							xtype: 'combo',

							hiddenName: 'forecast_wind_direction',
							width: 100,
							store: new Ext.data.JsonStore({
								fields: [
									{ name: 'key' },
									{ name: 'value' }
								],
								autoLoad: true,
								root: 'rows',
								baseParams: {
									lookup_code: 'aspect'
								},
								proxy: new Ext.data.ScriptTagProxy({
									url: '/json/lookup_query_all/'
								})
							}),
							valueField: 'key',
							displayField: 'value',
							editable: false,
							triggerAction: 'all',
							mode: 'local',
							selectOnFocus: true
						},
						{
							xtype: 'displayfield',
							value: 'Speed',
							width: 60
						},
						{
							xtype: 'combo',
							hiddenName: 'forecast_wind_speed',
							width: 100,
							store: new Ext.data.JsonStore({
								fields: [
									{ name: 'key' },
									{ name: 'value' }
								],
								autoLoad: true,
								root: 'rows',
								baseParams: {
									lookup_code: "windspeedestimation" + (isOperationSWAG ? "_swag" : "")
								},
								proxy: new Ext.data.ScriptTagProxy({
									url: '/json/lookup_query_all/'
								})
							}),
							valueField: 'key',
							displayField: 'value',
							editable: false,
							triggerAction: 'all',
							mode: 'local',
							selectOnFocus: true
						}]
					},
					{
						fieldLabel: 'Temperature',
						name: 'forecast_air_temperature',
						xtype: 'numberfield',
						width: 200
					},
					{
						xtype: 'combo',
						fieldLabel: 'Forecaster Confidence',
						hiddenName: 'forecast_confidence',
						store: new Ext.data.JsonStore({
							fields: [
								{ name: 'key' },
								{ name: 'value' }
							],
							autoLoad: true,
							root: 'rows',
							baseParams: {
								lookup_code: 'confidence'
							},
							proxy: new Ext.data.ScriptTagProxy({
								url: '/json/lookup_query_all/'
							})
						}),
						valueField: 'key',
						displayField: 'value',
						editable: false,
						triggerAction: 'all',
						mode: 'local',
						width: 265,
						selectOnFocus: true
					}

				]
			},
			// Comments and Blogs
			{
				xtype: 'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title: 'Comments and Blog',
				items: [
					{
						xtype: 'container',
						html: '<p>The following table displays the avalanche fields in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
					},
					{
						fieldLabel: 'Notes',
						name: 'comments_internal',
						xtype: 'htmleditor',
						width: 600
					}
				]
			}
			*/
		]
	});

	operationTerrainUtil = new OperationTerrainUtil(
		null,
		null,
		Ext.getCmp('observerCombo'),
		Ext.getCmp('location'));
	/*,googleMap.get('mapContainer').get('map')
	,obliqueForm.get('photoContainer').get('photoEditor'));*/

	// Form Container
	fsContainer = new Ext.Panel({
		title: '',
		hidden: true,
		renderTo: 'form-loc',
		plain: true,
		width: '100%',
		border: false,
		defaults: {
			plain: true,
			border: false,
			width: '100%',
			bodyStyle: 'padding: 5px'
		},
		items: [
			fs
		],
		buttons: [
			{
				text: 'Save',
				/*iconCls: 'ui-icon-disk',*/
				handler: function (button) {
					button.disable();
					operationTerrainUtil.saveChanges();
					fs.getForm().submit({
						url: fs.form_url,
						waitMsg: 'Saving Data...',
						params: {
							entity: 'Observation',
							form: 'pc.forms.observation.ObservationForm',
							type: 'observation__ObservationType__lookup'
						},
						submitEmptyText: false,
						success: function (form, action) {
							fsContainer.hide();
							var key = Ext.decode(action.response.responseText).key;
							grid.show();
							tableStore.reload();
							button.enable();
						},
						failure: function (form, action) {
							button.enable();
							formFailureFunction();
						}
					});
				}
			},
			{
				text: 'Cancel',
				handler: function () {
					fsContainer.hide();
					grid.show();
				}
			}

		]
	});

	// TABLE
	var expander = new Ext.ux.grid.RowExpander({
		tpl: new Ext.Template('<p><b>Comment:</b> {comments_internal}</p>')
	});
	// Create RowActions Plugin
	var action = new Ext.ux.grid.RowActions({
		header: '',
		width: 80,
		keepSelection: true,
		actions: [
			{
				iconCls: 'ui-icon ui-icon-wrench',
				tooltip: 'Edit',
				callback: function (grid, records, action) {
					operationTerrainUtil.reset();
					fs.getForm().loadRecord(records);
					operationTerrainUtil.loadLocation(records.data.operation);
					fsContainer.show();
					grid.hide();
				}
			},
			{
				iconCls: 'ui-icon ui-icon-trash',
				tooltip: 'Delete',
				callback: function (grid, records, action) {
					Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function (btn) {
						if (btn == "yes") {
							Ext.Ajax.request({
								method: 'GET',
								url: '/json/entity_delete/',
								params: {
									key: records.data.key,
									entity: 'Observation'
								},
								success: function (action, options) {
									tableStore.reload();
									deleteFunciton(action, options);
								}
							});
						}
					}, this);
				}
			}
		]
	});
	// create the data store
	tableStore = new Ext.data.Store({
		reader: new Ext.data.JsonReader({ totalProperty: 'totalCount', root: 'rows' }, ObservationVO),
		remoteSort: true,
		baseParams: {
			entity: 'Observation',
			type__ObservationType__lookup: 'observation',
			start: 0,
			limit: PAGING_LIMIT
		},
		proxy: new Ext.data.ScriptTagProxy({ url: '/json/entity_query_all_paging/' })
	});
	// create the Grid
	grid = new Ext.grid.GridPanel({
		store: tableStore,
		loadMask: true,
		plugins: [action, expander],
		tbar: new Ext.Toolbar(
			{
				items: ['->', {
					text: 'Add',
					iconCls: 'add-icon',
					scope: this,
					handler: function () {
						var record = new ObservationVO({
							created_by: party.key,
							created_by_desc: party.name,
							created_date: new Date(),
							date_time_start: new Date(),
							observer: party.key,
							operation: operation.key,
							operation_desc: operation.name
						});

						fs.getForm().setValues(newRecordForForm(record));
						operationTerrainUtil.reset();
						operationTerrainUtil.loadLocation(record.data.operation);
						fsContainer.show();
						grid.hide()
					}
				}]
			}
		),
		columns: [
			expander,
			action,
			{
				id: 'date_time_start',
				header: 'Date and Time',
				width: 120,
				sortable: true,
				dataIndex: 'date_time_start',
				renderer: formatDate
			},
			{
				header: 'Observer',
				width: 140,
				sortable: false,
				dataIndex: 'observer_desc'
			},
			{
				id: 'terrain',
				header: 'Location',
				width: 150,
				sortable: true,
				dataIndex: 'terrain_desc'
			},
			{
				id: 'notable',
				header: 'Notable',
				width: 60,
				sortable: false,
				dataIndex: 'notable'
			},
			{
				id: 'subject',
				header: 'Subject',
				width: 455,
				sortable: false,
				dataIndex: 'subject'
			}
		],
		stripeRows: true,
		height: 400,
		width: '100%',
		// paging bar on the bottom
		bbar: new Ext.PagingToolbar({
			pageSize: PAGING_LIMIT,
			store: tableStore,
			displayInfo: true,
			displayMsg: 'Displaying records {0} - {1} of {2}',
			emptyMsg: "No records to display"
		})
	});
	// render the grid to the specified div in the page
	grid.render('table-loc');
	console.log('Grid rendered to table-loc');
	tableStore.load({ params: { start: 0, limit: PAGING_LIMIT } });

	// LinkUtil
	var linkUtil = new LinkUtil({
		form: fs,
		entity: 'Observation',
		record: new ObservationVO(),
		fn: function (records) {
			operationTerrainUtil.reset();
			fs.getForm().loadRecord(records);
			operationTerrainUtil.loadLocation(records.data.operation);
			fsContainer.show();
			grid.hide();
		}
	});
});
