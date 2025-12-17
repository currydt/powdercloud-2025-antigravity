Ext.namespace("pc.custom");
pc.custom.ActivityForecastForm = Ext.extend(Ext.Panel, {
    border: false,
    defaults: {
        anchor: '0',
        border: false
    },
    autoHeight: true,
    storesToLoad: ['observerActive',
                   'locationRegionForecast',
                   'temporalScale',
                   'spatialScale',
                   'confidence',
                   'aspect',
                   'windspeedestimation',
                   'precipitationtyperate',
                   'snowonground',
                   'avalanchecharacter',
                   'avalanchedistribution',
                   'concern_priority',
                   'triggersensitivity',
                   'triggerlikelihood',
                   'sizedestructive',
                   'dangerscale',
                   'stabilitytrending',
                   'stabilityratingscale',
                   'layerStatusStore',
                   'persistantLayerStore'],
    initComponent: function() {
        this.projectCombo = new Ext.form.ComboBox({
            fieldLabel: 'Project',
            hiddenName: 'project',
            store: 'projects',
            valueField: 'key',
            displayField: 'name',
            hidden: true,
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            selectOnFocus: false,
            forceSelection: false,
            width: 200
        });
        this.weatherForecastForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params: {
                entity: 'WeatherForecast',
                form: 'pc.forms.observation.ObservationForm',
                type: 'weatherforecast__ObservationType__lookup'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, WeatherForecastVO),
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
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
                name: 'operation'
            },
            {
                xtype: 'hidden',
                name: 'subject'
            },
            {
                xtype: 'hidden',
                name: 'terrain'
            },
            {
                xtype: 'hidden',
                name: 'date_time_start'
            },
            {
                xtype: 'hidden',
                name: 'observer'
            },
            {
                xtype: 'hidden',
                name: 'created_date'
            },
            {
                xtype: 'hidden',
                name: 'created_by'
            },
            {
                fieldLabel: 'Weather Systems and 500 mb flow',
                name: 'weather_system_flow_500_mb',
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
                items: [{
                    xtype: 'displayfield',
                    value: 'Wind direction',
                    width: 60
                },
                {
                    xtype: 'combo',

                    hiddenName: 'actuals_wind_direction_850_mb',
                    width: 100,
                    store: 'aspect',
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
                    store: 'windspeedestimation',
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
                items: [{
                    xtype: 'displayfield',
                    value: 'Wind direction',
                    width: 60
                },
                {
                    xtype: 'combo',

                    hiddenName: 'actuals_wind_direction_700_mb',
                    width: 100,
                    store: 'aspect',
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
                    store: 'windspeedestimation',
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
                }
                ]
            },
            {
                xtype: 'compositefield',
                fieldLabel: 'Precipitation Type & Rate',
                id: 'precipitation_composite',
                msgTarget: 'side',
                height: 30,
                cls: 'composite-field',
                width: '100%',
                items: [{
                    xtype: 'combo',
                    hiddenName: 'precipitation_type_rate',
                    width: 265,
                    store: 'precipitationtyperate',
                    valueField: 'key',
                    displayField: 'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: true,
                    cascadeComboId: 'weatherforecast_precipitation_type_rate_minor'
                }, {
                    xtype: 'combo',
                    hiddenName: 'precipitation_type_rate_minor',
                    id: 'weatherforecast_precipitation_type_rate_minor',
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
                    store: 'aspect',
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
                    store: 'windspeedestimation',
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
                store: 'confidence',
                valueField: 'key',
                displayField: 'value',
                editable: false,
                triggerAction: 'all',
                mode: 'local',
                width: 265,
                selectOnFocus: true
            }]
        });

        /*
        FIELD WEATHER SECTION
        */
        this.weatherForecastSection = new Ext.form.FieldSet({
            title: 'Forecast Weather',
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides the standard forecast weather that is set the location, date, and forecaster completing this evaluation. </p>'
                },
                this.weatherForecastForm
            ]
        });

        /*
        RELEVANT OBSERVATIONS
        */
        /*
            RELEVANT WEATHER NARRATIVE
        */
        this.releventWeatherNarrativeForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Weather',
                form: 'pc.forms.observation.ObservationForm',
                type: 'weathernarrative__ObservationType__lookup'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, WeatherVO),
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
            {
                xtype: 'hidden',
                name: 'subject'
            },
            {
                xtype:'hidden',
                name:'operation'
            },
            {
                xtype:'hidden',
                name:'terrain'
            },
            {
                xtype:'hidden',
                name:'date_time_start'
            },
            {
                xtype:'hidden',
                name:'observer'
            },
            {
                xtype:'hidden',
                name:'created_date'
            },
            {
                xtype:'hidden',
                name:'created_by'
            },
            {
                fieldLabel: 'Nearest Neighbour Discussion',
                name: 'remark',
                xtype: 'textarea',
                width: 500
            },
            {
                    xtype:'container',
                    html:'<a href="/analysis/weather/" target="_blank">Open Weather Analysis</a>'
            },
            {
                fieldLabel: 'Relevant Weather Narrative',
                name: 'comments_internal',
                xtype: 'textarea',
                width: 500
            }
            ]
        });
        /*
            RELEVANT AVALANCHE FORM
        */
        this.releventAvalancheNarrativeForm  = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Avalanche',
                form: 'pc.forms.observation.ObservationForm',
                type: 'avalanchenarrative__ObservationType__lookup'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, AvalancheVO),
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[
            {
                xtype:'hidden',
                name:'key'
            },{
                xtype:'hidden',
                name:'subject'
            },
            {
                xtype:'hidden',
                name:'operation'
            },
            {
                xtype:'hidden',
                name:'terrain'
            },
            {
                xtype:'hidden',
                name:'date_time_start'
            },
            {
                xtype:'hidden',
                name:'observer'
            },
            {
                xtype:'hidden',
                name:'created_date'
            },
            {
                xtype:'hidden',
                name:'created_by'
            },
            {
                fieldLabel: 'Relevant Avalanche Narrative',
                name: 'comments_internal',
                xtype: 'textarea',
                width: 500
            }]
        });
        /*
            RELEVANT AVALANCHE FORM
        */
        this.releventSnowpackNarrativeForm  = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'SnowpackStructure',
                form: 'pc.forms.observation.ObservationForm',
                type: 'snowpackstructure__ObservationType__lookup'
            },
            waitMsgTarget: true,
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, SnowpackStructureVO),
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items:[{
                xtype:'hidden',
                name:'key'
            },
            {
                xtype:'hidden',
                name:'operation'
            },{
                xtype:'hidden',
                name:'subject'
            },
            {
                xtype:'hidden',
                name:'terrain'
            },
            {
                xtype:'hidden',
                name:'date_time_start'
            },
            {
                xtype:'hidden',
                name:'observer'
            },
            {
                xtype:'hidden',
                name:'created_date'
            },
            {
                xtype:'hidden',
                name:'created_by'
            },
            {
                fieldLabel: 'Relevant Snowpack Narrative',
                name: 'comments_internal',
                xtype: 'textarea',
                width: 500
            }
            ]
        });
        /*
            RELEVANT OBSERVATIONS SECTION
        */
        this.releventSection = new Ext.form.FieldSet({
            title: 'Relevant Observations',
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides you, the user with fields to record your nearest neighbour activities and review. This is a private field.</p>'
                },
                {
                    xtype:'container',
                    html:'<p>The following fields, may be used to record the individual opeation activities, review, and projections.  If operation settings permit, these data may be published or exported. For examaple, InfoEx users export the Avalanche and Snowpack fields.</p>'
                },


                // TODO: dp This needs a link to the Weather analysis for the Operation for last week? days? whatever we can do
                {
                    xtype:'container',
                    html:''
                },
                this.releventWeatherNarrativeForm,


                // TODO: dp This needs a link to the Weather analysis for the Operation for last week? days? whatever we can do
                {
                    xtype:'container',
                    html:''
                },
                {
                    xtype:'container',
                    html:'<a href="/analysis/avalanche/" target="_blank">Open Avalanche Analysis</a>'
                },
                this.releventAvalancheNarrativeForm ,


                // TODO: dp This needs a link to the Weather analysis for the Operation for last week? days? whatever we can do
                {
                    xtype:'container',
                    html:''
                },
                {
                    xtype:'container',
                    html:'<a href="/analysis/snowpack-structure/" target="_blank">Open Snowpack Structure</a>'
                },
                 this.releventSnowpackNarrativeForm

            ]
        });


        /*
            HAZARD CHART SECTION
        */
        /*
        hazardChartSection = new Ext.form.FieldSet({
            title: 'Hazard Chart',
            hidden: true,
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[{
                xtype: 'container',
                id: 'hazard_svg_div_parent'
            }]
        });
        */

        /*
            DANGER RATING
        */

        /*
            DANGER RATING FORM
        */
        this.dangerRatingForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Rating',
                form: 'pc.forms.observation.ObservationForm',
                type: 'ratingdanger__ObservationType__lookup'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, RatingVO),
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
                 {
                    xtype:'hidden',
                    name:'subject'
                },
                {
                    xtype:'hidden',
                    name:'operation'
                },
                {
                    xtype:'hidden',
                    name:'created_date'
                },
                {
                    xtype:'hidden',
                    name:'created_by'
                },
                {
                    xtype:'hidden',
                    name:'terrain'
                },
                {
                    xtype:'hidden',
                    name:'observer'
                },
                {
                    xtype:'hidden',
                    name:'date_time_start'
                },
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Alpine',
                    cls: 'composite-field',
                    width: '100%',
                    items: [

                        {
                        xtype:'combo',
                        hiddenName:'danger_scale_alpine',
                        width: 200,
                        store: 'dangerscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
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
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Treeline',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        hiddenName:'danger_scale_treeline',
                        width: 200,
                        store: 'dangerscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
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
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Below treeline',
                    cls: 'composite-field',
                    width: '100%',
                    items: [{
                        xtype:'combo',
                        hiddenName:'danger_scale_below_treeline',
                        width: 200,
                        store: 'dangerscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
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
                    xtype:'combo',
                    fieldLabel: 'Danger Trending',
                    hiddenName:'stability_trending',
                    store: 'stabilitytrending',
                    valueField:'key',
                    displayField:'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true,
                    width: 265
                },
                {
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 500
                }
            ]
        });
        /*
            DANGER RATING SECTION
        */
        this.dangerRatingSection = new Ext.form.FieldSet({
            title: 'Avalanche Danger',
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides a standard danger rating that is set the location, date, and forecaster completing this evaluation.</p>'
                },
                this.dangerRatingForm
            ]
        });
        /*
            STABILITY RATING
        */

        /*
            STABILITY RATING FORM
        */
        this.stabilityRatingForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Rating',
                form: 'pc.forms.observation.ObservationForm',
                type: 'ratingstability__ObservationType__lookup'
            },
            defaults: {
                anchor: '0'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, RatingVO),
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
                {
                    xtype:'hidden',
                    name:'operation'
                },
                {
                    xtype:'hidden',
                    name:'subject'
                },
                {
                    xtype:'hidden',
                    name:'created_date'
                },
                {
                    xtype:'hidden',
                    name:'created_by'
                },
                {
                    xtype:'hidden',
                    name:'terrain'
                },
                {
                    xtype:'hidden',
                    name:'observer'
                },
                {
                    xtype:'hidden',
                    name:'date_time_start'
                },
                {
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Alpine',
                    cls: 'composite-field',
                    width: '100%',
                    items: [

                        {
                        xtype:'combo',
                        hiddenName:'stability_scale_alpine',
                        width: 200,
                        store: 'stabilityratingscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
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
                    xtype: 'compositefield',
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Treeline',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'combo',
                        hiddenName:'stability_scale_treeline',
                        width: 200,
                        store: 'stabilityratingscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
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
                    msgTarget : 'side',
                    height: 30,
                    fieldLabel: 'Below Treeline',
                    cls: 'composite-field',
                    width: '100%',
                    items: [
                    {
                        xtype:'combo',
                        hiddenName:'stability_scale_below_treeline',
                        width: 200,
                        store: 'stabilityratingscale',
                        valueField:'key',
                        displayField:'code_value',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true
                    },
                    {
                        xtype:'displayfield',
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
                    xtype:'combo',
                    fieldLabel: 'Stability Trending',
                    hiddenName:'stability_trending',
                    store: 'stabilitytrending',
                    valueField:'key',
                    displayField:'code_value',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus:true,
                    width: 265
                },
                {
                    fieldLabel: 'Notes',
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 500
                }
                ]
        });
        /*
            STABILITY RATING SECTION
        */
        this.stabilityRatingSection = new Ext.form.FieldSet({
            title: 'Stability Rating',
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides a standard stability rating that is set the location, date, and forecaster completing this evaluation.</p>'
                },
                this.stabilityRatingForm
            ]
        });
        /*
            PROGRAM
        */
        this.programForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            form_params:{
                entity: 'Program',
                form: 'pc.forms.activities.ProgramForm',
                type: 'programforecast__ObservationType__lookup'
            },
            reader: new Ext.data.JsonReader({
                root: 'rows'
            }, ProgramVO),
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
                {
                    xtype:'hidden',
                    name:'subject'
                },
                {
                    xtype:'hidden',
                    name:'terrain'
                },
                {
                    xtype:'hidden',
                    name:'date_time_start'
                },
                {
                    xtype:'hidden',
                    name:'operation'
                },
                {
                    xtype:'hidden',
                    name:'operation'
                },
                {
                    xtype:'hidden',
                    name:'created_date'
                },
                {
                    xtype:'hidden',
                    name:'created_by'
                },
                {
                    fieldLabel: 'Operation logistics',
                    name: 'operational_logistics',
                    xtype: 'textarea',
                    width: 500
                },
                {
                    fieldLabel: 'Risk Management',
                    name: 'snow_safety_objectives',
                    xtype: 'textarea',
                    width: 500
                },
                {
                    fieldLabel: 'Field Work Objectives',
                    name: 'field_work_objectives',
                    xtype: 'textarea',
                    width: 500
                },
                {
                    fieldLabel: 'Skiing quality',
                    name: 'skiing_quality',
                    xtype: 'textarea',
                    width: 500
                }
                ]

        });
        /*
            PROGRAM SECTION
        */
        this.programSection = new Ext.form.FieldSet({
            title: 'Program',
            hidden: true,
            collapsible: true,
            collapsed: true,
            border: true,
            defaults:{
                border:false
            },
            items:[
                {
                    xtype:'container',
                    html:'<p>This section provides a program observation that is set to the location, date, and forecaster completing the evaluation.</p>'
                },
                this.programForm
            ]
        });
        this.mainForm = new Ext.FormPanel({
            form_url: "/json/entity_save/",
            params: {
                entity: 'Activity',
                form: 'pc.forms.activities.ActivityForm',
                type: 'hazfore__ActivityType__lookup'
            },
            waitMsgTarget: true,
            errorReader: new Ext.form.JSONErrorReader(),
            defaults: {
                width: 160
            },
            items: [
            {
                xtype: 'hidden',
                itemId: 'key',
                name: 'key'
            },
            {
                xtype: 'hidden',
                name: 'operation'
            },
            {
                xtype: 'hidden',
                itemId: 'weather_forecast',
                name: 'weather_forecast'
            },
            {
                xtype: 'hidden',
                itemId: 'weather_narrative',
                name: 'weather_narrative'
            },
            {
                xtype: 'hidden',
                itemId: 'avalanche_narrative',
                name: 'avalanche_narrative'
            },
            {
                xtype: 'hidden',
                itemId: 'snowpack_narrative',
                name: 'snowpack_narrative'
            },
            {
                xtype: 'hidden',
                itemId: 'rating_danger',
                name: 'rating_danger'
            },
            {
                xtype: 'hidden',
                itemId: 'rating_stability',
                name: 'rating_stability'
            },
            {
                xtype: 'hidden',
                itemId: 'program',
                name: 'program'
            },
            {
                xtype: 'hidden',
                name: 'created_date'
            },
            {
                xtype: 'hidden',
                name: 'created_by'
            },
            // Operational Header
            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Operational Header',
                items: [
                {
                        xtype:'container',
                        html:'<p> This section allows you to record details related to your operation. The notable and description fields are provided to assist in identifying specific obserations. </p>'
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Operation',
                    name: 'operation_desc',
                    width: 200
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Data Recorder',
                    width: 200,
                    name: 'created_by_desc'
                },
                    this.projectCombo,
                {
                    xtype: 'combo',
                    fieldLabel: 'Forecaster',  // really obs in model
                    hiddenName: 'observer',
                    itemId: 'observer',
                    store: 'observerActive',
                    lastQuery: '',
                    valueField: 'key',
                    displayField: 'full_name',
                    editable: false,
                    triggerAction: 'all',
                    mode: 'local',
                    selectOnFocus: false,
                    forceSelection: false,
                    allowBlank: false,
                    width: 200
                },
                //{
                //    xtype: 'combo',
                //    fieldLabel: 'Forecaster',
                //    hiddenName: 'forecaster',
                //    store: 'observerActive',
                //    valueField: 'key',
                //    displayField: 'full_name',
                //    editable: false,
                //    triggerAction: 'all',
                //    mode: 'local',
                //    selectOnFocus: false,
                //    forceSelection: false,
                //    allowBlank: false,
                //    width: 200
                //},
                //{
                //    fieldLabel: 'Notable',
                //    name: 'notable',
                //    xtype: 'checkbox',
                //    width: 100
                //},
                {
                    fieldLabel: 'Verified ?',
                    name: 'verified',
                    xtype: 'checkbox',
                    width: 40
                },
                {
                    fieldLabel: 'Name',
                    name: 'name',
                    xtype: 'textfield',
                    allowBlank: false,
                    width: 600
                }
            ]
            },

            // Scope Header
            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '100%',
                title: 'Scope',
                items: [
                                {
                                        xtype:'container',
                                        html:'<p> This section allows you to specify the observation date and time, and its key location. Locations are limited to type Forecast Zone. </p>'
                                },
                                {
                                    fieldLabel: 'Date and time',
                                    itemId: 'date_time_start',
                                    name: 'date_time_start',
                                    xtype: 'datetimefield',
                                    dateFormat: 'Y-m-d',
                                    timeFormat: 'H:i',
                                    allowBlank: false,
                                    width: 200
                                },
                                {
                                    xtype: 'combo',
                                    hiddenName: 'hazard_temporal_scale',
                                    fieldLabel: 'Temporal Scale',
                                    store: 'temporalScale',
                                    width: 200,
                                    valueField: 'key',
                                    displayField: 'value',
                                    editable: false,
                                    triggerAction: 'all',
                                    mode: 'local',
                                    selectOnFocus: true
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: 'Location',
                                    itemId: 'location',
                                    hiddenName: 'terrain',
                                    width: 200,
                                    store: 'locationRegionForecast',
                                    valueField: 'key',
                                    displayField: 'name_nick',
                                    editable: false,
                                    triggerAction: 'all',
                                    mode: 'local',
                                    allowBlank: false,
                                    selectOnFocus: true
                                },
                                {
                                    xtype: 'combo',
                                    hiddenName: 'hazard_spatial_scale',
                                    fieldLabel: 'Spatial Scale',
                                    width: 200,
                                    store: 'spatialScale',
                                    valueField: 'key',
                                    displayField: 'value',
                                    editable: false,
                                    triggerAction: 'all',
                                    mode: 'local',
                                    selectOnFocus: true
                                }
                            ]
                    },

            // Details
            {
                xtype: 'fieldset',
                collapsible: true,
                collapsed: false,
                width: '75%',
                title: 'Details',
                items: [
                                {
                                fieldLabel: 'Notes',
                                name: 'comments_internal',
                                xtype: 'textarea',
                                width: 600
                            }
                        ]
            }]
        })

        this.layerSection = new pc.custom.LayerCmp({
            collapsed: true
        });
        this.concernsSection = new pc.custom.ConcernCmp({
            collapsed: true,
            parent: this
        });
        Ext.applyIf(this, {
            items: [
                this.mainForm,
                this.releventSection,
                this.weatherForecastSection,
                this.layerSection,
                this.concernsSection,
                this.dangerRatingSection,
                this.stabilityRatingSection,
                this.programSection
            ]
        });
        this.saveButton = new Ext.Button({
            text: 'Save',
            scope: this,
            handler: function(button) {
                this.fireEvent('save');
            }
        });
        this.continueButton = new Ext.Button({
            text: 'Continue',
            scope: this,
            handler: function(button) {
                this.fireEvent('continue');
            }
        });
        this.buttons = [
        this.saveButton, this.continueButton,
        {
            text: 'Cancel',
            scope: this,
            handler: function(button) {
                this.fireEvent('cancel');
            }
        }];
        pc.custom.ActivityForecastForm.superclass.initComponent.call(this);
        this.mainForm.on('setValue', this.onRecordSet, this)
    },
    formState: function(stateName) {
        if (stateName == 'create') {
            this.continueButton.show();
            this.saveButton.hide();
            this.weatherForecastSection.hide();
            this.releventSection.hide();
            this.dangerRatingSection.hide();
            this.stabilityRatingSection.hide();
            this.layerSection.hide();
            this.concernsSection.hide();
            this.programSection.hide();
        } else {
            this.continueButton.hide();
            this.saveButton.show();
            this.weatherForecastSection.show();
            this.releventSection.show();
            this.dangerRatingSection.show();
            this.stabilityRatingSection.show();
            this.layerSection.show();
            this.concernsSection.show();
            this.programSection.show();
        }

    },
    resetForms: function() {
        this.weatherForecastForm.getForm().setValues( newRecordForForm(new WeatherForecastVO({})));
        this.releventWeatherNarrativeForm.getForm().setValues( newRecordForForm(new WeatherVO({})));
        this.releventAvalancheNarrativeForm.getForm().setValues( newRecordForForm(new AvalancheVO({})));
        this.releventSnowpackNarrativeForm.getForm().setValues( newRecordForForm(new SnowpackStructureVO({})));
        this.stabilityRatingForm.getForm().setValues( newRecordForForm(new RatingVO({})));
        this.dangerRatingForm.getForm().setValues( newRecordForForm(new RatingVO({})));
        this.programForm.getForm().setValues( newRecordForForm(new ProgramVO({})));
    },
    saveData: function() {
        this.saveButton.disable();
        this.saveCounter = 0;
        this.saveCounter++;// weatherForecastForm
        this.saveCounter++;// releventWeatherNarrativeForm
        this.saveCounter++;// releventAvalancheNarrativeForm
        this.saveCounter++;// releventSnowpackNarrativeForm
        this.saveCounter++;// stabilityRatingForm
        this.saveCounter++;// dangerRatingForm
        this.saveCounter++;// programForm

        var parentValues = {
            terrain: this.mainForm.getForm().getValues().terrain,
            observer:this.mainForm.getForm().getValues().observer,
            subject: 'AHF: '+ this.mainForm.getForm().getValues().date_time_start+' '+this.mainForm.getForm().getValues().name,
            date_time_start:this.mainForm.getForm().getValues().date_time_start
        };

        this.weatherForecastForm.getForm().setValues(parentValues);
        this.weatherForecastForm.getForm().submit({
            url: this.weatherForecastForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.weatherForecastForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.weatherForecastForm.reader.extractData([recordServerJSON], true)[0];
                this.weatherForecastForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    weather_forecast: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.releventWeatherNarrativeForm.getForm().setValues(parentValues);
        this.releventWeatherNarrativeForm.getForm().submit({
            url: this.releventWeatherNarrativeForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.releventWeatherNarrativeForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.releventWeatherNarrativeForm.reader.extractData([recordServerJSON], true)[0];
                this.releventWeatherNarrativeForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    weather_narrative: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.releventAvalancheNarrativeForm.getForm().setValues(parentValues);
        this.releventAvalancheNarrativeForm.getForm().submit({
            url: this.releventAvalancheNarrativeForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.releventAvalancheNarrativeForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.releventAvalancheNarrativeForm.reader.extractData([recordServerJSON], true)[0];
                this.releventAvalancheNarrativeForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    avalanche_narrative: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.releventSnowpackNarrativeForm.getForm().setValues(parentValues);
        this.releventSnowpackNarrativeForm.getForm().submit({
            url: this.releventSnowpackNarrativeForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.releventSnowpackNarrativeForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.releventSnowpackNarrativeForm.reader.extractData([recordServerJSON], true)[0];
                this.releventSnowpackNarrativeForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    snowpack_narrative: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.stabilityRatingForm.getForm().setValues(parentValues);
        this.stabilityRatingForm.getForm().submit({
            url: this.stabilityRatingForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.stabilityRatingForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.stabilityRatingForm.reader.extractData([recordServerJSON], true)[0];
                this.stabilityRatingForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    rating_stability: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.dangerRatingForm.getForm().setValues(parentValues);
        this.dangerRatingForm.getForm().submit({
            url: this.dangerRatingForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.dangerRatingForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.dangerRatingForm.reader.extractData([recordServerJSON], true)[0];
                this.dangerRatingForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    rating_danger: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });

        this.programForm.getForm().setValues(parentValues);
        this.programForm.getForm().submit({
            url: this.programForm.form_url,
            waitMsg: 'Saving Data...',
            scope: this,
            params: this.programForm.form_params,
            submitEmptyText: false,
            success: function(form, action) {
                var key = Ext.decode(action.response.responseText).key;
                var recordServerJSON = Ext.decode(action.response.responseText).record;
                var record = this.programForm.reader.extractData([recordServerJSON], true)[0];
                this.programForm.getForm().setValues(newRecordForForm(record));
                this.mainForm.getForm().setValues({
                    program: key
                });
                this.saveCounter--;
                this.saveDataComplete();
            },
            failure: function(form, action) {
                this.saveButton.enable();
                formFailureFunction();
            }
        });
    },
    saveDataComplete: function(){
        if(this.saveCounter == 0){
            this.fireEvent('dataSaved');
        }
    },
    onRecordSet: function(){

        var date = this.mainForm.getForm().getFieldValues().date_time_start;
        this.concernsSection.concernsStore.setBaseParam('date_time_start__range', date.format('Y-m-d 00:00')+'/'+date.format('Y-m-d 23:59'));
        this.concernsSection.concernsStore.load();
    },
    loadData: function(){
        var key = this.mainForm.get('key');
        key = key.getValue();
        if(key){
            if(this.mainForm.get('weather_forecast').getValue()){
                this.weatherForecastForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'WeatherForecast',
                        key: this.mainForm.get('weather_forecast').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('weather_narrative').getValue()){
                this.releventWeatherNarrativeForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Weather',
                        key: this.mainForm.get('weather_narrative').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('avalanche_narrative').getValue()){
                this.releventAvalancheNarrativeForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Avalanche',
                        key: this.mainForm.get('avalanche_narrative').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('snowpack_narrative').getValue()){
                this.releventSnowpackNarrativeForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'SnowpackStructure',
                        key: this.mainForm.get('snowpack_narrative').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('rating_stability').getValue()){
                this.stabilityRatingForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Rating',
                        key: this.mainForm.get('rating_stability').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('rating_danger').getValue()){
                this.dangerRatingForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Rating',
                        key: this.mainForm.get('rating_danger').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
            if(this.mainForm.get('program').getValue()){
                this.programForm.getForm().load({
                    url:'/json/entity_query_single/',
                    params:{
                        entity: 'Program',
                        key: this.mainForm.get('program').getValue()
                    },
                    waitMsg:'Loading'
                });
            }
        }
    }
});
Ext.reg('activityforecastform', pc.custom.ActivityForecastForm);
