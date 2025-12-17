var controller, container, today,

snowpackStructureGrid,
avalancheNarrativeGrid,
avalancheGrid,
fieldWeatherSummaryGrid,
stabilityGrid,
weatherGrid,
newsGrid,
// TODO terrainUsageGrid,


snowpackStructureStore,
avalacheNarativeStore,
terrainUsageStore,
avalacheStore,
fieldWeatherSummaryStore,
stabilityStore,
weatherStore,
newsStore,
// TODO terrainUsageStore,

powdercloudHighChartsUtil,
seasonalChart,
hsHn24ComboHighChart,
temperatureRangeHighChart,
numFailureTypesHighChart,
chartTriggerType,
windHighChart,
powdercloudSvgRose;

var TIME_RANGE = -7;
today = new Date();
lastweek = today.add(Date.DAY, TIME_RANGE);
function Controller(){

    this.snowpackStructureStore = snowpackStructureStore;
    this.avalacheNarativeStore = avalacheNarativeStore;
    this.avalancheStore = avalancheStore;
    this.fieldWeatherSummaryStore = fieldWeatherSummaryStore;
    this.stabilityStore = stabilityStore;
    this.weatherStore = weatherStore;
    this.newsStore = newsStore;
    this.terrainUsageStore = terrainUsageStore;

    this.allGrids= [
	snowpackStructureGrid,
	avalancheNarrativeGrid,
	avalancheGrid,
	fieldWeatherSummaryGrid,
	stabilityGrid,
	weatherGrid,
	newsGrid,
	terrainUsageGrid,
    ];

    this.snowpackStructureStore.on('load', function(store, records, options){
        store.each(function (record){

        }, this);

    }, this);


    this.avalacheNarativeStore.on('load', function(store, records, options){
        store.each(function (record){

        }, this);

    }, this);


    this.avalancheStore.on('load', function(store, records, options){
        var _startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
	var _endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

	this.populateAvalancheEventStandardHighChartsData(records, lastweek, today);

	this.rose_data = [];

        store.each(function (record){
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
        }, this);

        if (powdercloudSvgRose) {
            var svg = $('#av_rose_svg_div').svg('get');
            powdercloudSvgRose.drawData(svg, this.rose_data);
        }

    }, this);


    this.fieldWeatherSummaryStore.on('load', function(store, records, options){
        store.each(function (record){

        }, this);

    }, this);


    this.stabilityStore.on('load', function(store, records, options){
        store.each(function (record){

        }, this);

    }, this);


    this.weatherStore.on('load', function(store, records, options){

	this.populateWeatherStudyPlotStandardHighChartsData(records, lastweek, today);

        /*
        store.each(function (record){

        }, this);
        */

    }, this);


    this.newsStore.on('load', function(store, records, options){
        store.each(function (record){

        }, this);

    }, this);

    this.terrainUsageStore.on('load', function(store, records, options){
        store.each(function (record){

        }, this);

    }, this);


}

Controller.prototype.onDateChange = function(value){
    today = value;
    lastweek = today.add(Date.DAY, TIME_RANGE);
    Ext.each(this.allGrids, function(grid){
	grid.getStore().setBaseParam('date_time_start__range', lastweek.format('Y-m-d 00:00')+'/'+today.format('Y-m-d 23:59'));
	grid.getStore().load();
    }, this);
}

