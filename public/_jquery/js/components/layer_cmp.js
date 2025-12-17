powdercloudHighChartsUtil = new PowderCloudHighChartsUtil();
LayerHistoryForm = Ext.extend(Ext.FormPanel, {
    form_url: "/json/entity_save/",
    autoWidth: true,
    autoHeight:true,
    form_params:{
        entity: 'PersistentLayerHistory',
        form: 'pc.forms.observation.ObservationForm',
        type: 'persistentlayerhistory__ObservationType__lookup'
    },
    waitMsgTarget: true,
    reader : new Ext.data.XmlReader({
        record : 'record',
        success: 'success'
    }, [
        {name: 'operation'}
    ]),
    compactView: false,
    errorReader: new Ext.form.JSONErrorReader(),
    initComponent: function() {
	if(this.compactView){
	     Ext.apply(this, {
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
                    name:'persistent_layer'
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
                    name:'date_time_start'
                },
		 {
                    xtype:'hidden',
                    name:'observer'
                },
                {
                    xtype:'combo',
                    fieldLabel: 'Status',
                    hiddenName:'status',
                    width: 200,
                    store: 'layerStatusStore',
                    valueField:'key',
                    displayField:'value',
                    editable: false,
                    triggerAction: 'all',
                    allowBlank: false,
                    msgTarget : 'side',
                    mode: 'local',
                    selectOnFocus:true
                },
                {
                    fieldLabel: 'Depth',
                    name: 'typical_depth',
                    allowBlank: false,
                    xtype: 'numberfield',
                    width: 200
                },
                {
                    fieldLabel: 'Notes', // Field.Observation.TH.comments_internal
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 500
                }
            ]
        });
	}	else {
	     Ext.apply(this, {
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
                    name:'terrain'
                },
                {
                    xtype:'hidden',
                    name:'persistent_layer'
                },
                {
                    xtype:'hidden',
                    name:'created_by'
                },{
                        fieldLabel: 'Date and time',
                        name: 'date_time_start',
                        xtype: 'datetimefield',
                        dateFormat: 'Y-m-d',
                        timeFormat: 'H:i',
                        width: 200
                    },{
                        xtype: 'displayfield',
                        fieldLabel: 'Data Recorder',
                        name:'created_by_desc',
                        width: 200
                    },{
                        xtype:'combo',
                        fieldLabel: 'Observer',
                        hiddenName:'observer',
                        store: 'observerActive',
			lastQuery: '',
                        valueField:'key',
                        displayField:'full_name',
                        editable: false,
                        triggerAction: 'all',
                        mode: 'local',
                        selectOnFocus:true,
                        width: 200
                    },
                {
                    xtype:'combo',
                    fieldLabel: 'Status',
                    hiddenName:'status',
                    width: 200,
                    store: 'layerStatusStore',
                    valueField:'key',
                    displayField:'value',
                    editable: false,
                    triggerAction: 'all',
                    allowBlank: false,
                    msgTarget : 'side',
                    mode: 'local',
                    selectOnFocus:true
                },
                {
                    fieldLabel: 'Depth',
                    name: 'typical_depth',
                    allowBlank: false,
                    xtype: 'numberfield',
                    width: 200
                },
                {
                    fieldLabel: 'Notes', // Field.Observation.TH.comments_internal
                    name: 'comments_internal',
                    xtype: 'textarea',
                    width: 500
                }
            ]
        });
	}

        LayerHistoryForm.superclass.initComponent.call(this);
    }
});

LayerPanelInfoSection = Ext.extend(Ext.Panel, {
    border:false,
    plain: true,
    autoHeight: true,
    tplMarkup: [
        '<div class="x-form-item "><label class="x-form-item-label">Nickname:</label> <div class="x-form-element">{nickname_text}</div><div class="x-form-clear-left"></div></div>'
    ],
    initComponent: function() {
        this.tpl = new Ext.Template(this.tplMarkup);
        Ext.apply(this, {
                bodyStyle: {
                        background: '#ffffff',
                        padding: '7px'
                },
                html: this.startingMarkup,
                listeners:{
                    afterrender:{
                        scope: this,
                        fn: this.onAfterRender
                    }
                }
        });
        LayerPanelInfoSection.superclass.initComponent.call(this);
    },
    onAfterRender: function(cmp){
        this.tpl.overwrite(this.body, this.record);
    }
});

