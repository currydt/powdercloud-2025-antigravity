var controller, grid, masterStore, mapOverlay, container,
filterCmp, statusChart, depthChart, powdercloudHighChartsUtil;


function Controller(){
    this.store = masterStore;
    this.map = Ext.getCmp('mapViewer');
    this.filterCmp = filterCmp;

    this.statusChart = statusChart;
    this.depthChart = depthChart;
    Ext.StoreMgr.lookup('locationWithBlankRecord').load();

    this.store.on('load', function(store, records, options){

	this.series = [];
	var opNames = store.collect( 'operation_desc') ;
	Ext.each(opNames, function(item){
	    this.series.push({
		name: item,
		chart_data_status: [],
		chart_data_depth: []
	    });
	}, this);

        this.map.clearOverlays();
        store.each(function (record){
            this.map.addMapData(record.data.terrain_map_overlay, record);

	    Ext.each(this.series, function(item){
		if(item.name == record.data.operation_desc){
		    var date  = record.data.date_time_start;

		    if (record.data.history_status_desc && record.data.history_status_desc != "") {
                            var yValue = null;
                            switch(record.data.history_status_desc)
                            {
                                    case "layerstatus-d":
                                            yValue = 1;
                                            break;
                                    case "layerstatus-a":
                                            yValue = 2;
                                            break;
                                    case "layerstatus-l":
                                            yValue = 4;
                                            break;
                                    case "layerstatus-o":
                                            yValue = 6;
                                            break;
                                    case "layerstatus-i":
                                            yValue = 8;
                                            break;
                                    case "layerstatus-b":
                                            yValue = 12;
                                            break;
                            }
                            if (yValue != null) {
				item.chart_data_status.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), yValue]);
                            }
                    }

		    if (record.data.history_typical_depth) {
			item.chart_data_depth.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), record.data.history_typical_depth]);
		    }
		}
	    }, this);

        }, this);

	this.redrawChartData();

    }, this);
}