Controller.prototype.drawCharts = function(){

    /*
	AV SVG ROSE
    */
    var svgWidth = 250;
    var svgHeight = 250;
    document.getElementById('av_rose_svg_div').style.width = svgWidth + "px";
    document.getElementById('av_rose_svg_div').style.height = svgHeight + "px";
    //document.getElementById('av_rose_svg_div').style.border = '1px solid #000000';
    powdercloudSvgRose = new PowdercloudSvgRose(svgWidth, svgHeight, true);
    $('#av_rose_svg_div').svg({onLoad: powdercloudSvgRose.drawChart});

    powdercloudHighChartsUtil = new PowderCloudHighChartsUtil();

    // NOTE: must show from middle previous day to middle of desired date
    var plotBand_today_date = new Date();
    var plotBand_today_dateUTC = Date.UTC(plotBand_today_date.getFullYear(), plotBand_today_date.getMonth(), plotBand_today_date.getDate(), 0, 0, 0, 0);
    var plotBand_today_startDateUTC = Date.UTC(plotBand_today_date.getFullYear(), plotBand_today_date.getMonth(), plotBand_today_date.getDate() - 1, 12, 30, 30, 500);
    var plotBand_today_endDateUTC = Date.UTC(plotBand_today_date.getFullYear(), plotBand_today_date.getMonth(), plotBand_today_date.getDate(), 12, 30, 30, 500);

    var subTitleText = null;
    var creditsText = 'powered by Powdercloud';
    var creditsHref = 'http://www.powdercloud.com';
    var creditsStyle = {
            cursor: 'pointer',
            color: '#3300FF',
            fontSize: '10px'
    };

    // High Charts
    var startDate = powdercloudHighChartsUtil.generateViewableStartDateUTC( today);
    var endDate = powdercloudHighChartsUtil.generateViewableEndDateUTC( lastweek);
    
    hsHn24ComboHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'hsHn24ComboHighChart',
		    defaultSeriesType: 'line',
                    borderWidth: 0,
                    marginLeft: 75,
                    marginBottom: 50
            },
	    exporting: {
		enabled: false
	    },
            title: {
                    //text: 'Height of Snow (HS) & Height of New Snow (HN24)',
		    text: 'HS & HN24',
		    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
            },
            subtitle: {
                    text: subTitleText,
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
                    max: today,
                    min: lastweek,
                    plotBands: [
                            {
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
                                                            maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', plotBand_today_dateUTC),
                                                            width: 200
                                                    });
                                            }
                                    }
                            }
                    ]
            },
            yAxis: {
                    title: {
                            text: 'Snow Height (cm)',
			    style: {
				color: powdercloudHighChartsUtil.getTextColor()
			    }
                    },
		    labels: {
			style: {
			    color: powdercloudHighChartsUtil.getTextColor()
			}
		    },
                    min: 0,
		    startOnTick: false
            },
            tooltip: {
                    shared: true,
                    crosshairs: true

            },
            credits: {
                    enabled: false,
                    text: creditsText,
                    href: creditsHref,
                    style: creditsStyle
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
            // NOTE: add empty series in order to show the x and y axis
            series: [{
                    id: 'hsSeries',
                    type: 'column',
                    name: 'HS',
		    color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                    data: []
            },{
                    id: 'hn24Series',
                    type: 'column',
                    name: 'HN24',
		    color: powdercloudHighChartsUtil.getSeriesColorScheme(1),
                    data: []
            }]
    });

    temperatureRangeHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'temperatureRangeHighChart',
                    defaultSeriesType: 'line',
                    borderWidth: 0,
                    marginLeft: 75,
                    marginBottom: 50
            },
	    exporting: {
		enabled: false
	    },
            title: {
                    text: 'Temperature Range',
		    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
            },
            subtitle: {
                    text: subTitleText,
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
                    max: today,
                    min: lastweek,
                    plotBands: [
                            {
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
                                                            maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', plotBand_today_dateUTC),
                                                            width: 200
                                                    });
                                            }
                                    }
                            }
                    ]
            },
            yAxis: {
                    title: {
                            text: 'Temperature (C)',
			    style: {
				color: powdercloudHighChartsUtil.getTextColor()
			    }
                    },
		    labels: {
			style: {
			    color: powdercloudHighChartsUtil.getTextColor()
			}
		    },
                    plotLines: [{
                            value: 0,
                            width: 2,
                            color: '#FF0000'
                    }],
                    min: -25,
                    max: 25,
		    startOnTick: false
            },
            tooltip: {
                    shared: true,
                    crosshairs: true
            },
            credits: {
                    enabled: false,
                    text: creditsText,
                    href: creditsHref,
                    style: creditsStyle
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
            series: [
            {
                    id: 'maxSeries',
                    color: '#BBBBBB',
                    name: 'Max',
                    data: [
                     ]
            },
	    {
                    id: 'presentSeries',
                    color: '#3146FE',
                    name: 'Present',
                    data: [
                     ]
            },
	    {
                    id: 'minSeries',
                    color: '#BBBBBB',
                    name: 'Min',
                    data: [
                     ]
            }
	    /*, {
                    id: 'medianSeries',
                    color: '#FE9131',
                    name: 'Median',
                    data: [
                     ]
            }*/
            ]
    });

    windHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'windHighChart',
                    defaultSeriesType: 'line',
		    borderWidth: 0,
                    marginLeft: 75,
                    marginBottom: 50
            },
            exporting: {
		enabled: false
	    },
            title: {
                    text: 'Wind Speed',
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
                    max: today,
                    min: lastweek,
                    plotBands: [
                            {
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
                                                            maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', plotBand_today_dateUTC),
                                                            width: 200
                                                    });
                                            }
                                    }
                            }
                    ]
            },
            yAxis: {
                    title: {
                            text: 'Wind Speed',
                            style: {
                                color: powdercloudHighChartsUtil.getTextColor()
                            }
                    },
                    labels:{enabled:false},
                    min: 0,
                    max: 6,
                    startOnTick: false,
                    minorGridLineWidth: 0,
                    gridLineWidth: 0,
                    alternateGridColor: null,
                    plotBands: [{
                            from: 0,
                            to: 1,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'C',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    },
		    {
                            from: 1,
                            to: 2,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'L',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    },
		    {
                            from: 2,
                            to: 3,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'M',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    },
		    {
                            from: 3,
                            to: 4,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'S',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    },
		    {
                            from: 4,
                            to: 5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'G',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    },
		    {
                            from: 5,
                            to: 6,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'X',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }]
            },
            tooltip: {
                    shared: false,
                    crosshairs: true,
                    formatter: function() {
			    var windSpeedCategory = null;
			    switch(this.y)
			    {
				case 0.5:
					windSpeedCategory = "C";
					break;
				case 1.5:
					windSpeedCategory = "L";
					break;
				case 2.5:
					windSpeedCategory = "M";
					break;
				case 3.5:
					windSpeedCategory = "S";
					break;
				case 4.5:
					windSpeedCategory = "G";
					break;
				case 5.5:
					windSpeedCategory = "X";
					break;
				default:
					windSpeedCategory = null;
			    }
			    if (windSpeedCategory != null) {
				return Highcharts.dateFormat('%A, %b %e, %Y', this.x) +'<br/>Wind Speed: <b>'+ windSpeedCategory +'</b>';
			    } else {
				return Highcharts.dateFormat('%A, %b %e, %Y', this.x);
			    }
                    }
            },
            credits: {
                    enabled: false,
                    text: creditsText,
                    href: creditsHref,
                    style: creditsStyle
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
                    id: 'windSpeedSeries',
                    name: 'Wind Speed',
                    color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                    data: []
            }]
    });

    numFailureTypesHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'numFailureTypesHighChart',
                    defaultSeriesType: 'bar'
		    //,
                    //borderWidth: 1,
                    //marginLeft: 75
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
            subtitle: {
                    text: subTitleText,
		    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
            },
            xAxis: {
		categories: (isOperationSWAG)?['L', 'WL', 'SS', 'HS', 'WS', 'I', 'SF', 'C', 'R', 'U']:['S', 'L', 'LS', 'C', 'CS','I','IS'],
		labels: {
		    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
		}
	    },
	    yAxis: {
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
            legend: {
                    enabled: false
            },
            tooltip: {
		formatter: function() {
		    return ''+ this.x +': '+ this.y;
		}
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
                    defaultSeriesType: 'bar'
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
		    labels: {
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
    seasonalChart = new Highcharts.StockChart({
	chart: {
	    renderTo: 'seasonalChart',
	    alignTicks: false,
	    panning: false
	},
	title: {
	    text: 'Seasonal Chart'
	},
	rangeSelector: {
	    enabled: false
	},
	tooltip: {
	    shared: true,
	    formatter: function() {
		return '<b>Temperature</b><br>Max: '+this.points[0].point.high+'<br>Present: '+this.points[0].point.open+'<br>Min: '+this.points[0].point.low;
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
		max: today,
		min: lastweek,
		ordinal: false,
		plotBands: [
			{
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
							maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', plotBand_today_dateUTC),
							width: 200
						});
					}
				}
			}
		]
	},
	credits: {
	    enabled: false,
	    text: creditsText,
	    href: creditsHref,
	    style: creditsStyle
	},
	yAxis: [{
	    title: {
		text: 'Temperature'
	    },
	    lineWidth: 2
	}],
	navigator: {
	    enabled: false
	},
	scrollbar: {
	    enabled: false
	},
	series: [{
	    type: 'candlestick',
	    name: 'Temperature',
	    id: 'temperature',
	    data: []
	}]
    });
}