LayerPanel = Ext.extend(Ext.Panel, {
    anchor: '100%',
    layout: 'fit',
    forceLayout: true,
    autoHeight:true,
    plain: true,
    bodyStyle: 'padding: 5px',
    collapsible: true,
    collapsed: true,
    initComponent: function () {
        //this.infoSection = new LayerPanelInfoSection();
        this.on('expand', this.clearInvalidForm , this);
	this.saveLayerHistoryBtn = new Ext.Button({
	     text: 'Save',
	    /*iconCls: 'ui-icon-disk',*/
	    scope: this,
	    handler: function(button){
		button.disable();
		this.fireEvent('saveLayerHistory', this);
	    }
	});
        this.form = new LayerHistoryForm({
            border: false,
            buttons:[this.saveLayerHistoryBtn,{
                text: 'Cancel',
                scope: this,
                handler: function(button){
                    this.collapse();
                }
            }]
        });
        this.form.enableBubble('save');
        this.enableBubble('save');
        this.chartDepthContainer = new Ext.Container({
            id:this.getId()+'-chart',
            width: 900,
            height: 300,
            html: '<div style="float:left;width:50%; height:300px;" id="'+this.getId()+'-chartDepth'+'"></div><div style="float:right;width:50%;height:300px;" id="'+this.getId()+'-chartDual'+'"></div>',
            listeners:{
                /*
                afterrender:{
                    scope:this,
                    fn:this.onAfterRenderChartDepthContainer
                }
                */
            }
        });
        this.chartDepthContainer.doLayout();

        this.store = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
            }, PersistentLayerHistoryVO),
            remoteSort: true,
            baseParams:{
                entity: 'PersistentLayerHistory',
		type__ObservationType__lookup: 'persistentlayerhistory'
            },
            proxy: new Ext.data.ScriptTagProxy({
                url: '/json/entity_query_all/'
            }),
            listeners:{
                load:{
                    scope:this,
                    fn:this.onStoreLoad
                }
            }
        });
        this.grid = new Ext.grid.GridPanel({
            store: this.store,
            loadMask: true,
            columns: [
                 {
                    header   : 'Status',
                    width    : 120,
                    sortable : false,
                    dataIndex: 'status_desc'
                },
                {
                    header   : 'Date',
                    width    : 140,
                    sortable : true,
                    dataIndex: 'date_time_start',
                    renderer: formatDate
                },
                {
                    header   : 'Depth',
                    width    : 100,
                    sortable : false,
                    dataIndex: 'typical_depth'
                },
                {
                    header   : 'Comments',
                    width    : 560,
                    sortable : false,
                    dataIndex: 'comments_internal'
                }
            ],
            stripeRows: true,
            autoHeight: true,
            width: '100%'
        });

        Ext.applyIf(this, {
	    items: [
                //this.infoSection,
                this.form,
            {
                xtype:'fieldset',
                collapsible: true,
                collapsed: true,
                autoHeight: true,
                width: '90%',
                title:'History',
                items: [
                {
		    xtype:'container',
		    html:'<p>The following charts display historical trends for the current layer. These charts provide both the depth of layer and status over the entire time period of this layer.</p>'
		},

                    this.chartDepthContainer,
                    this.grid
                ],
                listeners:{
                    expand:{
                        scope: this,
                        fn: this.redrawCharts
                    }
                }
            }]
	});
	// call the superclass's initComponent implementation
        LayerPanel.superclass.initComponent.call(this);
    },
    onAfterRenderChartDepthContainer: function(){
        var temp = Ext.get(this.getId()+'-chartDual');
        if(temp === null || temp === undefined){
            return;
        }
        this.chartDual = new Highcharts.Chart({
            chart: {
                    renderTo: this.getId()+'-chartDual',
		    width: 450
            },
            exporting: {
                enabled: false
            },
            title: {
                    text: 'Status',
                    style: {
                        color: powdercloudHighChartsUtil.getTextColor()
                    }
            },
            xAxis:{
                    id: 'xAxis',
                    type: 'datetime',
                    dateTimeLabelFormats: {
                            day: '%b %e'
                    },
                    title: {
                            text: null
                    },
                    labels: {
                        style: {
                            color: powdercloudHighChartsUtil.getTextColor()
                        }
                    },
                    max: new Date(),
                    min: new Date(),
                    plotBands: [
                            {
                                    from: new Date(),
                                    to:   new Date(),
                                    color: 'rgba(68, 170, 213, .1)',
                                    events: {
                                            click: function(e) {
                                                    hs.htmlExpand(null, {
                                                            pageOrigin: {
                                                                    x: e.pageX,
                                                                    y: e.pageY
                                                            },
                                                            headingText: 'Today',
                                                            maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', plotBand_today_date),
                                                            width: 200
                                                    });
                                            }
                                    }
                            }
                    ]


            },
            yAxis: [{
                // Primary y-axis
                title: {
                    text: 'Status',
                    style: {
                        color: powdercloudHighChartsUtil.getTextColor()
                    }
                },
                labels:{enabled:false},
                    min: 0,
		    max: 12,
		    startOnTick: false,
                    minorGridLineWidth: 0,
                    gridLineWidth: 0,
                    alternateGridColor: null,
                    plotBands: [{
                            from: 0.5,
                            to: 1.5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'Developing',
                               style: {
				    color: powdercloudHighChartsUtil.getTextColor()
				}
                            }
                    },
                    {
                            from: 1.5,
                            to: 3.0,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'Active',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    },
                    {
                            from: 3.0,
                            to: 4.5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'Lingering',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    },
                    {
                            from: 4.5,
                            to: 7.5,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'Dormant',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    },
                    {
                            from: 7.5,
                            to: 10.5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'Inactive',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    },
                    {
                            from: 10.5,
                            to: 12.0,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'Bonded',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }]
            }

            ],
            tooltip: {
                    shared: true,
                    crosshairs: true
            },
            credits: {
                    enabled: false
            },
            plotOptions: {
                    series: {
                            step: true,
                            cursor: 'pointer',
                            marker: {
                                    lineWidth: 1
                            }
                    }
            },
            legend: {
                    enabled: false
            },
            series: [{
                id: 'statusSeries',
                name: 'Status',
                color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                data: [
                ]
                }
            ]
        });

        this.chartDepth = new Highcharts.Chart({
            chart: {
                    renderTo: this.getId()+'-chartDepth',
                    defaultSeriesType: 'line',
                    marginLeft: 75,
                    marginBottom: 50,
		    width: 450
            },
            exporting: {
                enabled: false
            },
            title: {
                    text: 'Depth of Layer'
            },
            xAxis: {
                    id: 'xAxis',
                    type: 'datetime',
                    dateTimeLabelFormats: {
                            day: '%b %e'
                    },
                    title: {
                            text: null
                    },
                    max: new Date(),
                    min: new Date()
            },
            yAxis: {
                    title: {
                            text: 'Depth of Layer'
                    },
                    min: 0
            },
            tooltip: {
                    shared: false,
                    crosshairs: true
                    /*
                    ,
                    formatter: function() {
                            return 'The value for <b>'+ this.x + '</b> is <b>'+ this.y +'</b>';
                    }
                    */
            },
            credits: {
                    enabled: false,
                    text: chartConfig.creditsText,
                    href: chartConfig.creditsHref,
                    style: chartConfig.creditsStyle
            },
            plotOptions: {
                    series: {
                            cursor: 'pointer',
                            point: {
                                    events: {
                                            click: function(e) {
                                                    hs.htmlExpand(null, {
                                                            pageOrigin: {
                                                                    x: e.pageX,
                                                                    y: e.pageY
                                                            },
                                                            headingText: this.series.name,
                                                            maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
                                                                    this.y + ' cm' + '<br/><a href="#">View Observation</a>',
                                                            width: 200
                                                    });
                                            }
                                    }
                            },
                            marker: {
                                    lineWidth: 1
                            }
                    }
            },
            legend: {
                    enabled: false
            },
            series: [{
                    id: 'depthSeries',
                    name: 'Depth',
                    data: []
            }]
        });
        this.redrawCharts();
    },

    onStoreLoad: function(store, records, options){
        if(records === undefined){
            if(this.record !== undefined && this.record.data !== undefined && this.record.data.children !== undefined){
                var temp = [];
                this.store.removeAll();
                Ext.each(this.record.data.children.data.items, function(item){
                    this.store.insert(0 , item);
                }, this);
                this.store.commitChanges();
            }
        }
        this.chart_data = [];
        this.chart_data_dual = [];
        var maxDate = null;
        var minDate = null;
        this.store.each(function (item, index){
            var date = item.data.date_time_start;
            if(minDate == null){
                minDate = date;
            }   else if(minDate.getTime() - date.getTime() > 0){
                minDate = date;
            }
            if(maxDate == null){
                maxDate = date;
            }   else if(maxDate.getTime() - date.getTime() < 0){
                maxDate = date;
            }
            this.chart_data.push([date.getTime(), item.data.typical_depth]);

            if (item.data.status_code) {
                    var iconValue = null;
                    var yValue = null;
                    switch(item.data.status_code)
                    {
                            case "D":
                                    iconValue = "obscured.gif";
                                    yValue = 1;
                                    break;
                            case "A":
                                    iconValue = "overcast.gif";
                                    yValue = 2;
                                    break;
                            case "L":
                                    iconValue = "broken.gif";
                                    yValue = 4;
                                    break;
                            case "O":
                                    iconValue = "scattered.gif";
                                    yValue = 6;
                                    break;
                            case "I":
                                    iconValue = "few.gif";
                                    yValue = 8;
                                    break;
                            case "B":
                                    iconValue = "clear.gif";
                                    yValue = 12;
                                    break;
                    }
                    if (iconValue != null && yValue != null) {
                            this.chart_data_dual.push({
                                    //marker: {symbol: 'url(/static/client/hc/graphics/' + iconValue + ')'},
                                    x: date.getTime(),
                                    y: yValue
                            });
                    }
            }
        }, this);

		// Only draw charts if we have valid layer data
		if( this.chart_data && minDate && maxDate ) {
	        var half_day = 12*60*60*10*10*10;
	        this.minDate = minDate.getTime() - half_day;
	        this.maxDate = maxDate.getTime() + half_day;
	        this.redrawCharts();
		}
    },
    redrawCharts: function(){
        if(this.chartDepth === undefined){
            this.onAfterRenderChartDepthContainer();
        }   else {
            if (this.chartDepth.get('xAxis')) {
                this.chartDepth.get('xAxis').setExtremes(this.minDate, this.maxDate);
            }
            if (this.chartDepth.get('depthSeries')) {
                this.chartDepth.get('depthSeries').setData(this.chart_data, false);
            }

            if (this.chartDual.get('xAxis')) {
                this.chartDual.get('xAxis').setExtremes(this.minDate, this.maxDate);
            }
            if (this.chartDual.get('statusSeries')) {
                this.chartDual.get('statusSeries').setData(this.chart_data_dual, false);
            }
            this.chartDual.redraw();
            this.chartDepth.redraw();
        }


    },
    newRecord: function(){
        var temp = new PersistentLayerHistoryVO({persistent_layer: this.record.data.key,
                                        created_by: party.key,
                                        created_by_desc: party.name,
                                        created_date: new Date(),
					date_time_start: new Date()});
        this.form.getForm().setValues( newRecordForForm(temp));
    },
    load: function(layerRecord){
        this.record = layerRecord;
        this.store.setBaseParam('persistent_layer',this.record.data.key);
        this.onStoreLoad();
        this.setTitle(layerRecord.data.full_name);
        this.newRecord();
    },
    clearInvalidForm: function(){
        this.form.getForm().clearInvalid();
        this.expand();
    }
});