Controller.prototype.drawCharts = function(){

    powdercloudHighChartsUtil = new PowderCloudHighChartsUtil();

    statusChart = new Highcharts.Chart({
	chart: {
		renderTo: 'statusChart',
		marginBottom: 50
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
		}, {
			from: 1.5,
			to: 3.0,
			color: 'rgba(0, 0, 0, 0)',
			label: {
			   text: 'Active',
			   style: {
				  color: powdercloudHighChartsUtil.getTextColor()
			   }
			}
		}, {
			from: 3.0,
			to: 4.5,
			color: 'rgba(148, 148, 148, 0.1)',
			label: {
			   text: 'Lingering',
			   style: {
				  color: powdercloudHighChartsUtil.getTextColor()
			   }
			}
		}, {
			from: 4.5,
			to: 7.5,
			color: 'rgba(0, 0, 0, 0)',
			label: {
			   text: 'Dormant',
			   style: {
				  color: powdercloudHighChartsUtil.getTextColor()
			   }
			}
		}, {
			from: 7.5,
			to: 10.5,
			color: 'rgba(148, 148, 148, 0.1)',
			label: {
			   text: 'Inactive',
			   style: {
				  color: powdercloudHighChartsUtil.getTextColor()
			   }
			}
		}, {
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
		align: 'center',
		verticalAlign: 'bottom',
		y: 10,
		floating: true,
		borderWidth: 1
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

    depthChart = new Highcharts.Chart({
	chart: {
		renderTo: 'depthChart',
		defaultSeriesType: 'line',
		marginLeft: 75,
		marginBottom: 50
	},
	exporting: {
	    enabled: false
	},
	title: {
		text: 'Depth of Layer',
		style: {
		    color: powdercloudHighChartsUtil.getTextColor()
		}
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
		labels: {
		    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
		},
		max: new Date(),
		min: new Date()
	},
	yAxis: {
		title: {
		    text: 'Depth of Layer',
		    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
		},
		min: 0
	},
	tooltip: {
		shared: true,
		crosshairs: true
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
		align: 'center',
		verticalAlign: 'bottom',
		y: 10,
		floating: true,
		borderWidth: 1
	},
	series: [{
		id: 'depthSeries',
		name: 'Depth',
		color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
		data: []
	}]
    });
}

Controller.prototype.redrawChartData = function(){

    var chartStartDateUTC = powdercloudHighChartsUtil.generateViewableStartDateUTC(this.filterCmp.start_date);
    var chartEndDateUTC = powdercloudHighChartsUtil.generateViewableEndDateUTC(this.filterCmp.end_date);

    // remove all series from all charts
    while(statusChart.series.length > 0){
	statusChart.series[0].remove();
    }
    while(depthChart.series.length > 0){
	depthChart.series[0].remove();
    }

    // Set data
    Ext.each(this.series, function(seriesData){

	statusChart.addSeries({
	    name: seriesData.name,
	    data: seriesData.chart_data_status
	});

	depthChart.addSeries({
	    name: seriesData.name,
	    data: seriesData.chart_data_depth
	});

    }, this);

    // Set date range
    if (statusChart.get('xAxis')) {
	statusChart.get('xAxis').setExtremes(chartStartDateUTC, chartEndDateUTC);
    }
    if (depthChart.get('xAxis')) {
	depthChart.get('xAxis').setExtremes(chartStartDateUTC, chartEndDateUTC);
    }
}

Ext.onReady(function(){
    Ext.QuickTips.init();
    /*
        FILTER
    */
    filterCmp = new ModeDaterangeFilter();

    /*
        STORE
    */
    masterStore = new ModeDaterangeFilterStore({
        baseParams:{
			entity: 'PersistentLayer',
			type__ObservationType__lookup: 'layerevent',
			sort: 'date_time_start',
			dir: 'DESC'
	    },
	dateRange: 'created_date',
	autoLoad: false,
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, PersistentLayerVO)
    });
    filterCmp.regStore(masterStore);
    /*
        MAP
    */
    mapOverlay = new Ext.Panel({
        defaults: {
            anchor: '0'
        },
        items:[
	    {
		    xtype:'container',
		    html:'<p>The following map displays the location of the various observations. You can mange the view by using the toolbar (for example, Map or Earth). You can alter the scale using the vertical scale, and while in Earth mode you can alter the prespecitve with the upper left control.</p>'
	    },{
            xtype: 'gmappanel',
            itemId: 'mapViewer',
            id: 'mapViewer',
            //width: 966,
            width: '100%',
            height: 600,
            gmapType: 'map',
	    overlayDetailFields:[{
		name: 'history_created_date',
		fieldLabel: 'Update date',
		renderer: 'date',
		format: getDateFormat()
	    },{
		name: 'history_status_desc',
		fieldLabel: 'Status'
	    },{
		name: 'history_typical_depth',
		fieldLabel: 'Depth'
	    },{
		name: 'history_comments',
		fieldLabel: 'Comment'
	    }]
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
    // create the Grid
    grid = new Ext.grid.GridPanel({
	plugins:[expander],
        store: masterStore,
        loadMask: true,
	tbar: new Ext.Toolbar({
            items: [
		'Search by Location: ',
                {
                    xtype: 'combo',
		    store: 'locationWithBlankRecord',
                    searchBy: 'terrain',
		    searchStore:masterStore,
		    width: 150,
		    valueField: 'key',
		    displayField: 'name_nick',
		    editable: false,
		    triggerAction: 'all',
		    mode: 'local',
		    selectOnFocus: true,
		    forceSelection: true,
		    listeners: {
			scope: this,
			select:  function(cmp, record){
			    if(cmp.lastSearchValue === undefined || cmp.lastSearchValue != cmp.getValue()){
				if(Ext.isEmpty(cmp.getValue())){
				    delete cmp.searchStore.baseParams[cmp.searchBy];
				}	else {
				    cmp.searchStore.setBaseParam(cmp.searchBy,cmp.getValue());
				}
				cmp.lastSearchValue = cmp.getValue();
				cmp.searchStore.reload();				
			    }
			}
		    }
                }
            ]
        }),
        columns: [
	    expander,
	    {
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 200,
                sortable : true,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start'
            },{
                id       :'type',
                header   : 'Type',
                width    : 100,
                sortable : false,
                dataIndex: 'type_desc'
             },{
                id       :'operation',
                header   : 'Operation',
                width    : 140,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'terrain',
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },{
                id       :'notable',
                header   : 'Notable',
                width    : 80,
                dataIndex: 'notable',
		sortable : false
            },{
                id       :'subject',
                header   : 'Subject',
                width    : 140,
                dataIndex: 'subject',
		sortable : false
            }
        ],
        stripeRows: true,
        height: 400,
        width: '100%'
    });
    /*
        Controller
    */
    controller = new Controller();
    /*
	CONTAINER
    */
    container = new Ext.FormPanel({
	renderTo:'table-loc',
        plain: true,
	border: false,
        autoWidth: true,
	items:[
	    new Ext.form.FieldSet({
		title: 'Charts',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[{
			xtype:'container',
			html:'<p>The following section displays the layers summarized as charts.</p>'
		    },
		    new Ext.Container({
			html:'<table width="100%"><tr width="100%">'+
			    '<td width="50%"><div id="statusChart" class="dvDashboardChart"></div></td>'+
			    '<td width="50%"><div id="depthChart" class="dvDashboardChart"></div></td>'+
			    '</tr></table>',
			forceLayout : true,
			listeners:{
			    afterrender:{
				scope: this,
				fn: controller.drawCharts
			    }
			}
		    })
		]
	    }),
	    new Ext.form.FieldSet({
		title: 'Table',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[
		    grid
		]
	    }),
	    new Ext.form.FieldSet({
		title: 'Map Overlay',
		width: '100%',
		collapsible: false,
		border: true,
		items:[
		    mapOverlay
		],
		listeners:{
		    scope: this,
		    expand: function(cmp){
			var temp = Ext.getCmp('mapViewer');
			temp.getMap().checkResize();
		    }
		}
	    })
	],
	listeners:{
	    afterrender:{
		scope: this,
		fn: function(){
		    masterStore.load();
		}
	    }
	}
    });
});