Controller.prototype.populateWeatherStudyPlotStandardHighChartsData = function(records, _startDate, _endDate){
    // 1. Viewable Dates
    var viewableStartDateUTC = powdercloudHighChartsUtil.generateViewableStartDateUTC(_startDate);
    var viewableEndDateUTC = powdercloudHighChartsUtil.generateViewableEndDateUTC(_endDate);
    // 2. Data
    var hs_accumulated_data = new Array();
    var hn24_accumulated_data = new Array();
    var temperature_data = new Array();
    var air_temperature_max_data = new Array();
    var air_temperature_min_data = new Array();
    var air_temperature_present_data = new Array();
    var wind_speed_data = new Array();
    Ext.each(records, function(item, index) {


	    var date  = item.data.date_time_start;

	    if(!Ext.isEmpty(item.data.hs_accumulated)){
		hs_accumulated_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.hs_accumulated]);
	    }
	    if(!Ext.isEmpty(item.data.hn24_accumulated)){
		hn24_accumulated_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.hn24_accumulated]);
	    }
	    if(!Ext.isEmpty(item.data.air_temperature_max) || !Ext.isEmpty(item.data.air_temperature_min) || !Ext.isEmpty(item.data.air_temperature_present)){
		temperature_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.air_temperature_present, item.data.air_temperature_max, item.data.air_temperature_min, item.data.air_temperature_present ]);
	    }
	    if(!Ext.isEmpty(item.data.air_temperature_max)){
		air_temperature_max_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.air_temperature_max]);
	    }
	    if(!Ext.isEmpty(item.data.air_temperature_min)){
		air_temperature_min_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.air_temperature_min]);
	    }
	    if(!Ext.isEmpty(item.data.air_temperature_present)){
		air_temperature_present_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.air_temperature_present]);
	    }

	    // Wind - Start
	    if (item.data.wind_speed_cat) {
                    var yValue = null;
                    switch(item.data.wind_speed_cat_code)
                    {
                            case "C":
				    yValue = 0.5;
				    break;
			    case "L":
				    yValue = 1.5;
				    break;
			    case "M":
				    yValue = 2.5;
				    break;
			    case "S":
				    yValue = 3.5;
				    break;
			    case "G":
				    yValue = 4.5;
				    break;
			    case "X":
				    yValue = 5.5;
				    break;
                    }
		    if (yValue != null) {
			    wind_speed_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), yValue]);
		    }
            }
	    // Wind - End
    }, this);

    // 3. Charts

    // Hs & Hn24

    if (hsHn24ComboHighChart.get('hsSeries')) {
        hsHn24ComboHighChart.get('hsSeries').setData(hs_accumulated_data);
    }
    if (hsHn24ComboHighChart.get('hn24Series')) {
        hsHn24ComboHighChart.get('hn24Series').setData(hn24_accumulated_data);
    }
    if (hsHn24ComboHighChart.get('xAxis')) {
        hsHn24ComboHighChart.get('xAxis').setExtremes(viewableStartDateUTC, viewableEndDateUTC);
    }
    // Seasonal - Temperature Range - candlestick
    if (seasonalChart.get('temperature')) {
        seasonalChart.get('temperature').setData(temperature_data);
    }
    if (seasonalChart.get('xAxis')) {
        seasonalChart.get('xAxis').setExtremes(viewableStartDateUTC, viewableEndDateUTC);
    }
    // Temperature Range
    if (temperatureRangeHighChart.get('maxSeries')) {
        temperatureRangeHighChart.get('maxSeries').setData(air_temperature_max_data);
    }
    if (temperatureRangeHighChart.get('minSeries')) {
        temperatureRangeHighChart.get('minSeries').setData(air_temperature_min_data);
    }
    if (temperatureRangeHighChart.get('presentSeries')) {
        temperatureRangeHighChart.get('presentSeries').setData(air_temperature_present_data);
    }
    if (temperatureRangeHighChart.get('xAxis')) {
        temperatureRangeHighChart.get('xAxis').setExtremes(viewableStartDateUTC, viewableEndDateUTC);
    }

    // Wind
    if (windHighChart.get('windSpeedSeries')) {
        windHighChart.get('windSpeedSeries').setData(wind_speed_data);
    }
    if (windHighChart.get('xAxis')) {
        windHighChart.get('xAxis').setExtremes(viewableStartDateUTC, viewableEndDateUTC);
    }
    
}

