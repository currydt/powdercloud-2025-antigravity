var controller, container, filterCmp,
weatherGrid, avalancheGrid, snowpackStructureGrid, snowprofileGrid, layersGrid, concernsGrid, sightingsGrid, dangerGrid, stabilityGrid, newsGrid,
weatherStore, avalacheStore, snowpackStructureStore, snowprofileStore, layersStore, concernsStore, sightingsStore, dangerStore, stabilityStore, newsStore,
powdercloudHighChartsUtil, hsHn24ComboHighChart, temperatureRangeHighChart, numFailureTypesHighChart, chartTriggerType, windHighChart, powdercloudSvgRose,
imageMapWin;

function Controller(){

    this.filterCmp = filterCmp;

    this.weatherStore = weatherStore;
    this.avalancheStore = avalancheStore;
    this.snowpackStructureStore = snowpackStructureStore;
    this.snowprofileStore = snowprofileStore;
    this.layersStore = layersStore;
    this.concernsStore = concernsStore;
    this.sightingsStore = sightingsStore;
    this.dangerStore = dangerStore;
    this.stabilityStore = stabilityStore;
    this.newsStore = newsStore;

    this.weatherStore.on('load', function(store, records, options){

        var _startDate = new Date(filterCmp.start_date.getFullYear(), filterCmp.start_date.getMonth(), filterCmp.start_date.getDate(), 0, 0, 0, 0);
	var _endDate = new Date(filterCmp.end_date.getFullYear(), filterCmp.end_date.getMonth(), filterCmp.end_date.getDate(), 23, 59, 59, 999);

	this.populateWeatherStudyPlotStandardHighChartsData(records, _startDate, _endDate);

        /*
        store.each(function (record){

        }, this);
        */

    }, this);

    this.avalancheStore.on('load', function(store, records, options){

        var _startDate = new Date(filterCmp.start_date.getFullYear(), filterCmp.start_date.getMonth(), filterCmp.start_date.getDate(), 0, 0, 0, 0);
	var _endDate = new Date(filterCmp.end_date.getFullYear(), filterCmp.end_date.getMonth(), filterCmp.end_date.getDate(), 23, 59, 59, 999);

	this.populateAvalancheEventStandardHighChartsData(records, _startDate, _endDate);

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

    this.snowpackStructureStore.on('load', function(store, records, options){

        store.each(function (record){

        }, this);

    }, this);

    this.snowprofileStore.on('load', function(store, records, options){

        store.each(function (record){

        }, this);

    }, this);

    this.layersStore.on('load', function(store, records, options){

        store.each(function (record){

        }, this);

    }, this);

    this.concernsStore.on('load', function(store, records, options){

        store.each(function (record){

        }, this);

    }, this);

    this.sightingsStore.on('load', function(store, records, options){

        store.each(function (record){

        }, this);

    }, this);

    this.dangerStore.on('load', function(store, records, options){

        store.each(function (record){

        }, this);

    }, this);

    this.stabilityStore.on('load', function(store, records, options){

        store.each(function (record){

        }, this);

    }, this);

    this.newsStore.on('load', function(store, records, options){

        store.each(function (record){

        }, this);

    }, this);

}

Controller.prototype.editImageMap = function(){
    var image = document.getElementById('image');
    imageMapWin = new Ext.Window({
	layout: 'fit',
	title: 'Image Map Editor',
	id : 'image_map_editor',
	closeAction: 'close',
	width:600,
	height:400,
	items: {
	    xtype: 'imagemappanel'
	},
	buttonAlign: 'center',
	buttons : [
		{
			text: 'Save',
			handler: function(){
				imageMapWin.items.get(0).saveMap();
			}
		},
		{
			text: 'Close',
			handler: function(){
				imageMapWin.items.get(0).cleanUp();
				imageMapWin.close();
			},
			scope: this
		}
	]
    });
    imageMapWin.show();
    imageMapWin.items.get(0).loadImage(image);
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
    var startDate = powdercloudHighChartsUtil.generateViewableStartDateUTC(new Date(filterCmp.start_date.getFullYear(), filterCmp.start_date.getMonth(), filterCmp.start_date.getDate(), 0, 0, 0, 0));
    var endDate = powdercloudHighChartsUtil.generateViewableEndDateUTC(new Date(filterCmp.end_date.getFullYear(), filterCmp.end_date.getMonth(), filterCmp.end_date.getDate(), 23, 59, 59, 999));

    hsHn24ComboHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'hsHn24ComboHighChart',
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
                    max: endDate,
                    min: startDate,
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
                    max: endDate,
                    min: startDate,
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
            },{
                    id: 'presentSeries',
                    color: '#3146FE',
                    name: 'Present',
                    data: [
                     ]
            }, {
                    id: 'minSeries',
                    color: '#BBBBBB',
                    name: 'Min',
                    data: [
                     ]
            }/*, {
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
                    max: endDate,
                    min: startDate,
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
                    }, {
                            from: 1,
                            to: 2,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'L',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 2,
                            to: 3,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'M',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 3,
                            to: 4,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'S',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 4,
                            to: 5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'G',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
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
		//categories: ['L', 'WL', 'SS', 'HS', 'WS', 'I', 'SF', 'C', 'R', 'U'],
		categories: ['S', 'L', 'LS', 'C', 'CS','I','IS'],
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
}

Controller.prototype.populateWeatherStudyPlotStandardHighChartsData = function(records, _startDate, _endDate){

    // 1. Viewable Dates
    var viewableStartDateUTC = powdercloudHighChartsUtil.generateViewableStartDateUTC(_startDate);
    var viewableEndDateUTC = powdercloudHighChartsUtil.generateViewableEndDateUTC(_endDate);

    // 2. Data
    var hs_accumulated_data = new Array();
    var hn24_accumulated_data = new Array();
    var air_temperature_max_data = new Array();
    var air_temperature_min_data = new Array();
    var air_temperature_present_data = new Array();
    var wind_speed_data = new Array();
    Ext.each(records, function(item, index) {


	    var date  = item.data.date_time_start;

	    if(item.data.hs_accumulated !== null){
		hs_accumulated_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.hs_accumulated]);
	    }
	    if(item.data.hn24_accumulated !== null){
		hn24_accumulated_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.hn24_accumulated]);
	    }
	    if(item.data.air_temperature_max !== null){
		air_temperature_max_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.air_temperature_max]);
	    }
	    if(item.data.air_temperature_min !== null){
		air_temperature_min_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), item.data.air_temperature_min]);
	    }
	    if(item.data.air_temperature_present !== null){
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
    var numFailureTypes_data = [0,0,0,0,0,0,0];
    //this.numFailureTypes_data = [0,0,0,0,0,0,0,0,0,0]; //categories: ['L', 'WL', 'SS', 'HS', 'WS', 'I', 'SF', 'C', 'R', 'U'],
    var chart_trigger_type_data = [0,0,0,0,0,0,0,0,0,0];
    Ext.each(records, function(item, index) {

        var date = item.data.date_time_start;

	// Num Failure Types - Start
	if (item.data.failure_type) {
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
		    /*
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
		    */
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
        FILTER
    */
    filterCmp = new ModeDaterangeFilter();

    /*
        STORES
    */
    weatherStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Weather',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59'),
            start:0,
            limit:PAGING_LIMIT
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, WeatherVO)
    });
    filterCmp.regStore(weatherStore);

    avalancheStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Avalanche',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, AvalancheVO)
    });
    filterCmp.regStore(avalancheStore);

    snowpackStructureStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'SnowpackStructure',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, SnowpackStructureVO)
    });
    filterCmp.regStore(snowpackStructureStore);

    snowprofileStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Profile',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, ProfileVO)
    });
    filterCmp.regStore(snowprofileStore);

    layersStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'PersistentLayer',
	    sort: 'created_date',
	    dir: 'DESC',
            type__ObservationType__lookup: 'layerevent'
        },
	dateRange: 'created_date',
	autoLoad: false,
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, PersistentLayerVO)
    });
    filterCmp.regStore(layersStore);

    concernsStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Concerns',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
        autoLoad: false,
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, ObservationVO)
    });
    filterCmp.regStore(concernsStore);

    sightingsStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Sighting',
	    sort: 'date_time_start',
	    dir: 'DESC',
            type__ObservationType__lookup: 'sightingevent,sightingnarrative',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, SightingVO)
    });
    filterCmp.regStore(sightingsStore);

    dangerStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Rating',
	    sort: 'date_time_start',
	    dir: 'DESC',
	    type__ObservationType__lookup: 'ratingdanger',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
	autoLoad: false,
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, RatingVO)
    });
    filterCmp.regStore(dangerStore);

    stabilityStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Rating',
	    sort: 'date_time_start',
	    dir: 'DESC',
            type__ObservationType__lookup: 'ratingstability',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
        autoLoad: false,
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, RatingVO)
    });
    filterCmp.regStore(stabilityStore);

    newsStore = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'News',
	    sort: 'date_time_start',
	    dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
        reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, NewsVO)
    });
    filterCmp.regStore(newsStore);

    /*
        TABLE
    */
    var weatherGridExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    weatherGrid = new Ext.grid.GridPanel({
        store: weatherStore,
	plugins:[weatherGridExpander],
	autoScroll: true,
        loadMask: true,
        columns: [
	    weatherGridExpander,
            //{
            //    id       :'',
            //    header   : 'Observation Quality',
            //    width    : 100,
            //    sortable : false,
            //    dataIndex: ''
            //},
            {
                id       :'type',
                header   : 'Type',
                width    : 150,
                sortable : false,
                dataIndex: 'type_desc'
            },{
                id       :'datetime',
                header   : 'Date and time',
                width    : 80,
                sortable : false,
                dataIndex: 'date_time_start',
		renderer: formatDate
            },{
                id       :'operation',
                header   : 'Operation',
                width    : 80,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'location',
                header   : 'Location',
                width    : 80,
                sortable : false,
                dataIndex: 'terrain_desc'
            },
           {
                id       :'sky',
                header   : 'Sky',
                width    : 50,
                sortable : false,
                dataIndex: 'sky_condition_code'
            },
	    {
                id       :'valleyFogElevationMin',
                header   : 'VF Min Elev.',
                width    : 75,
                sortable : false,
                dataIndex: 'valley_fog_elevation_min'
            },
            {
                id       :'valleyFogElevationMax',
                header   : 'VF Max Elev.',
                width    : 75,
                sortable : false,
                dataIndex: 'valley_fog_elevation_max'
            },
            {
                id       :'precipitationRateCode',
                header   : 'Precip. Rate',
                width    : 75,
                sortable : false,
                dataIndex: 'precipitation_rate_code'
            },
            {
                id       :'precipitationTypeCode',
                header   : 'Precip. Type',
                width    : 75,
                sortable : false,
                dataIndex: 'precipitation_type_code'
            },{
                id       :'AirTemperatureMax',
                header   : 'Temp. Max',
                width    : 75,
                sortable : false,
                dataIndex: 'air_temperature_max'
            },{
                id       :'AirTemperatureMin',
                header   : 'Temp. Min',
                width    : 75,
                sortable : false,
                dataIndex: 'air_temperature_min'
            },
	    {
                id       :'HN24Accumulated',
                header   : 'HN24',
                width    : 50,
                sortable : false,
                dataIndex: 'hn24_accumulated'
            },{
                id       :'HN24WaterEquivalent',
                header   : 'HN24 WE',
                width    : 50,
                sortable : false,
                dataIndex: 'hn24_water_equivalent'
            },{
                id       :'hst',
                header   : 'HST',
                width    : 50,
                sortable : false,
                dataIndex: 'hst_accumulated'
            },{
                id       :'HsAccumulated',
                header   : 'HS',
                width    : 50,
                sortable : false,
                dataIndex: 'hs_accumulated'
            },
            {
                id       :'surfaceSnowForm',
                header   : 'Snow Form',
                width    : 75,
                sortable : false,
                dataIndex: 'surface_snow_form_code'
            },
            {
                id       :'surfaceSnowSize',
                header   : 'Snow Size',
                width    : 75,
                sortable : false,
                dataIndex: 'surface_snow_size'
            },
            {
                id       :'surfaceSnowForm2',
                header   : 'Snow Form 2',
                width    : 75,
                sortable : false,
                dataIndex: 'surface_snow_form_2_code'
            },
	    {
                id       :'ridgeBlowingSnowDirection',
                header   : 'Ridge Blow Dir.',
                width    : 120,
                sortable : false,
                dataIndex: 'ridge_blowing_snow_direction_code'
            },{
                id       :'ridgeBlowingSnowTransport',
                header   : 'Ridge Blow Trans.',
                width    : 120,
                sortable : false,
                dataIndex: 'ridge_blowing_snow_transport_code'
            }],
        stripeRows: true,
        height: 200,
        width: '100%'
    });


    var avalancheGridExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    avalancheGrid = new Ext.grid.GridPanel({
        store: avalancheStore,
	plugins:[avalancheGridExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    avalancheGridExpander,
            {
                id       :'type',
                header   : 'Type',
                width    : 100,
                sortable : false,
                dataIndex: 'type_desc'
            },{
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 120,
                sortable : false,
                dataIndex: 'date_time_start',
                renderer: formatDate
            },{
                id       :'date_time_occurrence',
                header   : 'Occurrence Date and Time',
                width    : 120,
                sortable : false,
                dataIndex: 'date_time_occurrence',
                renderer: formatDate
            },{
                id       :'timeRange',
                header   : 'Time Range',
                width    : 75,
                sortable : false,
                dataIndex: 'time_range'
            },{
                id       :'operation',
                header   : 'Operation',
                width    : 100,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'location',
                header   : 'Location',
                width    : 100,
                sortable : false,
                dataIndex: 'terrain_desc'
            },{
                id       :'subject',
                header   : 'Subject',
                width    : 200,
                sortable : false,
                dataIndex: 'subject'
            },{
                id       :'multipleNumber',
                header   : 'Number',
                width    : 75,
                sortable : false,
                dataIndex: 'multiple_number'
            },{
                id       :'destructive_size_max',
                header   : 'Dest. Size Max',
                width    : 100,
                sortable : false,
                dataIndex: 'destructive_size_max_code'
            },{
                id       :'destructive_size_min',
                header   : 'Dest. Size Min',
                width    : 100,
                sortable : false,
                dataIndex: 'destructive_size_min_code'
            },{
                id       :'relative_size_max',
                header   : 'Rel. Size Max',
                width    : 100,
                sortable : false,
                dataIndex: 'relative_size_max_code'
            },{
                id       :'relative_size_min',
                header   : 'Rel. Size Min',
                width    : 100,
                sortable : false,
                dataIndex: 'relative_size_min_code'
            },{
                id       :'liquid_water_content',
                header   : 'LWC',
                width    : 50,
                sortable : false,
                dataIndex: 'liquid_water_content_code'
            },{
                id       :'trigger',
                header   : 'Trigger',
                width    : 75,
                sortable : false,
                dataIndex: 'trigger_code'
            },{
                id       :'trigger_remote_distance',
                header   : 'Trigger Distance',
                width    : 100,
                sortable : false,
                dataIndex: 'trigger_remote_distance'
            },{
                id       :'terminus',
                header   : 'Terminus',
                width    : 75,
                sortable : false,
                dataIndex: 'terminus_code'
            },{
                id       :'incline_range_start',
                header   : 'Incline Start',
                width    : 100,
                sortable : false,
                dataIndex: 'incline_range_start'
            },{
                id       :'incline_range_end',
                header   : 'Incline End',
                width    : 100,
                sortable : false,
                dataIndex: 'incline_range_end'
            },{
                id       :'aspect_start',
                header   : 'Aspect Start',
                width    : 100,
                sortable : false,
                dataIndex: 'aspect_start_code'
            },{
                id       :'aspect_end',
                header   : 'Aspect End',
                width    : 100,
                sortable : false,
                dataIndex: 'aspect_end_code'
            },{
                id       :'elevation_min',
                header   : 'Elevation Min',
                width    : 100,
                sortable : false,
                dataIndex: 'elevation_min'
            },{
                id       :'elevation_max',
                header   : 'Elevation Max',
                width    : 100,
                sortable : false,
                dataIndex: 'elevation_max'
            },{
                id       :'toe_distance_mass',
                header   : 'Toe Dist. Mass',
                width    : 100,
                sortable : false,
                dataIndex: 'toe_distance_mass'
            },{
                id       :'deposit_road_thickness_max',
                header   : 'Road Deposit Max Thickness',
                width    : 150,
                sortable : false,
                dataIndex: 'deposit_road_thickness_max'
            },{
                id       :'deposit_rail_thickness_max',
                header   : 'Rail Deposit Max Thickness',
                width    : 100,
                sortable : false,
                dataIndex: 'deposit_rail_thickness_max'
            },{
                id       :'deposit_road_thickness_average',
                header   : 'Road Deposit Avg Thickness',
                width    : 150,
                sortable : false,
                dataIndex: 'deposit_road_thickness_average'
            },{
                id       :'deposit_rail_thickness_avg',
                header   : 'Rail Deposit Avg Thickness',
                width    : 150,
                sortable : false,
                dataIndex: 'deposit_rail_thickness_avg'
            },{
                id       :'deposit_road_length',
                header   : 'Road Deposit Length',
                width    : 150,
                sortable : false,
                dataIndex: 'deposit_road_length'
            },{
                id       :'deposit_rail_length',
                header   : 'Rail Deposit Length',
                width    : 150,
                sortable : false,
                dataIndex: 'deposit_rail_length'
            },{
                id       :'slab_thickness_min',
                header   : 'Slab Min Thickness',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_thickness_min'
            },{
                id       :'slab_thickness_max',
                header   : 'Slab Max Thickness',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_thickness_max'
            },{
                id       :'slab_width_min',
                header   : 'Slab Min Width',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_width_min'
            },{
                id       :'slab_width_max',
                header   : 'Slab Max Width',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_width_max'
            },{
                id       :'slab_length_min',
                header   : 'Slab Min Length',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_length_min'
            },{
                id       :'slab_length_max',
                header   : 'Slab Max Length',
                width    : 150,
                sortable : false,
                dataIndex: 'slab_length_max'
            },{
                id       :'failure_type',
                header   : 'Avalanche Failure Type',
                width    : 150,
                sortable : false,
                dataIndex: 'failure_type_code'
            },{
                id       :'failure_plane_age',
                header   : 'Failure Plane Age',
                width    : 150,
                sortable : false,
                dataIndex: 'failure_plane_age'
            }
        ],
        stripeRows: true,
        height: 200,
        width: '100%'
    });
    var snowpackStructureExpander = new Ext.ux.grid.RowExpander({
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
                id       :'operation',
                header   : 'Operation',
                width    : 120,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 120,
                sortable : false,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },{
                id       :'terrain',
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },{
                id       :'notable',
                header   : 'Notable',
                width    : 60,
                dataIndex: 'notable',
		sortable : false
            },{
                id       :'subject',
                header   : 'Subject',
                width    : 120,
                dataIndex: 'subject',
		sortable : false
            }
        ],
        stripeRows: true,
        height: 200,
        width: '100%'
    });

    var snowprofileExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    snowprofileGrid = new Ext.grid.GridPanel({
        store: snowprofileStore,
	plugins:[snowprofileExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    snowprofileExpander,
	       {
                id       :'operation',
                header   : 'Operation',
                width    : 120,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 120,
                sortable : false,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },{
                id       :'terrain',
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },{
                id       :'notable',
                header   : 'Notable',
                width    : 60,
                dataIndex: 'notable',
		sortable : false
            },{
                id       :'subject',
                header   : 'Subject',
                width    : 120,
                dataIndex: 'subject',
		sortable : false
            }
	],
        stripeRows: true,
        height: 200,
        width: '100%'
    });

    var layersExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    layersGrid = new Ext.grid.GridPanel({
        store: layersStore,
	plugins:[layersExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    layersExpander,
	    {
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
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 200,
                sortable : false,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start'
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
        height: 200,
        width: '100%'
    });

    var concernsExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    concernsGrid = new Ext.grid.GridPanel({
        store: concernsStore,
	plugins:[concernsExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    concernsExpander,
            {
                id       :'operation',
                header   : 'Operation',
                width    : 140,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 200,
                sortable : false,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
				renderer: formatDate
            },{
                id       :'date_time_end',
                header   : 'End Time',
                width    : 200,
                sortable : false,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_end',
		renderer: formatDate
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
	    /*{
                id       :'stability_scale_alpine_high',
                header   : 'High Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_alpine_high_desc'
            },{
                id       :'remark_alpine_high',
                header   : 'High Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine_high'
            },{
                id       :'stability_scale_alpine',
                header   : 'Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_alpine_desc'
            },{
                id       :'remark_alpine',
                header   : 'Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine'
            },{
                id       :'stability_scale_alpine_sub',
                header   : 'Sub Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_alpine_sub_desc'
            },{
                id       :'remark_alpine_sub',
                header   : 'Sub Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine_sub'
            },
            {
                id       :'stability_trending',
                header   : 'Stability trending',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_trending_desc'
            },
	    */
	],
        stripeRows: true,
        height: 200,
        width: '100%'
    });

    var sightingsExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    sightingsGrid = new Ext.grid.GridPanel({
        store: sightingsStore,
	plugins:[sightingsExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    sightingsExpander,
	      {
                id       :'operation',
                header   : 'Operation',
                width    : 120,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 120,
                sortable : false,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },{
                id       :'terrain',
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },{
                id       :'notable',
                header   : 'Notable',
                width    : 60,
                dataIndex: 'notable',
		sortable : false
            },{
                id       :'subject',
                header   : 'Subject',
                width    : 120,
                dataIndex: 'subject',
		sortable : false
            }],
        stripeRows: true,
        height: 200,
        width: '100%'
    });

    var dangerExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    dangerGrid = new Ext.grid.GridPanel({
        store: dangerStore,
	plugins:[dangerExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    dangerExpander,
//	    {
//                id       :'type',
//                header   : 'Type',
//                width    : 150,
//                sortable : false,
//                dataIndex: 'type_desc'
//            },
{
                id       :'operation',
                header   : 'Operation',
                width    : 140,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 200,
                sortable : false,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },{
                id       :'operation',
                header   : 'Operation',
                width    : 140,
                sortable : false,
                dataIndex: 'operation_desc'
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
            },{
                id       :'danger_scale_alpine_high',
                header   : 'High Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'danger_scale_alpine_high_desc'
            },{
                id       :'remark_alpine_high',
                header   : 'High Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine_high'
            },{
                id       :'danger_scale_alpine',
                header   : 'Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'danger_scale_alpine_desc'
            },{
                id       :'remark_alpine',
                header   : 'Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine'
            },{
                id       :'danger_scale_alpine_sub',
                header   : 'Sub Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'danger_scale_alpine_sub_desc'
            },{
                id       :'remark_alpine_sub',
                header   : 'Sub Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine_sub'
            }
        ],
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
	plugins:[stabilityExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    stabilityExpander,
            {
                id       :'operation',
                header   : 'Operation',
                width    : 140,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 200,
                sortable : false,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
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
            },{
                id       :'stability_scale_alpine_high',
                header   : 'High Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_alpine_high_desc'
            },{
                id       :'remark_alpine_high',
                header   : 'High Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine_high'
            },{
                id       :'stability_scale_alpine',
                header   : 'Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_alpine_desc'
            },{
                id       :'remark_alpine',
                header   : 'Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine'
            },{
                id       :'stability_scale_alpine_sub',
                header   : 'Sub Alpine',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_scale_alpine_sub_desc'
            },{
                id       :'remark_alpine_sub',
                header   : 'Sub Alpine Remark',
                width    : 200,
                sortable : false,
                dataIndex: 'remark_alpine_sub'
            },
            {
                id       :'stability_trending',
                header   : 'Stability trending',
                width    : 100,
                sortable : false,
                dataIndex: 'stability_trending_desc'
            }
            //// Please leave for N America
            //{
            //    id       :'stability_scale_treeline',
            //    header   : 'Treeline Rating',
            //    width    : 100,
            //    sortable : false,
            //    dataIndex: 'stability_scale_treeline_desc'
            //},{
            //    id       :'remark_treeline',
            //    header   : 'Treeline Remark',
            //    width    : 100,
            //    sortable : false,
            //    dataIndex: 'remark_treeline'
            //},{
            //    id       :'stability_scale_below_treeline',
            //    header   : 'Below Treeline Rating',
            //    width    : 100,
            //    sortable : false,
            //    dataIndex: 'stability_scale_below_treeline_desc'
            //},{
            //    id       :'remark_below_treeline',
            //    header   : 'Below Treeline Remark',
            //    width    : 100,
            //    sortable : false,
            //    dataIndex: 'remark_below_treeline'
            //},
            //{
            //    id       :'stability_trending',
            //    header   : 'Stability Trending',
            //    width    : 100,
            //    sortable : false,
            //    dataIndex: 'stability_trending_desc'
            //},
	],
        stripeRows: true,
        height: 200,
        width: '100%'
    });

    var newsExpander = new Ext.ux.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });

    newsGrid = new Ext.grid.GridPanel({
        store: newsStore,
	plugins:[newsExpander],
        autoScroll: true,
        loadMask: true,
        columns: [
	    newsExpander,
            {
                id       :'operation',
                header   : 'Operation',
                width    : 120,
                sortable : false,
                dataIndex: 'operation_desc'
            },{
                id       :'date_time_start',
                header   : 'Date and Time',
                width    : 120,
                sortable : false,
                dateFormat: 'Y-m-d',
                timeFormat: 'H:i',
                dataIndex: 'date_time_start',
		renderer: formatDate
            },{
                id       :'terrain',
                header   : 'Location',
                width    : 150,
                sortable : false,
                dataIndex: 'terrain_desc'
            },{
                id       :'notable',
                header   : 'Notable',
                width    : 60,
                dataIndex: 'notable',
		sortable : false
            },{
                id       :'subject',
                header   : 'Subject',
                width    : 120,
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
	items:[
            {
                xtype:'container',
                html:'<p>The following text displays the current News, Avalanche Observation Narratives and Events, Concerns, Danger and Stability Ratings, Snowpack Structure and Snowpack Profiles, Weather and Sightings.</p>'
            },

	    new Ext.form.FieldSet({
		title: 'WebExchange Image Map',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following section displays the prototype image map and image map editor. It is designed to provide the basic link functionality on two elements, the Avalanches and the charts at the lowest location on the left side.</p>'
		}, {
		    xtype:'button',
		    text:'Edit Image Map',
		    handler: function(){
			controller.editImageMap();
		    }
		}, {
		    xtype:'container',
		    html:'<map id="imageMap" name="imageMap">'+
			'<area shape="rect" alt="Yahoo Website" title="Avalanche Events" coords="316,473,541,554" href="/analysis/stability-ratings/  target="_blank" />'+
			'<area shape="rect" alt="Google Website" title="Google" coords="35,396,140,426" href="/observation/avalanche-event-standard//" target="_blank" />'+
			'</map>' +
			'<img id="image" src="/static/img/imagemap/webex.png" usemap="#imageMap"/>'
		}
		]
	    }),

            new Ext.form.FieldSet({
		title: 'Charts',
		width: '100%',
		collapsible: true,
		collapsed: false,
		border: true,
		items:[{
			xtype:'container',
			html:'<p>The following section displays the data summarized as charts.</p>'
		    },
		    new Ext.Container({
			html:'<table width="100%"><tr width="100%">'+
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
		title: 'News',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays news in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    newsGrid
		]
	    }),

	    new Ext.form.FieldSet({
		title: 'Avalanche Activity',
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
		title: 'Concerns',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays concerns in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    concernsGrid
		]
	    }),

	    new Ext.form.FieldSet({
		title: 'Danger',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays danger in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    dangerGrid
		]
	    }),

            new Ext.form.FieldSet({
		title: 'Stability',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays stability in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    stabilityGrid
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
		title: 'Snow Profile',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays snow profile in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    snowprofileGrid
		]
	    }),

	    new Ext.form.FieldSet({
		title: 'Weather',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays weather in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    weatherGrid
		]
	    }),


//            new Ext.form.FieldSet({
//		title: 'Layers',
//		width: '100%',
//		collapsible: true,
//		collapsed: false,
//		border: true,
//		items:[{
//		    xtype:'container',
//		    html:'<p>The following table displays layers in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
//		},
//		    layersGrid
//		]
//	    }),

            new Ext.form.FieldSet({
		title: 'Sightings',
		width: '100%',
		collapsible: true,
		collapsed: true,
		border: true,
		items:[{
		    xtype:'container',
		    html:'<p>The following table displays sightings in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
		},
		    sightingsGrid
		]
	    })
	],
	listeners:{
	    afterrender:{
		scope: this,
		fn: function(){
                    weatherStore.load();
		    newsStore.load();
		}
	    }
	}
    });
});
