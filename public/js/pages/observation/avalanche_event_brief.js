var fs, grid, tableStore, fsContainer, operationTerrainUtil;

Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.StoreMgr.lookup("observerActive").load();
 	// FORM
	fs = new Ext.FormPanel({
		form_url: "/json/entity_save/",
		defaults: {
			anchor: '0'
		},
		waitMsgTarget: true,
		reader : new Ext.data.XmlReader({
			record : 'record',
			success: 'success'
			},
			[
				{name: 'operation'}
			]
		),
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
				name:'created_date'
			},
			{
				xtype:'hidden',
				itemId:'operation',
				id: 'operation',
				name:'operation'
			},
			{
				xtype:'hidden',
				itemId:'created_by',
				id: 'created_by',
				name:'created_by'
			},
			{	// Operation
				xtype:'fieldset',
				collapsible: true,
				collapsed: true,
				width: '75%',
				title:'Operational Header',
				items: [
					{
						xtype:'container',
						html:'<p> This section allows you to record details related to your operation. The notable and description fields are provided to assist in identifying specific obserations. </p>'
					},
					{
						xtype: 'displayfield',
						fieldLabel: 'Operation',
						width: 200,
						id:'operation_desc'
					},
					{
						xtype: 'displayfield',
						fieldLabel: 'Data Recorder',
						id:'created_by_desc',
						width: 200
					},
					{
						xtype:'combo',
						fieldLabel: 'Observer',
						hiddenName:'observer',
						id: 'observerCombo',
						width: 200,
						store: 'observerActive',
                                                lastQuery: '',
						valueField:'key',
						displayField:'full_name',
						editable: false,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true
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
			{	// Scope
				xtype:'fieldset',
				collapsible: true,
				collapsed: false,
				width: '75%',
				title:'Scope',
				items: [
					{
						xtype:'container',
						html:'<p> This section allows you to specify the observation date and time, and its key location. Locations can be of any type. </p>'
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
						xtype:'combo',
						fieldLabel: 'Location',
						id: 'location',
						hiddenName:'terrain',
						store: new Ext.data.Store({
							reader: new Ext.data.JsonReader({
								root: 'rows'
							}, TerrainVO),
							root: 'rows',
							baseParams : {
								entity: 'Terrain',
								det: 'k',
								active: 'True',
								sort: 'name_nick',
								dir: 'ASC',
								allowBlankRecord: true
//								feature_type__selfRef: 'Region'
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
						width: 200,
						selectOnFocus:true
					}
				]
			},
       // Detail collapsible fieldset
        {
            xtype: 'fieldset',
            collapsible: true,
            collapsed: false,
            width: '100%',
            title: 'Details',
            items: [{
                xtype: 'compositefield',
                msgTarget: 'side',
                height: 40,
                fieldLabel: 'Occurrence',
                cls: 'composite-field',
                items: [{
                    xtype: 'compositefield',
                    width: 368,
                    items: [{
                        name: 'date_time_occurrence',
                        xtype: 'datetimefield',
                        dateFormat: 'Y-m-d',
                        timeFormat: 'H:i',
                        width: 150
                    }, {
                        xtype: 'displayfield',
                        hideParent: true,
                        value: 'Date/Time',
                        ctCls: 'pcComboOutter',
                        cls: 'pcComboInner'
                    }]
                }, {
                    xtype: 'compositefield',
                    width: 368,
                    items: [{
                        name: 'time_range',
                        xtype: 'textfield',
                        width: 150
                    }, {
                        xtype: 'displayfield',
                        hideParent: true,
                        value: 'Range',
                        ctCls: 'pcComboOutter',
                        cls: 'pcComboInner'
                    }, ]
                }]
            },

            // Path Characteristics
            {
                xtype: 'fieldset',
                collapsible: false,
                collapsed: false,
                title: 'Path Characteristics',
                items: [{
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    height: 40,
                    fieldLabel: 'Aspect',
                    cls: 'composite-field',
                    items: [{
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            xtype: 'combo',
                            hiddenName: 'aspect_start',
                            width: 348,
                            store: new Ext.data.JsonStore({
                                fields: [{
                                    name: 'key'
                                }, {
                                    name: 'code_value'
                                }, ],
                                autoLoad: true,
                                root: 'rows',
                                baseParams: {
                                    lookup_code: 'aspect',
                                    allowBlankRecord: true
                                },
                                proxy: new Ext.data.HttpProxy({
                                    url: '/json/lookup_query_all/',
                                    disableCaching: false,
                                    method: 'GET'
                                })
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Categorical',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    },
                    // Numeric field is smaller, as it has checkbox after it
                    {
                        xtype: 'compositefield',
                        width: 293,
                        // 368 - 55px
                        items: [{
                            name: 'aspect_start_numeric',
                            xtype: 'numberfield',
                            width: 273 // 20px less than comp field width
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Numeric',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 40,
                        items: [{
                            name: 'aspect_measured',
                            xtype: 'checkbox',
                            width: 20
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Measured',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    }]
                }, {
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    height: 40,
                    fieldLabel: 'Incline',
                    cls: 'composite-field',
                    items: [{
                        xtype: 'compositefield',
                        width: 75,
                        items: [{
                            name: 'incline_range_start',
                            xtype: 'numberfield',
                            width: 75
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: '',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 293,
                        // 368 - 75 (as field is small)
                        items: [{
                            name: 'incline_measured',
                            xtype: 'checkbox',
                            width: 20 // stays at 20, always
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Measured?',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    }]
                }, {
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    height: 40,
                    fieldLabel: 'Elevation m (feet)',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype: 'compositefield',
                        width: 75,
                        items: [{
                            name: 'elevation_min',
                            width: 75,
                            xtype: 'numberfield'
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Min',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 293,
                        items: [{
                            name: 'elevation_measured',
                            xtype: 'checkbox',
                            width: 20
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Measured?',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    }]
                }]
            },

            // Trigger and Event Characteristics
            {
                xtype: 'fieldset',
                collapsible: false,
                collapsed: false,
                title: 'Trigger and Event Characteristics',
                items: [{
                    xtype: 'compositefield',
                    msgTarget: 'side',
                    height: 40,
                    fieldLabel: 'Destructive size',
                    cls: 'composite-field',
                    items: [{
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            xtype: 'combo',
                            hiddenName: 'destructive_size_max',
                            width: 348,
                            store: new Ext.data.JsonStore({
                                fields: [{
                                    name: 'key'
                                }, {
                                    name: 'code_value'
                                }, ],
                                autoLoad: true,
                                root: 'rows',
                                baseParams: {
                                    lookup_code: 'sizedestructive',
                                    allowBlankRecord: true
                                },
                                proxy: new Ext.data.HttpProxy({
                                    url: '/json/lookup_query_all/',
                                    disableCaching: false,
                                    method: 'GET'
                                })
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Max',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    }]
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Trigger & remote distance',
                    msgTarget: 'side',
                    height: 40,
                    width: 980,
                    cls: 'composite-field',
                    items: [{
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            xtype: 'combo',
                            hiddenName: 'trigger',
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                    root: 'rows'
                                }, LookupVO),
                                autoLoad: true,
                                baseParams: {
		                            lookup_code: "trigger" + ( isOperationSWAG ? "_swag" : "" ),
                                    allowBlankRecord: true
                                },
                                proxy: new Ext.data.HttpProxy({
                                    url: '/json/lookup_query_all/',
                                    disableCaching: false,
                                    method: 'GET'
                                })
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true,
                            width: 348,
                            cascadeComboId: 'trigger_minor'
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            xtype: 'combo',
                            hiddenName: 'trigger_minor',
                            id: 'trigger_minor',
                            width: 348,
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({}, LookupVO)
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 184,
                        items: [{
                            name: 'trigger_remote_distance',
                            width: 184,
                            xtype: 'numberfield'
                        }, {
                            xtype: 'displayfield',
                            hideParent: true,
                            value: 'Distance',
                            ctCls: 'pcComboOutter',
                            cls: 'pcComboInner'
                        }]
                    }]
                }, { // no need for composite field, as it has just the 1 field on the row (and no sub labels)
                    xtype: 'combo',
                    fieldLabel: 'Bed surface',
                    hiddenName: 'bed_surface',
                    store: new Ext.data.JsonStore({
                        fields: [{
                            name: 'key'
                        }, {
                            name: 'code_value'
                        }, ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams: {
                            lookup_code: "bedsurface" + ( isOperationSWAG ? "_swag" : "" ),
                            allowBlankRecord: true
                        },
                        proxy: new Ext.data.HttpProxy({
                            url: '/json/lookup_query_all/',
                            disableCaching: false,
                            method: 'GET'
                        })
                    }),
                    valueField: 'key',
                    displayField: 'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true,
                    width: 348
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Failure type',
                    hiddenName: 'failure_type',
                    store: new Ext.data.JsonStore({
                        fields: [{
                            name: 'key'
                        }, {
                            name: 'code_value'
                        }, ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams: {
                            lookup_code: "failuretype" + ( isOperationSWAG ? "_swag" : "" ),
                            allowBlankRecord: true
                        },
                        proxy: new Ext.data.HttpProxy({
                            url: '/json/lookup_query_all/',
                            disableCaching: false,
                            method: 'GET'
                        })
                    }),
                    valueField: 'key',
                    displayField: 'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true,
                    width: 348
                }, {
                    fieldLabel: 'Failure plane age',
                    name: 'failure_plane_age',
                    xtype: 'datetimefield',
                    dateFormat: 'Y-m-d',
                    timeFormat: 'H:i',
                    width: 150
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Failure plane snow form',
                    msgTarget: 'side',
                    height: 40,
                    width: 980,
                    cls: 'composite-field',
                    items: [{
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            xtype: 'combo',
                            hiddenName: 'surface_snow_form',
                            width: 368,
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                    root: 'rows'
                                }, LookupVO),
                                autoLoad: true,
                                baseParams: {
                                    lookup_code: 'snowonground',
                                    allowBlankRecord: true
                                },
                                proxy: new Ext.data.HttpProxy({
                                    url: '/json/lookup_query_all/',
                                    disableCaching: false,
                                    method: 'GET'
                                })
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            width: 348,
                            selectOnFocus: true,
                            cascadeComboId: 'surface_snow_form_minor'
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            xtype: 'combo',
                            id: 'surface_snow_form_minor',
                            hiddenName: 'surface_snow_form_minor',
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({}, LookupVO)
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true,
                            width: 348
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 184,
                        items: [{
                            xtype: 'compositefield',
                            width: 75,
                            items: [{
                                name: 'surface_snow_size',
                                width: 75,
                                xtype: 'numberfield'
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Size mm',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 293,
                            items: [{
                                name: 'surface_snow_form_rimed',
                                xtype: 'checkbox',
                                width: 20
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Rimed?',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }]
                    }]
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Failure plane snow form',
                    msgTarget: 'side',
                    height: 40,
                    width: 980,
                    cls: 'composite-field',
                    items: [{
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            xtype: 'combo',
                            hiddenName: 'surface_snow_form_2',
                            width: 368,
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({
                                    root: 'rows'
                                }, LookupVO),
                                autoLoad: true,
                                baseParams: {
                                    lookup_code: 'snowonground',
                                    allowBlankRecord: true
                                },
                                proxy: new Ext.data.HttpProxy({
                                    url: '/json/lookup_query_all/',
                                    disableCaching: false,
                                    method: 'GET'
                                })
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            width: 348,
                            selectOnFocus: true,
                            cascadeComboId: 'surface_snow_form_2_minor'
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 368,
                        items: [{
                            xtype: 'combo',
                            id: 'surface_snow_form_2_minor',
                            hiddenName: 'surface_snow_form_2_minor',
                            store: new Ext.data.Store({
                                reader: new Ext.data.JsonReader({}, LookupVO)
                            }),
                            valueField: 'key',
                            displayField: 'code_value',
                            editable: false,
                            triggerAction: 'all',
                            mode: 'local',
                            selectOnFocus: true,
                            width: 348
                        }]
                    }, {
                        xtype: 'compositefield',
                        width: 184,
                        items: [{
                            xtype: 'compositefield',
                            width: 75,
                            items: [{
                                name: 'surface_snow_size_2',
                                width: 75,
                                xtype: 'numberfield'
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Size mm',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }, {
                            xtype: 'compositefield',
                            width: 293,
                            items: [{
                                name: 'surface_snow_form_rimed_2',
                                xtype: 'checkbox',
                                width: 20
                            }, {
                                xtype: 'displayfield',
                                hideParent: true,
                                value: 'Rimed?',
                                ctCls: 'pcComboOutter',
                                cls: 'pcComboInner'
                            }]
                        }]
                    }]
                },
                {
                    xtype: 'combo',
                    fieldLabel: 'Liquid water deposit',
                    hiddenName: 'liquid_water_deposit',
                    width: 348,
                    store: new Ext.data.JsonStore({
                        fields: [{
                            name: 'key'
                        }, {
                            name: 'code_value'
                        }, ],
                        autoLoad: true,
                        root: 'rows',
                        baseParams: {
                            lookup_code: 'liquidwatercontentstartzone',
                            allowBlankRecord: true
                        },
                        proxy: new Ext.data.HttpProxy({
                            url: '/json/lookup_query_all/',
                            disableCaching: false,
                            method: 'GET'
                        })
                    }),
                    valueField: 'key',
                    displayField: 'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true
                }]
            },

            // Dimensions
            {
                xtype: 'fieldset',
                collapsible: false,
                collapsed: false,
                width: '75%',
                title: 'Dimensions',
                items: [
                        {
                    xtype: 'compositefield',
                    height: 30,
                    fieldLabel: 'Slab thickness cm',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                                {
                                    xtype: 'displayfield',
                                    value: 'Average',
                                    cls: 'alignRight',
                                    width: 60
                                },
                                {
                                    name: 'slab_thickness_avg',
                                    cls: 'alignRight',
                                    width: 115,
                                    xtype: 'numberfield'
                                },
                                {
                                    xtype: 'displayfield',
                                    cls: 'alignRight',
                                    value: 'Maximum',
                                    width: 60
                                },
                                {
                                    name: 'slab_thickness_max',
                                    cls: 'alignRight',
                                    width: 105,
                                    xtype: 'numberfield'
                                },
                                {
                                    xtype: 'displayfield',
                                    cls: 'alignRight',
                                    value: 'Measured',
                                    width: 60
                                },
                                {
                                    name: 'slab_thickness_measured',
                                    xtype: 'checkbox'
                                }
                            ]
                        },
                        {
                            xtype: 'compositefield',
                            msgTarget: 'side',
                            height: 30,
                            fieldLabel: 'Slab width m ',
                            cls: 'composite-field',
                            width: '100%',
                            items: [
                                        {
                                            xtype: 'displayfield',
                                            cls: 'alignRight',
                                            value: 'Average',
                                            width: 60
                                        },
                                        {
                                            name: 'slab_width_avg',
                                            cls: 'alignRight',
                                            width: 115,
                                            xtype: 'numberfield'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            cls: 'alignRight',
                                            value: 'Maximum',
                                            width: 60
                                        },
                                        {
                                            name: 'slab_width_max',
                                            cls: 'alignRight',
                                            width: 105,
                                            xtype: 'numberfield'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            cls: 'alignRight',
                                            value: 'Measured',
                                            width: 60
                                        },
                                        {
                                            name: 'slab_width_measured',
                                            xtype: 'checkbox'
                                        }
                                    ]
                        },
                        {
                            xtype: 'compositefield',
                            msgTarget: 'side',
                            height: 30,
                            fieldLabel: 'Path Length m ',
                            cls: 'composite-field',
                            length: '100%',
                            items: [
                                        {
                                            xtype: 'displayfield',
                                            cls: 'alignRight',
                                            value: 'Minimum',
                                            width: 60
                                        }, {
                                            name: 'path_run_length_min',
                                            cls: 'alignRight',
                                            width: 115,
                                            xtype: 'numberfield'
                                        }, {
                                            xtype: 'displayfield',
                                            cls: 'alignRight',
                                            value: 'Measured',
                                            width: 60
                                        }, {
                                            name: 'path_run_length_min_measured',
                                            xtype: 'checkbox'
                                        }
                                    ]
                        },
                {
                    xtype: 'compositefield',
                    fieldLabel: 'Terminus',
                    msgTarget: 'side',
                    height: 30,
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype: 'combo',
                        hiddenName: 'terminus',
                        width: 265,
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root: 'rows'
                            }, LookupVO),
                            autoLoad: true,
                            baseParams: {
                                lookup_code: 'terminus',
                                allowBlankRecord: true
                            },
                            proxy: new Ext.data.HttpProxy({
                                url: '/json/lookup_query_all/',
                                disableCaching: false,
                                method: 'GET'
                            })
                        }),
                        valueField: 'key',
                        displayField: 'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus: true,
                        cascadeComboId: 'terminus_minor'
                    }, {
                        xtype: 'combo',
                        hiddenName: 'terminus_minor',
                        id: 'terminus_minor',
                        width: 265,
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({}, LookupVO)
                        }),
                        valueField: 'key',
                        displayField: 'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus: true
                    }]
                }]
            },

            //// Deposit
            //{
            //    xtype: 'fieldset',
            //    collapsible: false,
            //    collapsed: false,
            //    width: '75%',
            //    title: 'Deposit',
            //    items: [{
            //        xtype: 'compositefield',
            //        msgTarget: 'side',
            //        height: 30,
            //        fieldLabel: 'Deposit thickness',
            //        cls: 'composite-field',
            //        length: '100%',
            //        items: [{
            //            xtype: 'displayfield',
            //            cls: 'alignRight',
            //            value: 'Average',
            //            width: 60
            //        }, {
            //            name: 'deposit_thickness_average',
            //            fieldLabel: 'Deposit average thickness',
            //            xtype: 'numberfield',
            //            width: 100
            //        }, {
            //            xtype: 'displayfield',
            //            cls: 'alignRight',
            //            value: 'Measured',
            //            width: 60
            //        }, {
            //            name: 'deposit_thickness_measured',
            //            xtype: 'checkbox'
            //        }]
            //    }, {
            //        xtype: 'compositefield',
            //        msgTarget: 'side',
            //        height: 30,
            //        fieldLabel: 'Deposit width',
            //        cls: 'composite-field',
            //        length: '100%',
            //        items: [{
            //            xtype: 'displayfield',
            //            cls: 'alignRight',
            //            value: 'Average',
            //            width: 60
            //        }, {
            //            name: 'deposit_width_average',
            //            xtype: 'numberfield',
            //            width: 100
            //        }, {
            //            xtype: 'displayfield',
            //            cls: 'alignRight',
            //            value: 'Measured',
            //            width: 60
            //        }, {
            //            name: 'deposit_width_measured',
            //            xtype: 'checkbox'
            //        }]
            //    }, {
            //        xtype: 'compositefield',
            //        msgTarget: 'side',
            //        height: 30,
            //        fieldLabel: 'Deposit length',
            //        cls: 'composite-field',
            //        length: '100%',
            //        items: [{
            //            xtype: 'displayfield',
            //            cls: 'alignRight',
            //            value: 'Average',
            //            width: 60
            //        }, {
            //            name: 'deposit_length_average',
            //            xtype: 'numberfield',
            //            width: 100
            //        }, {
            //            xtype: 'displayfield',
            //            cls: 'alignRight',
            //            value: 'Measured',
            //            width: 60
            //        }, {
            //            name: 'deposit_length_measured',
            //            xtype: 'checkbox'
            //        }]
            //    }]
            //},
            {
						fieldLabel: 'Notes',
						name: 'comments_internal',
						xtype: 'textarea',
						width: 600
					}
				]
			}
		]
	});

   operationTerrainUtil = new OperationTerrainUtil(null,
                                                    null,
                                                    Ext.getCmp('observerCombo'),
                                                    Ext.getCmp('location') );
                                                    /*,googleMap.get('mapContainer').get('map')
                                                     ,obliqueForm.get('photoContainer').get('photoEditor'));*/
    /*
        Form Container
    */
    fsContainer = new Ext.Panel({
        title:'',
        hidden:true,
        renderTo:'form-loc',
        plain: true,
        width   : '100%',
        border: false,
        defaults:{
            plain: true,
            border: false,
            width   : '100%',
            bodyStyle: 'padding: 5px'
        },
        items:[
            fs

        ],
        buttons:[{
            text: 'Save',
            /*iconCls: 'ui-icon-disk',*/
            handler: function(button){
                button.disable();
                operationTerrainUtil.saveChanges();
                fs.getForm().submit({
                    url:fs.form_url,
                    waitMsg:'Saving Data...',
                    params:{
                        entity: 'Avalanche',
                        form: 'pc.forms.observation.ObservationForm',
                        type: 'avalancheeventbrief__ObservationType__lookup'
                    },
                    submitEmptyText: false,
                    success: function(form, action) {
                        fsContainer.hide();
                        var key = Ext.decode(action.response.responseText).key;
                        grid.show();
                        tableStore.reload()
                        button.enable();
                    },
                    failure: function(form, action) {
                        button.enable();
                        formFailureFunction();
                    }
                });
            }
        },{
            text: 'Cancel',
            handler: function(){
                fsContainer.hide();
                grid.show();
            }
        }]
    });
    /*
        TABLE
    */
    var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    // Create RowActions Plugin
    var action = new Ext.ux.grid.RowActions({
        header:'',
        width: 80,
        keepSelection:true,
        actions:[{
               iconCls:'ui-icon ui-icon-wrench',
               tooltip:'Edit',
               callback:function(grid, records, action) {
                    operationTerrainUtil.reset();
                    fs.getForm().loadRecord(records);
                    operationTerrainUtil.loadLocation(records.data.operation);
                    fsContainer.show();
                    grid.hide();
               }
       },{
               iconCls:'ui-icon ui-icon-trash',
               tooltip:'Delete',
               callback:function(grid, records, action) {
                    Ext.MessageBox.confirm('Confirm', 'Are you sure you want delete the record?', function(btn){
                        if(btn == "yes"){
                            Ext.Ajax.request({
                                scope: this,
                                method: 'GET',
                                url: '/json/entity_delete/',
                                params:{
                                    key: records.data.key,
                                    entity: 'Avalanche'
                                },
                                success: function(action, options) {
                                    tableStore.reload();
                                    deleteFunciton(action, options);
                                }
                            });
                        }
                    }, this);
               }
       }]
    });
    // create the data store
    tableStore = new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, AvalancheVO),
        remoteSort: true,
        baseParams:{
            entity: 'Avalanche',
            type__ObservationType__lookup: 'avalancheeventbrief',
            start:0,
            limit:PAGING_LIMIT
        },
        proxy: new Ext.data.ScriptTagProxy({
            url: '/json/entity_query_all_paging/'
        })
    });
    // create the Grid
    grid = new Ext.grid.GridPanel({
        store: tableStore,
        loadMask: true,
        plugins:[action, expander],
        tbar: new Ext.Toolbar({
            items: ['->',{
                    text: 'Add',
                    iconCls: 'add-icon',
                    scope: this,
                    handler: function() {
                        var record = new AvalancheVO({  created_by: party.key,
                                        created_by_desc: party.name,
                                        created_date: new Date(),
                                        observer: party.key,
                                        date_time_start: new Date(),
                                        operation: operation.key,
                                        operation_desc:operation.name
                                    });
                        fs.getForm().setValues( newRecordForForm(record));
                        operationTerrainUtil.reset();
                        operationTerrainUtil.loadLocation(record.data.operation);
                        fsContainer.show();
                        grid.hide()
                    }
                }
            ]
        }),
        columns: [
            expander,
            action,
            {
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dataIndex: 'date_time_start',
                renderer: formatDate
            },{
                id       :'observer',
                header   : 'Observer',
                width    : 140,
                sortable : true,
                dataIndex: 'observer_desc'
            },{
                id       :'terrain',
                header   : 'Location',
                width    : 150,
                sortable : true,
                dataIndex: 'terrain_desc'
            },{
                id       :'notable',
                header   : 'Notable',
                width    : 68,
                sortable : true,
                dataIndex: 'notable'
            },{
                id       :'subject',
                header   : 'Description',
                width    : 150,
                sortable : true,
                dataIndex: 'subject'
            }
        ],
        stripeRows: true,
        height: 400,
        width: '100%',
        // paging bar on the bottom
        bbar: new Ext.PagingToolbar({
            pageSize:PAGING_LIMIT,
            store: tableStore,
            displayInfo: true,
            displayMsg: 'Displaying records {0} - {1} of {2}',
            emptyMsg: "No records to display"
        })
    });
    // render the grid to the specified div in the page
    grid.render('table-loc');
    tableStore.load({params:{start:0, limit:PAGING_LIMIT}});
    /*
        LinkUtil
    */
    var linkUtil = new LinkUtil({form: fs,
                                entity: 'Avalanche',
                                record: new AvalancheVO(),
                                fn: function(record){
                                    operationTerrainUtil.reset();
                                    fs.getForm().loadRecord(record);
                                    operationTerrainUtil.loadLocation(record.data.operation);
                                    fsContainer.show();
                                    grid.hide();
                                }
    });
});