Controller.prototype.populateAvalancheEventStandardHighChartsData = function(records, _startDate, _endDate){

    // 1. Viewable Dates
    var viewableStartDateUTC = powdercloudHighChartsUtil.generateViewableStartDateUTC(_startDate);
    var viewableEndDateUTC = powdercloudHighChartsUtil.generateViewableEndDateUTC(_endDate);

    // 2. Data
    var numFailureTypes_data = (isOperationSWAG)? [0,0,0,0,0,0,0,0,0,0]: [0,0,0,0,0,0,0];
    //this.numFailureTypes_data = [0,0,0,0,0,0,0,0,0,0]; //categories: ['L', 'WL', 'SS', 'HS', 'WS', 'I', 'SF', 'C', 'R', 'U'],
    var chart_trigger_type_data = [0,0,0,0,0,0,0,0,0,0];
    Ext.each(records, function(item, index) {

        var date = item.data.date_time_start;

	// Num Failure Types - Start
	if(isOperationSWAG){
	    switch(item.data.failure_type_code){
		case "L":
			numFailureTypes_data[0]++;
			break;
		case "WL":
			numFailureTypes_data[1]++;
			break;
		case "SS":
			numFailureTypes_data[2]++;
			break;
		case "HS":
			numFailureTypes_data[3]++;
			break;
		case "WS":
			numFailureTypes_data[4]++;
			break;
		case "I":
			numFailureTypes_data[5]++;
			break;
		case "SF":
			numFailureTypes_data[6]++;
			break;
		case "C":
			numFailureTypes_data[7]++;
			break;
		case "R":
			numFailureTypes_data[8]++;
			break;
		case "U":
			numFailureTypes_data[9]++;
			break;
	    }
	}	else {
	    switch(item.data.failure_type_code)
	    {
		case "S":
			numFailureTypes_data[0]++;
			break;
		case "L":
			numFailureTypes_data[1]++;
			break;
		case "LS":
			numFailureTypes_data[2]++;
			break;
		case "C":
			numFailureTypes_data[3]++;
			break;
		case "CS":
			numFailureTypes_data[4]++;
			break;
		case "I":
			numFailureTypes_data[5]++;
			break;
		case "IS":
			numFailureTypes_data[6]++;
			break;
	    }
	}
	// Num Failure Types - End

	// Trigger Types - Start
	if (item.data.trigger_code) {
	    switch(item.data.trigger_code)
	    {
		    case "N":
			    chart_trigger_type_data[0]++;
			    break;
		    case "X":
			    chart_trigger_type_data[1]++;
			    break;
		    case "S":
			    chart_trigger_type_data[2]++;
			    break;
		    case "B":
			    chart_trigger_type_data[3]++;
			    break;
		    case "C":
			    chart_trigger_type_data[4]++;
			    break;
		    case "M":
			    chart_trigger_type_data[5]++;
			    break;
		    case "V":
			    chart_trigger_type_data[6]++;
			    break;
		    case "H":
			    chart_trigger_type_data[7]++;
			    break;
		    case "O":
			    chart_trigger_type_data[8]++;
			    break;
		    case "U":
			    chart_trigger_type_data[9]++;
			    break;
	    }
	}
	// Trigger Types - End

    }, this);

    // 3. Charts
    // 3. Number of Failure Types
    if (numFailureTypesHighChart.get('failureTypesSeries')) {
        numFailureTypesHighChart.get('failureTypesSeries').setData(numFailureTypes_data);
    }

    // Trigger Types
    if (chartTriggerType.get('triggerTypesSeries')) {
        chartTriggerType.get('triggerTypesSeries').setData(chart_trigger_type_data);
    }
}






