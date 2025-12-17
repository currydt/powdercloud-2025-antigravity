var controller, grid, masterStore, mapOverlay, container, photoAnalysisOverlay,
chart, chartFailureType, chartTriggerType,
filterCmp, powdercloudSvgRose, powdercloudHighChartsUtil;

function Controller(){
    this.store = masterStore;
    this.map = Ext.getCmp('mapViewer');
    this.filterCmp = filterCmp;
    // data sets
    this.chart_data = [];
    this.chart_failure_type_data = [];
    this.chart_trigger_type_data = [];
    Ext.StoreMgr.lookup('locationWithBlankRecord').load();


    this.store.on('load', function(store, records, options){
        this.map.clearOverlays();
        this.chart_data = [];
        var recordsArray = [];
        this.rose_data = [];
	this.chart_trigger_type_data = [0,0,0,0,0,0,0,0,0,0];
	this.chart_failure_type_data = (isOperationSWAG)? [0,0,0,0,0,0,0,0,0,0]: [0,0,0,0,0,0,0];
        store.each(function (record){
            recordsArray.push(record.data);
            this.map.addMapData(record.data.map_overlay, record);
	    if(record.data.type_desc == "avalancheeventstandard" || record.data.type_desc == "avalancheeventmultiple"){
		var date  = record.data.date_time_start;
		var key = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999));
		var isKeyPresent = false;

		Ext.each(this.chart_data, function (item, index){
		    if(item[0] == key){
			item[1] = item[1] + 1;
			isKeyPresent = true;
		    }
		});
		if(!isKeyPresent){
		    this.chart_data.push([key, 1]);
		}
		if (record.data.trigger_code) {
			var iconValue = null;
			var yValue = null;
			switch(record.data.trigger_code)
			{
				case "N":
					yValue = 1;
					break;
				case "X":
					yValue = 2;
					break;
				case "S":
					yValue = 3;
					break;
				case "B":
					yValue = 4;
					break;
				case "C":
					yValue = 5;
					break;
				case "M":
					yValue = 6;
					break;
				case "V":
					yValue = 7;
					break;
				case "H":
					yValue = 8;
					break;
				case "O":
					yValue = 9;
					break;
				case "U":
					yValue = 10;
					break;
			}
			if (yValue != null) {
				this.chart_trigger_type_data[yValue-1] = this.chart_trigger_type_data[yValue-1]+1;
			}
		}
		if (record.data.failure_type_code) {
			var iconValue = null;
			var yValue = null;
			if(isOperationSWAG){
			    switch(record.data.failure_type_code){
				case "L":
					yValue = 1;
					break;
				case "WL":
					yValue = 2;
					break;
				case "SS":
					yValue = 3;
					break;
				case "HS":
					yValue = 4;
					break;
				case "WS":
					yValue = 5;
					break;
				case "I":
					yValue = 6;
					break;
				case "SF":
					yValue = 7;
					break;
				case "C":
					yValue = 8;
					break;
				case "R":
					yValue = 9;
					break;
				case "U":
					yValue = 10;
					break;
			    }
			}	else {
			    switch(record.data.failure_type_code)
			    {
				case "S":
					yValue = 1;
					break;
				case "L":
					yValue = 2;
					break;
				case "LS":
					yValue = 3;
					break;
				case "C":
					yValue = 4;
					break;
				case "CS":
					yValue = 5;
					break;
				case "I":
					yValue = 6;
					break;
				case "IS":
					yValue = 7;
					break;
			    }
			}
			
			if (yValue != null) {
				this.chart_failure_type_data[yValue-1] = this.chart_failure_type_data[yValue-1]+1;
			}
		}


		// ROSE Data - Start
		if(record.data.type_desc == "avalancheeventstandard" || record.data.type_desc == "avalancheeventmultiple"){
                    var subtype;
		    var avSizeRangeStart = null;
		    var avSizeRangeEnd = null;
		    // Strip off "D" prefix on destructive size
		    if (record.data.destructive_size_min_code && record.data.destructive_size_min_code != "") {
			avSizeRangeStart = record.data.destructive_size_min_code.replace("D", "");
			avSizeRangeStart = parseFloat(avSizeRangeStart);
		    }
		    if (record.data.destructive_size_max_code && record.data.destructive_size_max_code != "") {
			avSizeRangeEnd = record.data.destructive_size_max_code.replace("D", "");
			avSizeRangeEnd = parseFloat(avSizeRangeEnd);
		    }
		    var roseDateItem;
		    if(record.data.type_desc == "avalancheeventstandard"){
			subtype = SUB_TYPE_AVALANCHE_SINGLE;
			roseDateItem  = {
			    "type": TYPE_AVALANCHE,
			    "subtype": subtype,
			    "elevation" : record.data.elevation_min,
			    "size" : avSizeRangeEnd,
			    "aspectCode" : record.data.aspect_start_code,
			    "triggerCode" : record.data.trigger_minor_code,
			    "description" : record.data.comments_internal
			};
		    }
		    if(record.data.type_desc == "avalancheeventmultiple"){
			subtype = SUB_TYPE_AVALANCHE_MULTIPLE;
			roseDateItem = {
			    "type": TYPE_AVALANCHE,
			    "subtype": subtype,
			    "elevationRangeStart" : record.data.elevation_min,
			    "elevationRangeEnd" : record.data.elevation_max,
			    "aspectRangeStart" : record.data.aspect_start_code,
			    "aspectRangeEnd" : record.data.aspect_end_code,
			    "avSizeRangeStart" : avSizeRangeStart,
			    "avSizeRangeEnd" : avSizeRangeEnd,
			    "triggerCode" : record.data.trigger_minor_code,
			    "description" : record.data.comments_internal
			};
		    }
		    this.rose_data.push(roseDateItem);
		}
		// ROSE Data - End
	    }
        }, this);

        if (powdercloudSvgRose) {
            var svg = $('#svg_div').svg('get');
            powdercloudSvgRose.drawData(svg, this.rose_data);
        }

	this.redrawChartData();

    }, this);
}
Controller.prototype.drawRose = function(){
    /*
        ROSE
    */
    var svgWidth = 750;
    var svgHeight = 600;
    document.getElementById('svg_div').style.width = svgWidth + "px";
    document.getElementById('svg_div').style.height = svgHeight + "px";
    document.getElementById('svg_div').style.border = '1px solid #000000';
    powdercloudSvgRose = new PowdercloudSvgRose(svgWidth, svgHeight, false, true, 150);
    $('#svg_div').svg({onLoad: powdercloudSvgRose.drawChart});
}
Controller.prototype.drawCharts = function(){
    /*
        CHARTS
    */
    powdercloudHighChartsUtil = new PowderCloudHighChartsUtil();
    chart = new Highcharts.Chart({
            chart: {
                    renderTo: 'chart',
                    defaultSeriesType: 'column',
                    borderWidth: 0,
                    marginLeft: 75,
                    marginBottom: 50,
                    width: 1000
            },
            exporting: {
		enabled: false
	    },
            title: {
                    text: 'Number of Avalanches',
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
                    max: filterCmp.end_date,
                    min: filterCmp.start_date
            },
            yAxis: {
                    title: {
                            text: null
                    },
                    labels: {
			style: {
			    color: powdercloudHighChartsUtil.getTextColor()
			}
		    },
                    min: 0,
                    tickInterval: 5,
		    startOnTick: false
            },
            tooltip: {
                    shared: false,
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
                            marker: {
                                    lineWidth: 1
                            }
                    }
            },
            legend: {
                    enabled: false
            },
            series: [{
                    id: 'numAvSeries',
                    name: 'Number',
                    color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                    data: []
            }]
    });
    chartFailureType = new Highcharts.Chart({
            chart: {
                    renderTo: 'chartFailureType',
                    defaultSeriesType: 'bar',
                    borderWidth: 0,
                    marginLeft: 25,
                    marginBottom: 50,
                    width: 450
            },
            exporting: {
		enabled: false
	    },
            title: {
                    text: 'Failure Types',
                    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
            },
            xAxis: {
		    title: {
                            text: 'Failure Type',
                            style: {
                                color: powdercloudHighChartsUtil.getTextColor()
                            }
                    },
		    categories: (isOperationSWAG)?['L', 'WL', 'SS', 'HS', 'WS', 'I', 'SF', 'C', 'R', 'U']:['S', 'L', 'LS', 'C', 'CS','I','IS'],
            },
            yAxis: {

                    id: 'xAxis',
		    min: 0,
		    startOnTick: false,
		    title: {
		       text: null
		    },
		    labels: {
			style: {
			    color: powdercloudHighChartsUtil.getTextColor()
			}
		    },
		    tickInterval: 1
            },
	    /*
            tooltip: {
                    shared: false,
                    crosshairs: true,
                    formatter: function() {
                            return Highcharts.dateFormat('%A, %b %e, %Y', this.x) +'<br/>Condition: <b>'+ this.y +'</b>';
                    }
            },
	    */
            credits: {
                    enabled: false,
                    text: chartConfig.creditsText,
                    href: chartConfig.creditsHref,
                    style: chartConfig.creditsStyle
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
                    id: 'failureTypesSeries',
                    name: 'Failure Types',
                    color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                    data: []
            }]

    });
    chartTriggerType = new Highcharts.Chart({
            chart: {
                    renderTo: 'chartTriggerType',
                    defaultSeriesType: 'bar',
                    borderWidth: 0,
                    marginLeft: 25,
                    marginBottom: 50,
                    width: 450
            },
            exporting: {
		enabled: false
	    },
            title: {
                    text: 'Trigger Types',
                    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
            },
            xAxis: {
		    title: {
                            text: 'Trigger Type',
                            style: {
                                color: powdercloudHighChartsUtil.getTextColor()
                            }
                    },
		    categories: ['N', 'X', 'S', 'B', 'C','M','V','H','O','U']
            },
            yAxis: {

                    id: 'xAxis',
		    min: 0,
		    startOnTick: false,
		    title: {
		       text: null
		    },
		    labels: {
			style: {
			    color: powdercloudHighChartsUtil.getTextColor()
			}
		    },
		    tickInterval: 1
            },
	    /*
            tooltip: {
                    shared: false,
                    crosshairs: true,
                    formatter: function() {
                            return Highcharts.dateFormat('%A, %b %e, %Y', this.x) +'<br/>Condition: <b>'+ this.y +'</b>';
                    }
            },
	    */
            credits: {
                    enabled: false,
                    text: chartConfig.creditsText,
                    href: chartConfig.creditsHref,
                    style: chartConfig.creditsStyle
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
                    id: 'triggerTypesSeries',
                    name: 'Trigger Types',
                    color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                    data: []
            }]

    });
    var i = 0;
}
Controller.prototype.redrawChartData = function(){
    var plotBand_today_date = new Date();
    var plotBand_today_dateUTC = Date.UTC(plotBand_today_date.getFullYear(), plotBand_today_date.getMonth(), plotBand_today_date.getDate(), 0, 0, 0, 0);
    var plotBand_today_startDateUTC = Date.UTC(plotBand_today_date.getFullYear(), plotBand_today_date.getMonth(), plotBand_today_date.getDate() - 1, 12, 30, 30, 500);
    var plotBand_today_endDateUTC = Date.UTC(plotBand_today_date.getFullYear(), plotBand_today_date.getMonth(), plotBand_today_date.getDate(), 12, 30, 30, 500);

    var plotBandToday = {
        id: 'plotBandToday',
        from: plotBand_today_startDateUTC,
        to:   plotBand_today_endDateUTC,
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
    };

    var chartStartDateUTC = powdercloudHighChartsUtil.generateViewableStartDateUTC(this.filterCmp.start_date);
    var chartEndDateUTC = powdercloudHighChartsUtil.generateViewableEndDateUTC(this.filterCmp.end_date);

    if (chart.get('numAvSeries')) {
        chart.get('numAvSeries').setData(this.chart_data);
    }
    if (chart.get('xAxis')) {
        chart.get('xAxis').removePlotBand('plotBandToday');
        chart.get('xAxis').addPlotBand(plotBandToday);
        chart.get('xAxis').setExtremes(chartStartDateUTC, chartEndDateUTC);
    }

    if (chartFailureType.get('failureTypesSeries')) {
        chartFailureType.get('failureTypesSeries').setData(this.chart_failure_type_data);
    }

    if (chartTriggerType.get('triggerTypesSeries')) {
        chartTriggerType.get('triggerTypesSeries').setData(this.chart_trigger_type_data);
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
            entity: 'Avalanche',
	    type__ObservationType__lookup: 'avalancheeventmultiple,avalanchenarrative,avalancheeventstandard,avalanchesummary',

	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, AvalancheVO)
    });
    filterCmp.regStore(masterStore);
    /*
        MAP
    */
    mapOverlay = new Ext.Panel({
        defaults: {
            anchor: '0'
        },
        items:[{
            xtype: 'gmappanel',
            itemId: 'mapViewer',
            id: 'mapViewer',
            //width: 966,
            width: '100%',
            height: 600,
            gmapType: 'map',
	    overlayDetailFields:[{
		name: 'date_time_start',
		fieldLabel: 'Date and time',
		renderer: 'date',
		format: getDateFormat()
	    },{
		name: 'failure_type_desc',
		fieldLabel: 'Failure Type'
	    },{
		name: 'destructive_size_max_desc',
		fieldLabel: 'Destructive Size Max'
	    },{
		name: 'destructive_size_min_desc',
		fieldLabel: 'Destructive Size Min'
	    },{
		name: 'trigger_desc',
		fieldLabel: 'Trigger'
	    },{
		name: 'trigger_minor_desc',
		fieldLabel: 'Trigger minor'
	    }]
        }]
    });
    photoAnalysisOverlay = new pc.custom.PhotoAnalysisCmp({
    });
    /*
        TABLE
    */
    var expander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    var gridSM = new Ext.grid.CheckboxSelectionModel({
       singleSelect: false
    });
    // create the Grid
    grid = new Ext.grid.GridPanel({
        store: masterStore,
	plugins:[expander],
        loadMask: true,
	sm: gridSM,
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
	    gridSM,
            {
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dataIndex: 'date_time_start',
                renderer: formatDate
            },
	    {
                id       :'operation',
                header   : 'Operation',
                width    : 100,
                sortable : false,
                dataIndex: 'operation_desc'
            },
	    {
                id       :'location',
                header   : 'Location',
                width    : 100,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {
                id       :'type',
                header   : 'Type',
                width    : 160,
                sortable : false,
                dataIndex: 'type_desc'
            },
	    {
                id       :'date_time_occurrence',
                header   : 'Occurrence Date and Time',
                width    : 120,
                sortable : false,
                dataIndex: 'date_time_occurrence',
                renderer: formatDate
            },
	    {
                id       :'timeRange',
                header   : 'Time Range',
                width    : 75,
                sortable : false,
                dataIndex: 'time_range'
            },
	    {
                id       :'subject',
                header   : 'Subject',
                width    : 200,
                sortable : false,
                dataIndex: 'subject'
            },
	    {
                id       :'multipleNumber',
                header   : 'Number',
                width    : 75,
                sortable : false,
                dataIndex: 'multiple_number'
            },
	    {
                id       :'destructive_size_max',
                header   : 'Dest. Size Max',
                width    : 100,
                sortable : false,
                dataIndex: 'destructive_size_max_code'
            },
	    {
                id       :'destructive_size_min',
                header   : 'Dest. Size Min',
                width    : 100,
                sortable : false,
                dataIndex: 'destructive_size_min_code'
            },
	    {
                id       :'relative_size_max',
                header   : 'Rel. Size Max',
                width    : 100,
                sortable : false,
                dataIndex: 'relative_size_max_code'
            },
	    {
                id       :'relative_size_min',
                header   : 'Rel. Size Min',
                width    : 100,
                sortable : false,
                dataIndex: 'relative_size_min_code'
            },
	    {
                id       :'liquid_water_content',
                header   : 'LWC',
                width    : 50,
                sortable : false,
                dataIndex: 'liquid_water_content_code'
            },
	    {
                header   : 'Trigger Major',
                width    : 80,
                sortable : false,
                dataIndex: 'trigger_code'
            },
	    {
                header   : 'Trigger Minor',
                width    : 80,
                sortable : false,
                dataIndex: 'trigger_minor_code'
            },
	    {
                id       :'trigger_remote_distance',
                header   : 'Trigger Distance',
                width    : 100,
                sortable : false,
                dataIndex: 'trigger_remote_distance'
            },
	    {
                id       :'terminus',
                header   : 'Terminus',
                width    : 75,
                sortable : false,
                dataIndex: 'terminus_code'
            },
	    {
                id       :'incline_range_start',
                header   : 'Incline Start',
                width    : 100,
                sortable : false,
                dataIndex: 'incline_range_start'
            },
	    {
                id       :'incline_range_end',
                header   : 'Incline End',
                width    : 100,
                sortable : false,
                dataIndex: 'incline_range_end'
            },
	    {
                id       :'aspect_start',
                header   : 'Aspect Start',
                width    : 100,
                sortable : false,
                dataIndex: 'aspect_start_code'
            },
	    {
                id       :'aspect_end',
                header   : 'Aspect End',
                width    : 100,
                sortable : false,
                dataIndex: 'aspect_end_code'
            },
	    {
                id       :'elevation_min',
                header   : 'Elevation Min',
                width    : 100,
                sortable : false,
                dataIndex: 'elevation_min'
            },
	    {
                id       :'elevation_max',
                header   : 'Elevation Max',
                width    : 100,
                sortable : false,
                dataIndex: 'elevation_max'
            },
	    {
                id       :'toe_distance_mass',
                header   : 'Toe Dist. Mass',
                width    : 100,
                sortable : false,
                dataIndex: 'toe_distance_mass'
            },
	    {
                id       :'deposit_road_thickness_max',
                header   : 'Road Deposit Max Thickness',
                width    : 180,
                sortable : false,
                dataIndex: 'deposit_road_thickness_max'
            },
	    {
                id       :'deposit_rail_thickness_max',
                header   : 'Rail Deposit Max Thickness',
                width    : 180,
                sortable : false,
                dataIndex: 'deposit_rail_thickness_max'
            },
	    {
                id       :'deposit_road_thickness_average',
                header   : 'Road Deposit Avg Thickness',
                width    : 180,
                sortable : false,
                dataIndex: 'deposit_road_thickness_average'
            },
	    {
                id       :'deposit_rail_thickness_avg',
                header   : 'Rail Deposit Avg Thickness',
                width    : 180,
                sortable : false,
                dataIndex: 'deposit_rail_thickness_avg'
            },
	    {
                id       :'deposit_road_length',
                header   : 'Road Deposit Length',
                width    : 180,
                sortable : false,
                dataIndex: 'deposit_road_length'
            },
	    {
                id       :'deposit_rail_length',
                header   : 'Rail Deposit Length',
                width    : 180,
                sortable : false,
                dataIndex: 'deposit_rail_length'
            },
	    {
                id       :'slab_thickness_min',
                header   : 'Slab Min Thickness',
                width    : 180,
                sortable : false,
                dataIndex: 'slab_thickness_min'
            },
	    {
                id       :'slab_thickness_max',
                header   : 'Slab Max Thickness',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_thickness_max'
            },
	    {
                id       :'slab_width_min',
                header   : 'Slab Min Width',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_width_min'
            },
	    {
                id       :'slab_width_max',
                header   : 'Slab Max Width',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_width_max'
            },
	    {
                id       :'slab_length_min',
                header   : 'Slab Min Length',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_length_min'
            },
	    {
                id       :'slab_length_max',
                header   : 'Slab Max Length',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_length_max'
            },
	    {
                id       :'failure_type',
                header   : 'Avalanche Failure Type',
                width    : 150,
                sortable : false,
                dataIndex: 'failure_type_code'
            },
	    {
                id       :'failure_plane_age',
                header   : 'Failure Plane Age',
                width    : 150,
                sortable : false,
                dataIndex: 'failure_plane_age'
            }
        ],
        stripeRows: true,
        height: 400,
        width: '100%'
    });
    grid.getSelectionModel().on('selectionchange', function(sm) {
        // row(s) selected
	var selectedRecords = sm.getSelections();
	if (selectedRecords != undefined) {
	    photoAnalysisOverlay.processSVG(selectedRecords);
	}	else {
	    photoAnalysisOverlay.resetSVG();
	}
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
		title: 'Table',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays the avalanche fields in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    grid
		]
	    }),
	    new Ext.form.FieldSet({
		title: 'Photo Overlay',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following displays the overlays for the selected records.</p>'
		},
		    photoAnalysisOverlay
		]
	    }), 	
	     new Ext.form.FieldSet(
		{
		    title: 'Charts',
		    width: '100%',
		    collapsible: true,
		    collapsed: false,
		    border: true,
		    items:[{
			xtype:'container',
			html:'<p>The following charts display the number of avalanches, failure types and triggers for the selected operations and time period.</p>'
		    },
			new Ext.Container({
			    html:'<div id="dvCharts">'+
				'<div id="chartFailureType" class="dvDashboardChart" style="float:left; width: 50%;"></div>'+
				'<div id="chartTriggerType" class="dvDashboardChart" style="float:left; width: 50%;"></div>'+
				'<div id="chart" class="dvDashboardChart" style="clear:both;"></div>'+
				'</div>',
			    forceLayout : true,
			    listeners:{
				afterrender:{
				    scope: this,
				    fn: controller.drawCharts
				}
			    }
			})
		    ]
		}
	    ),

	    new Ext.form.FieldSet({
		title: 'Map Overlay',
		width: '100%',
		collapsible: false,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following map displays the location of the various observations. You can mange the view by using the toolbar (for example, Map or Earth). You can alter the scale using the vertical scale, and while in Earth mode you can alter the prespecitve with the upper left control.</p>'
		},
		    mapOverlay
		],
		listeners:{
		    scope: this,
		    expand: function(cmp){
			var temp = Ext.getCmp('mapViewer');
			temp.getMap().checkResize();
		    }
		}
	    }),
	    new Ext.form.FieldSet({
		title: 'Rose Overlay',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following chart displays the Avalanche Events as a Rose Overlay.</p>'
		},
		    new Ext.Container({
			html:'<div id="svg_div"></div>',
			listeners:{
			    afterrender:{
				scope: this,
				fn: controller.drawRose
			    }
			}
		    })
		]
	    })

	//    {
	//	xtype:'container',
	//	html:'<p> </p>'
	//    },
	//    {
	//	xtype:'container',
	//	html:'<p>Persons accessing Powdercloud.com information have agreed to a Release of Liability, Waiver of Claims and Assumption of Risk Agreement and assume all risk of injury resulting from using this information. They further agree to release the contributors from liability and waive all claims against the contributors for any personal injury, death, property damage, loss or expense that may be sustained as a result of using the information provided herein by the contributors, due to any cause whatsoever, including negligence, breach of contract or breach of any statutory or other duty of care on the part of the contributors.</p>'
	//    }

	//    new Ext.form.FieldSet({
	//	title: 'Oblique Photo Overlay',
	//	width: '100%',
	//	collapsible: true,
	//	collapsed: true,
	//	border: true,
	//	items:[{
	//	    xtype:'container',
	//	    html:'<p>The following area will show an oblique photo viewer.</p>'
	//	}]
	//    })

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
