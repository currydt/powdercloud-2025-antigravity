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
			    itemId:'map_overlay',
			    name:'map_overlay'
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
						html:'<p> This section allows you to specify the observation date and time, and its key location. Locations are limited to type Weather Plot.</p>'
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
								allowBlankRecord: true,
								feature_type__selfRef: 'Weather Station'
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
            // Details Section
            {
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Details',
                items: [

                        {
                            xtype:'combo',
                            fieldLabel: 'Measurement Type ',
                            hiddenName: 'weather_time_type',
                            width: 265,
                            store: new Ext.data.JsonStore({
                                fields: [
                                    {name: 'key'},
                                    {name: 'value'},
                                ],
                                autoLoad: true,
                                root: 'rows',
                                baseParams : {
                                    lookup_code: 'weathertimetype',
                                    allowBlankRecord: true
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
                            fieldLabel: 'Elevation',
                            name:'elevation_min',
                            width: 50,
                            xtype: 'numberfield'
                        },

                // Sky + Actual Weather
                {
                xtype:'fieldset',
                collapsible: false,
                collapsed: false,
                width: '75%',
                title:'  Weather Conditions',
                items: [
                        {
                            xtype:'combo',
                            fieldLabel: 'Sky conditions',
                            hiddenName:'sky_condition',
                            store: new Ext.data.JsonStore({
                                fields: [
                                    {name: 'key'},
                                    {name: 'code_value'}
                                ],
                                autoLoad: true,
                                root: 'rows',
                                baseParams : {
                                    lookup_code: 'skyconditons',
                                    allowBlankRecord: true
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
                            width: 265,
                            selectOnFocus:true
                        },
			{
                            xtype: 'compositefield',
                            fieldLabel: 'Precipitation Type & Rate',
                            msgTarget : 'side',
                            height: 30,
                            cls: 'composite-field',
                            width: '100%',
                            items: [{
                                xtype:'combo',
                                hiddenName:'precipitation_type_rate',
                                width: 265,
                                store: new Ext.data.Store({
                                    reader: new Ext.data.JsonReader({
                                        root: 'rows'
                                    }, LookupVO),
                                    autoLoad: true,
                                    baseParams : {
                                        lookup_code: 'precipitationtyperate',
                                        allowBlankRecord: true
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
                                selectOnFocus:true,
                                cascadeComboId: 'precipitation_type_rate_minor'
                            },{
                                xtype:'combo',
                                hiddenName:'precipitation_type_rate_minor',
                                id: 'precipitation_type_rate_minor',
                                width: 265,
                                store: new Ext.data.Store({
                                    reader: new Ext.data.JsonReader({
                                    }, LookupVO)
                                }),
                                valueField:'key',
                                displayField:'code_value',
                                editable: false,
                                triggerAction: 'all',
                                mode: 'local',
                                selectOnFocus:true
                            }]
                        },
                        {
                            xtype: 'compositefield',
                            msgTarget : 'side',
                            height: 30,
                            fieldLabel: 'Air temperature &deg;C (&deg;F)',
                             cls: 'composite-field',
                            width: '100%',
                            items: [{
                                xtype:'displayfield',
                                cls: 'alignRight',
                                value: 'Minimum',
                                width: 60
                            },{
                                name:'air_temperature_min',
                                width: 105,
                                xtype: 'numberfield'
                            },{
                                xtype:'displayfield',
                                cls: 'alignRight',
                                value: 'Maximum',
                                width: 60
                            },{
                                name:'air_temperature_max',
                                width: 105,
                                xtype: 'numberfield'
                            },{
                                xtype:'displayfield',
                                cls: 'alignRight',
                                value: 'Present',
                                width: 60
                            },{
                                name:'air_temperature_present',
                                 width: 115,
                                xtype: 'numberfield'
                            }]
                        },
                        {
                            xtype: 'compositefield',
                            msgTarget : 'side',
                            height: 30,
                            fieldLabel: 'Thermograph  &deg;C (&deg;F)',
                            cls: 'composite-field',
                            width: '100%',
                            items: [
                            {
                                xtype:'displayfield',
                                cls: 'alignRight',
                                value: 'Temp.',
                                width: 60
                            },
                            {
                                name:'thermograph',
                                xtype: 'numberfield',
                                width: 170
                            }
                            ,{
                                xtype:'displayfield',
                                cls: 'alignRight',
                                value: 'Trend',
                                width: 60
                            }
                            ,{
                                xtype:'combo',

                                hiddenName:'thermograph_trend',
                                width: 200,
                                store: new Ext.data.JsonStore({
                                    fields: [
                                        {name: 'key'},
                                        {name: 'code_value'},
                                    ],
                                    autoLoad: true,
                                    root: 'rows',
                                    baseParams : {
                                        lookup_code: 'temperaturetrend',
                                        allowBlankRecord: true
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
                            }



                            ]
                        }
                        ,{
                            xtype: 'compositefield',
                            msgTarget : 'side',
                            height: 30,
                            fieldLabel: 'Gauge mm (inch)',
                             cls: 'composite-field',
                            length: '100%',
                            items: [{
                                xtype:'displayfield',
                                value: 'Rain',
                                width: 60
                            },{
                                name:'rain_gauge',
                                cls: 'alignRight',
                                width: 105,
                                 xtype: 'numberfield'
                            },{
                                xtype:'displayfield',
                                value: 'Precipitation',
                                width: 100
                            },{
                                name:'precipitation_gauge',
                                cls: 'alignRight',
                                width: 105,
                                xtype: 'numberfield'
                            }]
                        }]
                    },


                {
                xtype:'fieldset',
                collapsible: false,
                collapsed: false,
                width: '75%',
                title:'Snow and Snowboard Characteristics',
                items: [
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Snow temperature &deg;C',
                     cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'T 0',
                        width: 60
                    },{
                        name:'snow_temperature_T_0',
                        width: 105,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'T 10',
                        width: 60
                    },{
                        name:'snow_temperature_T_10',
                        width: 105,
                        xtype: 'numberfield'
                    },{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'T 20',
                        width: 60
                    },{
                        name:'snow_temperature_T_20',
                         width: 115,
                        xtype: 'numberfield'
                    }]
                },

                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Penetration (cm)',
                     cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Foot',
                        width: 60
                    }
                    ,{
                        name:'pen_foot',
                        width: 105,
                        xtype: 'numberfield'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Ski',
                        width: 60
                    }
                    ,{
                        name:'pen_ski',
                        cls: 'alignRight',
                        width: 105,
                        xtype: 'numberfield'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Ram',
                        width: 60
                    }
                    ,{
                        name:'pen_ram',
                         width: 115,
                        xtype: 'numberfield'
                    }]
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
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root: 'rows'
                            }, LookupVO),
                            autoLoad: true,
                            baseParams : {
                                lookup_code: 'snowonground',
                                allowBlankRecord: true
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
                        selectOnFocus:true,
                        cascadeComboId:'surface_snow_form_minor'
                    },{
                        xtype:'combo',
                        hiddenName:'surface_snow_form_minor',
                        id: 'surface_snow_form_minor',
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                            }, LookupVO)
                        }),
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true,
                        width: 265
                    },{
                        xtype:'displayfield',
                        value: 'Size (mm)',
                        width: 60
                    },{
                        fieldLabel: 'Size (mm)',
                        name: 'surface_snow_size',
                        xtype: 'numberfield',
                        width: 80
                    },{
                        xtype:'displayfield',
                        value: 'Rimed',
                        width: 60
                    },{
                        name: 'surface_snow_form_rimed',
                        xtype: 'checkbox'
                    }]
                },{
                    xtype: 'compositefield',
                    fieldLabel: 'Grain Form 2',
                    msgTarget : 'side',
                    height: 30,
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        hiddenName:'surface_snow_form_2',
                        width: 265,
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                                root: 'rows'
                            }, LookupVO),
                            autoLoad: true,
                            baseParams : {
                                lookup_code: 'snowonground',
                                allowBlankRecord: true
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
                        selectOnFocus:true,
                        cascadeComboId: 'surface_snow_form_2_minor'
                    },{
                        xtype:'combo',
                        hiddenName:'surface_snow_form_2_minor',
                        id: 'surface_snow_form_2_minor',
                        width: 265,
                        store: new Ext.data.Store({
                            reader: new Ext.data.JsonReader({
                            }, LookupVO)
                        }),
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },{
                        xtype:'displayfield',
                        value: 'Size (mm)',
                        width: 60
                    },{
                       name: 'surface_snow_size_2',
                        xtype: 'numberfield',
                        width: 80
                    },{
                        xtype:'displayfield',
                        value: 'Rimed',
                        width: 60
                    },{
                        name: 'surface_snow_form_rimed_2',
                        xtype: 'checkbox'
                }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'HS mm (inch)',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        name:'hs_accumulated',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        value: 'Comment',
                        width: 65
                    }
                    ,{
                        name:'hs_comment',
                        xtype: 'textfield'
                     }]
                },{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'HIN (Height is cm (inch); Water is mm (inch)',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Trace',
                        width: 60
                    }
                    ,{
                        name: 'hin_accumulated_trace',
                        width:30,
                        xtype: 'checkbox'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Height',
                        width: 60
                    }
                    ,{
                        name:'hin_accumulated',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Water',
                        width: 60
                    }
                    ,{
                        name:'hin_water_equivalent',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Mass',
                        width: 60
                    }
                    ,{
                        name:'hin_mass',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Density',
                        width: 60
                    }
                    ,{
                        name:'hin_density',
                        xtype: 'numberfield',
                        width: 60
                    }]
                },
		// 'h2d_accumulated_trace','h2d_accumulated', 'h2d_water_equivalent', 'h2d_mass', 'h2d_density',
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'H2D',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Trace',
                        width: 60
                    }
                    ,{
                        name: 'h2d_accumulated_trace',
                        width:30,
                        xtype: 'checkbox'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Height',
                        width: 60
                    }
                    ,{
                        name:'h2d_accumulated',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Water',
                        width: 60
                    }
                    ,{
                        name:'h2d_water_equivalent',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Mass',
                        width: 60
                    }
                    ,{
                        name:'h2d_mass',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Density',
                        width: 60
                    }
                    ,{
                        name:'h2d_density',
                        xtype: 'numberfield',
                        width: 60
                    }]
                },
                // 'hn24_accumulated_trace', 'hn24_accumulated', 'hn24_water_equivalent', 'hn24_mass', 'hn24_density',
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'HN24',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Trace',
                        width: 60
                    }
                    ,{
                        name: 'hn24_accumulated_trace',
                        width:30,
                        xtype: 'checkbox'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Height',
                        width: 60
                    }
                    ,{
                        name:'hn24_accumulated',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Water',
                        width: 60
                    },{
                        name:'hn24_water_equivalent',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Mass',
                        width: 60
                    }
                    ,{
                        name:'hn24_mass',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Density',
                        width: 60
                    }
                    ,{
                        name:'hn24_density',
                        xtype: 'numberfield',
                        width: 60
                    }]
                },
                // 'hst_accumulated_trace', 'hst_accumulated', 'hst_water_equivalent', 'hst_mass', 'hst_density', 'hst_cleared',
               {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'HST',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Trace',
                        width: 60
                    }
                    ,{
                        name: 'hst_accumulated_trace',
                        width:30,
                        cls: 'alignRight',
                        xtype: 'checkbox'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Height',
                        width: 60
                    }
                    ,{
                        name:'hst_accumulated',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Water',
                        width: 60
                    }
                    ,{
                        name:'hst_water_equivalent',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Mass',
                        width: 60
                    }
                    ,{
                        name:'hst_mass',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Density',
                        width: 60
                    }
                    ,{
                        name:'hst_density',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Cleared',
                        width: 60
                    }
                    ,{
                        name: 'hst_cleared',
                        width:30,
                        xtype: 'checkbox'
                    }]
                },
                // 'hit_accumulated_trace', 'hit_accumulated', 'hit_water_equivalent', 'hit_mass', 'hit_density',
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'HIT',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Trace',
                        width: 60
                    }
                    ,{
                        name: 'hit_accumulated_trace',
                        width:30,
                        xtype: 'checkbox'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Height',
                        width: 60
                    }
                    ,{
                        name:'hit_accumulated',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Water',
                        width: 60
                    }
                    ,{
                        name:'hit_water_equivalent',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Mass',
                        width: 60
                    }
                    ,{
                        name:'hit_mass',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Density',
                        width: 60

                    }
                    ,{
                        name:'hit_density',
                        xtype: 'numberfield',
                        width: 60
                    }]
                },
                // 'hsb_accumulated_trace', 'hsb_accumulated', 'hsb_water_equivalent', 'hsb_mass', 'hsb_density', 'hsb_cleared',
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'HSB',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Trace',
                        width: 60
                    }
                    ,{
                        name: 'hsb_accumulated_trace',
                        width:30,
                        xtype: 'checkbox'
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Height',
                        width: 60
                    }
                    ,{
                        name:'hsb_accumulated',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Water',
                        width: 60
                    }
                    ,{
                        name:'hsb_water_equivalent',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Mass',
                        width: 60
                    }
                    ,{
                        name:'hsb_mass',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Density',
                        width: 60
                    }
                    ,{
                        name:'hsb_density',
                        xtype: 'numberfield',
                        width: 60
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Cleared',
                        width: 60
                    }
                    ,{
                        name: 'hsb_cleared',
                        width:30,
                        xtype: 'checkbox'
                    }]
                }
                ]
            }

             // Wind Characteristics
            ,{
                xtype:'fieldset',
                collapsible: false,
                collapsed: false,
                width: '75%',
                title:'Wind and Transport Characteristics',
                items: [

                 {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Wind',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Direction',
                        width: 60
                    }
                    ,{
                        xtype:'combo',

                        hiddenName:'wind_direction_cat',
                        width: 200,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'aspect',
                                allowBlankRecord: true
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
                    }
                    ,{
                        xtype:'displayfield',
                        cls: 'alignRight',
                        value: 'Speed m/s',
                        width: 60
                    }
                    ,{
                        xtype:'combo',

                        hiddenName:'wind_speed_cat',
                        width: 200,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
	                            lookup_code: "windspeedestimation" + ( isOperationSWAG ? "_swag" : "" ),
                                allowBlankRecord: true
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
                    }]
                },
		{
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Ridge blowing snow',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'displayfield',
                        value: 'Transport',
                        width: 60
                    },{
                        xtype:'combo',

                        hiddenName:'ridge_blowing_snow_transport',
                        width: 200,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'blowingsnow',
                                allowBlankRecord: true
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
                    },{
                        xtype:'displayfield',
                        value: 'Direction',
                        width: 60
                    },{
                        xtype:'combo',
                        hiddenName:'ridge_blowing_snow_direction',
                        width: 200,
                        store: new Ext.data.JsonStore({
                            fields: [
                                {name: 'key'},
                                {name: 'code_value'},
                            ],
                            autoLoad: true,
                            root: 'rows',
                            baseParams : {
                                lookup_code: 'aspect',
                                allowBlankRecord: true
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
                    }]
                }
                ]
            },


            {
                xtype:'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title:'Air Pressure',
                items: [
                            // relative humidity  - positive integer to nearest 5 multiple
                            {
                                xtype: 'compositefield',
                                msgTarget : 'side',
                                height: 30,
                                fieldLabel: 'Relative humidity',
                                cls: 'composite-field',
                                width: '100%',
                                items: [
                                {
                                    name:'relative_humidity_num',
                                    xtype: 'numberfield',
                                    width: 170
                                },
                                //{
                                //    xtype:'displayfield',
                                //    cls: 'alignRight',
                                //    value: 'Trend',
                                //    width: 60
                                //},
                                //{
                                //    xtype:'combo',
                                //
                                //    hiddenName:'relative_humidity',
                                //    width: 200,
                                //    store: new Ext.data.JsonStore({
                                //        fields: [
                                //                    {name: 'key'},
                                //                    {name: 'code_value'},
                                //                ],
                                //        autoLoad: true,
                                //        root: 'rows',
                                //        baseParams :{
                                //                        lookup_code: 'pressuretrend',
                                //                        allowBlankRecord: true
                                //                    },
                                //        proxy: new Ext.data.ScriptTagProxy({
                                //            url: '/json/lookup_query_all/'
                                //            })
                                //    }),
                                //    valueField:'key',
                                //    displayField:'code_value',
                                //    editable: false,
                                //    triggerAction: 'all',
                                //    mode: 'local',
                                //    selectOnFocus:true
                                //}
                            ]
                        },
                            // numeric barometric presssure - postive float with 2 dec places
                           {
                                xtype: 'compositefield',
                                msgTarget : 'side',
                                height: 30,
                                fieldLabel: 'Barometric Pressure',
                                cls: 'composite-field',
                                width: '100%',
                                items: [
                                {
                                    name:'barometric_pressure',
                                    xtype: 'numberfield',
                                    width: 170
                                },
                                {
                                    xtype:'displayfield',
                                    cls: 'alignRight',
                                    value: 'Tendency',
                                    width: 60
                                },
                                {
                                    xtype:'combo',

                                    hiddenName:'barometric_pressure_tendency',
                                    width: 200,
                                    store: new Ext.data.JsonStore({
                                        fields: [
                                                    {name: 'key'},
                                                    {name: 'code_value'},
                                                ],
                                        autoLoad: true,
                                        root: 'rows',
                                        baseParams :{
                                                        lookup_code: 'pressuretrend',
                                                        allowBlankRecord: true
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
                                    xtype:'displayfield',
                                    cls: 'alignRight',
                                    value: 'Relative',
                                    width: 60
                                },
                                {
                                    xtype:'combo',

                                    hiddenName:'relative_humidity',
                                    width: 200,
                                    store: new Ext.data.JsonStore({
                                        fields: [
                                                    {name: 'key'},
                                                    {name: 'code_value'},
                                                ],
                                        autoLoad: true,
                                        root: 'rows',
                                        baseParams :{
                                                        lookup_code: 'pressurerelative',
                                                        allowBlankRecord: true
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
                                }
                            ]
                        }
                ]
            },
            {
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width:535
                }

                ]
            }
        ]
    });

   operationTerrainUtil = new OperationTerrainUtil(null,
                                                    null,
                                                    Ext.getCmp('observerCombo'),
                                                    Ext.getCmp('location') );

     // Form Container
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
                        entity: 'Weather',
                        form: 'pc.forms.observation.ObservationForm',
                        type: 'weatherstudyplotbrief__ObservationType__lookup'
                    },
                    submitEmptyText: false,
                    success: function(form, action) {
                        fsContainer.hide();
                        var key = Ext.decode(action.response.responseText).key;

                        grid.show();
                        tableStore.reload();
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
                grid.show();
            }
        }]
    });


    // TABLE
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
                                method: 'GET',
                                url: '/json/entity_delete/',
                                params:{
                                    key: records.data.key,
                                    entity: 'Weather'
                                },
                                success: function(action, options){
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
        }, WeatherVO),
        remoteSort: true,
        baseParams:{
            entity: 'Weather',
            type__ObservationType__lookup: 'weatherstudyplotbrief',
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
                        var record = new WeatherVO({    operation: operation.key,
                                            operation_desc:operation.name,
                                            created_by: party.key,
                                            created_by_desc: party.name,
                                            created_date: new Date(),
					    observer: party.key,
                                            date_time_start: new Date()});
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
                sortable : false,
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
                sortable : false,
                dataIndex: 'notable'
            },{
                id       :'subject',
                header   : 'Description',
                width    : 150,
                sortable : false,
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


     // LinkUtil
    var linkUtil = new LinkUtil({form: fs,
                                entity: 'Weather',
                                record: new WeatherVO(),
                                fn: function(records){
                                    operationTerrainUtil.reset();
                                    fs.getForm().loadRecord(records);
                                    operationTerrainUtil.loadLocation(records.data.operation);
                                    fsContainer.show();
                                    grid.hide();
                                }
    });
});