Ext.onReady(function(){
    Ext.QuickTips.init();

    /*
        STORES
    */



    snowpackStructureStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'SnowpackStructure',
	    type__ObservationType__lookup: 'snowpackstructure',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': lastweek.format('Y-m-d 00:00')+'/'+today.format('Y-m-d 23:59')
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, SnowpackStructureVO)
    });



    avalacheNarativeStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Avalanche',
	    type__ObservationType__lookup: 'avalanchenarrative',

	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': lastweek.format('Y-m-d 00:00')+'/'+today.format('Y-m-d 23:59')
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, AvalancheVO)
    });


    avalancheStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Avalanche',
	    type__ObservationType__lookup: 'avalancheeventmultiple,avalancheeventstandard',

	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': lastweek.format('Y-m-d 00:00')+'/'+today.format('Y-m-d 23:59')
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, AvalancheVO)
    });


    fieldWeatherSummaryStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Weather',
	    type__ObservationType__lookup: 'weatherfieldsummary',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': lastweek.format('Y-m-d 00:00')+'/'+today.format('Y-m-d 23:59'),

            start:0,
            limit:PAGING_LIMIT
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, WeatherVO)
    });


   stabilityStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Rating',
	    type__ObservationType__lookup: 'ratingstability',

	    sort: 'date_time_start',
	    dir: 'DESC',
            type__ObservationType__lookup: 'ratingstability',
            'date_time_start__range': lastweek.format('Y-m-d 00:00')+'/'+today.format('Y-m-d 23:59')
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, RatingVO)
    });


    weatherStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Weather',
	    type__ObservationType__lookup: 'weatherstudyplotstandard,weatherstudyplotbrief',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': lastweek.format('Y-m-d 00:00')+'/'+today.format('Y-m-d 23:59'),

            start:0,
            limit:PAGING_LIMIT
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, WeatherVO)
    });


   newsStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'News',
	    type__ObservationType__lookup: 'news',

	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': lastweek.format('Y-m-d 00:00')+'/'+today.format('Y-m-d 23:59')
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, NewsVO)
    });


    terrainUsageStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'TerrainUsage',
	    type__ObservationType__lookup: 'terrainusage',

	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': lastweek.format('Y-m-d 00:00')+'/'+today.format('Y-m-d 23:59')
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, TerrainUsageVO)
    });


     /*
        TABLE
    */

   /*
	Snowpack Structure Table
    */    var snowpackStructureExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    snowpackStructureGrid = new Ext.grid.GridPanel({
        store: snowpackStructureStore,
	plugins:[snowpackStructureExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    snowpackStructureExpander,
            {
                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },
	    {

                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {

                header   : 'Description',
                width    : 600,
                dataIndex: 'subject',
		sortable : false
            }
        ],
        stripeRows: true,
        height: 200,
        width: '100%'
    });


    /*
        Avalanche Narrative Table
    */
    var avalancheNarrativeExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    avalancheNarrativeGrid = new Ext.grid.GridPanel({
        store: avalacheNarativeStore,
	plugins:[avalancheNarrativeExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    avalancheNarrativeExpander,
            {

                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },
	    {

                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {

                header   : 'Description',
                width    : 600,
                dataIndex: 'subject',
		sortable : false
            }
        ],
        stripeRows: true,
        height: 200,
        width: '100%'
    });


    /*
        Avalanche Event Table
    */

    var avalancheExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    avalancheGrid = new Ext.grid.GridPanel({
        store: avalancheStore,
        plugins:[avalancheExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
            avalancheExpander,
            {
                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dataIndex: 'date_time_start',
                renderer: formatDate
            },
	    {
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {
                header   : 'Occurrence Date and Time',
                width    : 160,
                sortable : false,
                dataIndex: 'date_time_occurrence',
                renderer: formatDate
            },
	    {
                header   : 'Time Range',
                width    : 75,
                sortable : false,
                dataIndex: 'time_range'
            },
	    {
                header   : 'Number',
                width    : 75,
                sortable : false,
                dataIndex: 'multiple_number'
            },
	    {
		id: 'failure_type',			//ToDOo - incorrrect type?
		header: 'Avalanche Failure Type',
		width: 150,
		sortable: false,
		dataIndex: 'failure_type_code'
	    },
	    {
                header   : 'LWC',
                width    : 50,
                sortable : false,
                dataIndex: 'liquid_water_content_code'
            },
	    {
                header   : 'Dest. Size Min',
                width    : 100,
                sortable : false,
                dataIndex: 'destructive_size_min_code'
            },
	    {
                header   : 'Dest. Size Max',
                width    : 100,
                sortable : false,
                dataIndex: 'destructive_size_max_code'
            },
	    {
                header   : 'Trigger',
                width    : 75,
                sortable : false,
                dataIndex: 'trigger_code'
            },
	    {
                header   : 'Trigger Distance',
                width    : 100,
                sortable : false,
                dataIndex: 'trigger_remote_distance'
            },
	    {
                header   : 'Incline Start',
                width    : 100,
                sortable : false,
                dataIndex: 'incline_range_start'
            },
	    {
                header   : 'Incline End',
                width    : 100,
                sortable : false,
                dataIndex: 'incline_range_end'
            },
	    {
                header   : 'Aspect Start',
                width    : 100,
                sortable : false,
                dataIndex: 'aspect_start_code'
            },
	    {
                header   : 'Aspect End',
                width    : 100,
                sortable : false,
                dataIndex: 'aspect_end_code'
            },
	    {
                header   : 'Elevation Min',
                width    : 100,
                sortable : false,
                dataIndex: 'elevation_min'
            },
	    {
                header   : 'Elevation Max',
                width    : 100,
                sortable : false,
                dataIndex: 'elevation_max'
            },
	    {

                header   : 'Toe Dist. Mass',
                width    : 100,
                sortable : false,
                dataIndex: 'toe_distance_mass'
            },
	    {

                header   : 'Slab Min Thickness',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_thickness_min'
            },
	    {

                header   : 'Slab Max Thickness',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_thickness_max'
            },
	    {

                header   : 'Slab Min Width',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_width_min'
            },
	    {

                header   : 'Slab Max Width',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_width_max'
            },
	    {

                header   : 'Path Run Length',
                width    : 150,
                sortable : false,
                dataIndex: 'path_run_length_min'
            },
//	    {
//
//                header   : 'Slab Min Length',
//                width    : 150,
//                sortable : false,
//                dataIndex: 'slab_length_min'
//            },
//	    {
//
//                header   : 'Slab Max Length',
//                width    : 150,
//                sortable : false,
//                dataIndex: 'slab_length_max'
//            },
	    {

                header   : 'Avalanche Failure Type',	//ToDOo - incorrrect type?
                width    : 150,
                sortable : false,
                dataIndex: 'failure_type_code'
            },
	    {

                header   : 'Failure Plane Age',
                width    : 150,
                sortable : false,
                dataIndex: 'failure_plane_age'
            },
	    {

                header   : 'Descripiton',
                width    : 600,
                sortable : false,
                dataIndex: 'subject'
            }
        ],
        stripeRows: true,
        height: 200,
        width: '100%'
    });





   var fieldWeatherSummaryExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    fieldWeatherSummaryGrid = new Ext.grid.GridPanel({
        store: fieldWeatherSummaryStore,
        plugins:[fieldWeatherSummaryExpander],
	autoScroll: true,
        loadMask: true,
        columns: [
            fieldWeatherSummaryExpander,
	    {
                header   : 'Date and time',
                width    :120,
                sortable : true,
                dataIndex: 'date_time_start',
		renderer: formatDate
            },
	    {
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
            {
                id       :'ElevationMin',
                header   : 'Min Elev.',
                width    : 75,
                sortable : false,
                dataIndex: 'elevation_min'
            },
	    {
                header   : 'Sky',
                width    : 50,
                sortable : false,
                dataIndex: 'sky_condition_code'
            },
//	    {
//                header   : 'VF Min Elev.',
//                width    : 75,
//                sortable : false,
//                dataIndex: 'valley_fog_elevation_min'
//            },
//            {
//                header   : 'VF Max Elev.',
//                width    : 75,
//                sortable : false,
//                dataIndex: 'valley_fog_elevation_max'
//            },
//TODO
            //{
            //
            //    header   : 'Precip. Rate',
            //    width    : 75,
            //    sortable : false,
            //    dataIndex: 'precipitation_rate_code'
            //},
            //{
            //
            //    header   : 'Precip. Type',
            //    width    : 75,
            //    sortable : false,
            //    dataIndex: 'precipitation_type_code'
            //},
	    {

                header   : 'Field Temp. Max',
                width    : 75,
                sortable : false,
                dataIndex: 'air_temperature_max'
            },
	    {

                header   : 'Field Temp. Min',
                width    : 75,
                sortable : false,
                dataIndex: 'air_temperature_min'
            },
	    {

                header   : 'HN24',
                width    : 50,
                sortable : false,
                dataIndex: 'hn24_accumulated'
            },
	    {

                header   : 'HN24 WE',
                width    : 50,
                sortable : false,
                dataIndex: 'hn24_water_equivalent'
            },
	    {

                header   : 'HST',
                width    : 50,
                sortable : false,
                dataIndex: 'hst_accumulated'
            },
	    {

                header   : 'HS',
                width    : 50,
                sortable : false,
                dataIndex: 'hs_accumulated'
            },
            {

                header   : 'Snow Form',
                width    : 75,
                sortable : false,
                dataIndex: 'surface_snow_form_code'
            },
            {

                header   : 'Snow Size',
                width    : 75,
                sortable : false,
                dataIndex: 'surface_snow_size'
            },
	    {

                header   : 'Ridge Blow Dir.',
                width    : 120,
                sortable : false,
                dataIndex: 'ridge_blowing_snow_direction_code'
            },
	    {

                header   : 'Ridge Blow Trans.',
                width    : 120,
                sortable : false,
                dataIndex: 'ridge_blowing_snow_transport_code'
            }],
        stripeRows: true,
        height: 200,
        width: '100%'
    });




    var stabilityExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    stabilityGrid = new Ext.grid.GridPanel({
        store: stabilityStore,
        autoScroll: true,
        loadMask: true,
	plugins:[stabilityExpander],
        columns: [
	    stabilityExpander,
            {
                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },
	    {
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {
                id       :'stability_scale_alpine',
                header   : 'Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_alpine_desc'
            },
	    {
                id       :'remark_alpinw',
                header   : 'Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine'
            },
	    {
                id       :'stability_scale_treeline',
                header   : 'Treeline',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_treeline_desc'
            },
	    {
                id       :'remark_treeline',
                header   : 'Treeline Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_treeline'
            },
	    {
                id       :'stability_scale_below_treeline',
                header   : 'Below Treeline',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_below_treeline_desc'
            },
	    {
                id       :'remark_below_treeline',
                header   : 'Below Treeline Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_below_treeline'
            },
            {
                header   : 'Stability trending',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_trending_desc'
            },
	    {
                header   : 'Description',
                width    : 600,
                dataIndex: 'subject',
		sortable : false
            }
	    ],
        stripeRows: true,
        height: 200,
        width: '100%'
    });




    var weatherExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    weatherGrid = new Ext.grid.GridPanel({
        store: weatherStore,
        plugins:[weatherExpander],
	autoScroll: true,
        loadMask: true,
        columns: [
            weatherExpander,
            {
                header   : 'Date and time',
                width    :120,
                sortable : true,
                dataIndex: 'date_time_start',
		renderer: formatDate
            },
	    {
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {
                header   : 'Sky',
                width    : 50,
                sortable : false,
                dataIndex: 'sky_condition_code'
            },
	    {
                header   : 'VF Min Elev.',
                width    : 75,
                sortable : false,
                dataIndex: 'valley_fog_elevation_min'
            },
            {
                header   : 'VF Max Elev.',
                width    : 75,
                sortable : false,
                dataIndex: 'valley_fog_elevation_max'
            },
            {
                header   : 'Precip. Rate',
                width    : 75,
                sortable : false,
                dataIndex: 'precipitation_rate_code'
            },
            {
                header   : 'Precip. Type',
                width    : 75,
                sortable : false,
                dataIndex: 'precipitation_type_code'
            },
	    {
                id       :'penFoot',
                header   : 'Pen Foot',
                width    : 50,
                sortable : true,
                dataIndex: 'pen_foot'
            },
	    {
                header   : 'Temp. Max',
                width    : 75,
                sortable : false,
                dataIndex: 'air_temperature_max'
            },
	    {
                header   : 'Temp. Min',
                width    : 75,
                sortable : false,
                dataIndex: 'air_temperature_min'
            },
	    {
                header   : 'Temp. Pres.',
                width    : 75,
                sortable : false,
                dataIndex: 'air_temperature_present'
            },
	    {
                header   : 'H2D',
                width    : 50,
                sortable : false,
                dataIndex: 'h2d_accumulated'
            },
	    {
                header   : 'HN24',
                width    : 50,
                sortable : false,
                dataIndex: 'hn24_accumulated'
            },
	    {
                header   : 'HN24 WE',
                width    : 50,
                sortable : false,
                dataIndex: 'hn24_water_equivalent'
            },
	    {
                header   : 'HST',
                width    : 50,
                sortable : false,
                dataIndex: 'hst_accumulated'
            },
	    {
                header   : 'HST WE',
                width    : 50,
                sortable : false,
                dataIndex: 'hst_water_equivalent'
            },
	    {
                header   : 'HS',
                width    : 50,
                sortable : false,
                dataIndex: 'hs_accumulated'
            },
            {
                id       :'rainGauge',
                header   : 'Rain Gauge',
                width    : 75,
                sortable : false,
                dataIndex: 'rain_gauge'
            },
	    {
                header   : 'Snow Form',
                width    : 75,
                sortable : false,
                dataIndex: 'surface_snow_form_code'
            },
            {
                header   : 'Snow Size',
                width    : 75,
                sortable : false,
                dataIndex: 'surface_snow_size'
            },
            {

                header   : 'Snow Form 2',
                width    : 75,
                sortable : false,
                dataIndex: 'surface_snow_form_2_code'
            },
	    {

                header   : 'Ridge Blow Dir.',
                width    : 120,
                sortable : false,
                dataIndex: 'ridge_blowing_snow_direction_code'
            },
	    {
                header   : 'Ridge Blow Trans.',
                width    : 120,
                sortable : false,
                dataIndex: 'ridge_blowing_snow_transport_code'
            }],
        stripeRows: true,
        height: 200,
        width: '100%'
    });



// News
   var newsExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    newsGrid = new Ext.grid.GridPanel({
        store: newsStore,
        autoScroll: true,
        loadMask: true,
	plugins:[newsExpander],
        columns: [
	    newsExpander,
            {
                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },
	    {

                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {
                header   : 'Subject',
                width    : 600,
                dataIndex: 'subject',
		sortable : false
            }
        ],
        stripeRows: true,
        height: 200,
        width: '100%'
    });

    /*
        Terrain Usage Table
    */
    var terrainUsageExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    terrainUsageGrid = new Ext.grid.GridPanel({
        store: terrainUsageStore,
	plugins:[terrainUsageExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    terrainUsageExpander,
            {

                header   : 'Date and Time',
                width    : 120,
                sortable : true,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },
	    {

                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
	    {

                header   : 'Description',
                width    : 600,
                dataIndex: 'subject',
		sortable : false
            }
        ],
        stripeRows: true,
        height: 200,
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

	// TODO Need InfoEX Data Title to left of buttons

	items:[
	    new Ext.Panel({
		border: false,
		items:[
		       {
		    xtype: 'datefield',
		    itemId: 'infoExDate',
		    width: 100,
		    format: 'Y-m-d',
		    value: new Date(),
		    listeners: {
			scope: this,
			select: function(cmp, value){
			    controller.onDateChange(value);
			}
		    }
		}]
	    }),

            {
                xtype:'container',
                html:'<p>The following is a presentation of data for the past seven days, from the selected date. You can manage the date range, by adjusting the selected end date.</p>'
            },

            new Ext.form.FieldSet({
		title: 'Charts',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		hidden:false,
		items:[{
			xtype:'container',
			html:'<p>The following section displays the data summarized as charts.</p>'
		    },
		    new Ext.Container({
			html:'<div id="seasonalChart"></div><table width="100%"><tr width="100%">'+
			    '<td width="33%"><div id="av_rose_svg_div"></div></td>'+
			    '<td width="33%"><div id="numFailureTypesHighChart" class="dvDashboardChart"></div></td>'+
                            '<td width="33%"><div id="chartTriggerType" class="dvDashboardChart"></div></td>'+
                            '<tr width="100%">'+
                            '<td width="33%"><div id="hsHn24ComboHighChart" class="dvDashboardChart"></div></td>'+
                            '<td width="33%"><div id="temperatureRangeHighChart" class="dvDashboardChart"></div></td>'+
                            '<td width="33%"><div id="windHighChart" class="dvDashboardChart"></div></td>'+
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
		title: 'Snowpack Structure',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays snowpack structure in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    snowpackStructureGrid
		]
	    }),


	    new Ext.form.FieldSet({
		title: 'Avalanche Narrative',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays avalanche activity in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    avalancheNarrativeGrid
		]
	    }),

	    new Ext.form.FieldSet({
		title: 'Avalanche Events',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays avalanche activity in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    avalancheGrid
		]
	    }),


		new Ext.form.FieldSet({
			title: 'Field Weather Summary',
			width: '100%',
			collapsible: true,
			collapsed: true,
			border: true,
			items:[
			       {
				    xtype:'container',
				    html:'<p>The following table displays field weather in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
				    },
				    fieldWeatherSummaryGrid
			    ]
		    }),


		new Ext.form.FieldSet({
			title: 'Snow Stability',
			width: '100%',
			collapsible: true,
			collapsed: true,
			border: true,
			items:[
				{
				    xtype:'container',
				    html:'<p>The following table displays stability in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
				},
				stabilityGrid
			    ]
		    }),


		new Ext.form.FieldSet({
			title: 'Study Plots',
			width: '100%',
			collapsible: true,
			collapsed: true,
			border: true,
			items:[
			       {
				    xtype:'container',
				    html:'<p>The following table displays weather plot in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
				    },
				    weatherGrid
			    ]
		    }),


		new Ext.form.FieldSet({
			title: 'News',
			width: '100%',
			collapsible: true,
			collapsed: true,
			border: true,
			items:[
				{
				    xtype:'container',
				    html:'<p>The following table displays news in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
				},
				newsGrid
			    ]
		    }),


		new Ext.form.FieldSet({
		    title: 'Terrain Usage',
		    width: '100%',
		    collapsible: true,
		    collapsed: true,
		    border: true,
		    items:[{
			xtype:'container',
			html:'<p>The following table displays terrain usage activity in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		    },
			terrainUsageGrid
		    ]
		})

	]
    });
});
