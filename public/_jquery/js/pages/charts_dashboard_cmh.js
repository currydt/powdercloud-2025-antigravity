Ext.LinkButton = Ext.extend(Ext.Button, {
    template: new Ext.Template(
        '<table cellspacing="0" class="x-btn {3}"><tbody class="{4}">',
        '<tr><td class="x-btn-tl"><i>&#160;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&#160;</i></td></tr>',
        '<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc"><em class="{5}" unselectable="on"><a href="{6}" target="{7}" class="x-btn-text {2}"><button>{0}</button></a></em></td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
        '<tr><td class="x-btn-bl"><i>&#160;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&#160;</i></td></tr>',
        '</tbody></table>').compile(),

    buttonSelector : 'a:first',

    getTemplateArgs: function() {
        return Ext.Button.prototype.getTemplateArgs.apply(this).concat([this.href, this.target]);
    },

    onClick : function(e){
        if(e.button != 0){
            return;
        }
        if(!this.disabled){
            this.fireEvent("click", this, e);
            if(this.handler){
                this.handler.call(this.scope || this, this, e);
            }
        }
    }
});

var controller;
var powdercloudHighChartsUtil;
var filterStoreWeatherStudyPlotStandard;
var filterStoreAvalancheEventStandard;
var filterCmp;

var skyConditionStepLineHighChart;
var precipRateHighChart;
var hsHn24ComboHighChart;
var windHighChart;
var temperatureRangeHighChart;
// TODO: stability AM/PM
var numAvalanchesHighChart;

function Controller(){
    this.filterStoreWeatherStudyPlotStandard = filterStoreWeatherStudyPlotStandard;
    this.filterStoreAvalancheEventStandard = filterStoreAvalancheEventStandard;
    this.filterCmp = filterCmp;

    this.filterStoreWeatherStudyPlotStandard.on('load', function(store, records, options){

        var _startDate = new Date(filterCmp.start_date.getFullYear(), filterCmp.start_date.getMonth(), filterCmp.start_date.getDate(), 0, 0, 0, 0);
	var _endDate = new Date(filterCmp.end_date.getFullYear(), filterCmp.end_date.getMonth(), filterCmp.end_date.getDate(), 23, 59, 59, 999);

	this.populateWeatherStudyPlotStandardHighChartsData(records, _startDate, _endDate);

    }, this);


    this.filterStoreAvalancheEventStandard.on('load', function(store, records, options){

        var _startDate = new Date(filterCmp.start_date.getFullYear(), filterCmp.start_date.getMonth(), filterCmp.start_date.getDate(), 0, 0, 0, 0);
	var _endDate = new Date(filterCmp.end_date.getFullYear(), filterCmp.end_date.getMonth(), filterCmp.end_date.getDate(), 23, 59, 59, 999);

	this.populateAvalancheEventStandardHighChartsData(records, _startDate, _endDate);

    }, this);

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
    filterStoreWeatherStudyPlotStandard = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Weather',
	    sort: 'date_time_start',
	    dir: 'DESC',
            //type__ObservationType__lookup: 'weatherstudyplotstandard,weatherfieldsummary' ,
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, WeatherVO)
    });
    filterCmp.regStore(filterStoreWeatherStudyPlotStandard);

    filterStoreAvalancheEventStandard = new ModeDaterangeFilterStore({
        baseParams:{
            entity: 'Avalanche',
	    sort: 'date_time_start',
	    dir: 'DESC',
            //type__ObservationType__lookup:'avalancheeventstandard,avalancheeventmultiple' ,
            date_time_start__range: filterCmp.start_date.format('Y-m-d 00:00')+'/'+filterCmp.end_date.format('Y-m-d 23:59')
        },
	reader: new Ext.data.JsonReader({
                totalProperty: 'totalCount',
                root: 'rows'
        }, AvalancheVO)
    });
    filterCmp.regStore(filterStoreAvalancheEventStandard);

    /*
        CONTROLLER
    */
    controller = new Controller();

    /*
        CHARTS
    */
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
    var startDate = new Date(filterCmp.start_date.getFullYear(), filterCmp.start_date.getMonth(), filterCmp.start_date.getDate(), 0, 0, 0, 0);
    var endDate = new Date(filterCmp.end_date.getFullYear(), filterCmp.end_date.getMonth(), filterCmp.end_date.getDate(), 23, 59, 59, 999);
    controller.drawHighCharts(powdercloudHighChartsUtil.generateViewableStartDateUTC(startDate), powdercloudHighChartsUtil.generateViewableEndDateUTC(endDate), plotBand_today_dateUTC, plotBand_today_startDateUTC, plotBand_today_endDateUTC, subTitleText, creditsText, creditsHref, creditsStyle);

    /*
	BUTTON BAR
    */
    var buttonBarPanel = new Ext.Panel({
	renderTo: 'buttonBar',
	border: false,
        layout:'hbox',
	layoutConfig: {
	    padding: 0,
	    align: 'middle',
	    pack: 'center' // choose 'start' if want left-aligned
	},
	defaults:{margins:'0 10 0 0'},
        items:[
	    new Ext.LinkButton({
		text: 'Stability',
		target: '../observation/rating-stability//'
	    }),
	    new Ext.LinkButton({
		text: 'Study Plot',
		target: '../observation/weather-study-plot-standard//'
	    }),
	    new Ext.LinkButton({
		text: 'Snow Profile',
		target: '../observation/snow-profile-industrial//'
	    }),
	    new Ext.LinkButton({
		text: 'Field Weather Summary',
		target: '../observation/weather-field-summary//'
	    }),
	    new Ext.LinkButton({
		text: 'Avalanche Event',
		target: '../observation/avalanche-event-standard//'
	    })
	]
    });

    /*
	LINK GRID
    */
    var linksStore = new Ext.data.ArrayStore({
	autoLoad: true,
	storeId: 'linksStore',
	fields: [
	   'Link', 'Description'
	],
	data: [
	    ['www.google.ca', 'This is google'],
	    ['www.powdercloud.com', 'This is powdercloud']
	]
    });
    var linksGrid = new Ext.grid.GridPanel({
        store: 'linksStore',
        loadMask: true,
        columns: [{
            header: 'Link',
            width: 40,
            sortable: false,
	    menuDisabled: true,
            dataIndex: 'Link'
        }, {
            header: 'Description',
            width: 60,
            sortable: false,
	    menuDisabled: false,
            dataIndex: 'Description'
        }],
	viewConfig:{forceFit:true}, // This now used width ratios instead of actual widths
        stripeRows: true,
        stateful: true,
        stateId: 'grid',
	height: 200
    });
    /*
    var linksPanel = new Ext.Panel({
	renderTo: 'linksGrid',
	height: 200,
	border:false,
        autoScroll: true,
        padding: '5',
        layout: 'fit',
        items: linksGrid
    });
    */

    var linksFieldSet = new Ext.form.FieldSet({
	renderTo: 'linksGrid',
	title: 'Links',
	width: '100%',
	collapsible: true,
	collapsed: false,
	border: true,
	autoScroll: true,
	padding: '5',
        layout: 'fit',
	items: linksGrid
    });
});

/*
 * NOTE: all dates must be of same type.  All should be DateUTC.
 */
Controller.prototype.drawHighCharts = function(startDate, endDate, plotBand_today_date, plotBand_today_startDate, plotBand_today_endDate, subTitleText, creditsText, creditsHref, creditsStyle){

    /**
     * Sky Condition Chart
     */
    // TODO: use opaque icons
    // TODO: use powdercloud colors for the series
    skyConditionStepLineHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'skyConditionStepLineHighChart',
                    defaultSeriesType: 'line',
                    borderWidth: 0,
                    marginLeft: 75,
		    spacingTop: 5,
		    spacingBottom: 0,
		    spacingLeft: 0,
		    spacingRight: 0
            },
	    exporting: {
		enabled: false
	    },
            title: {
                    text: null,
		    //text: 'Sky Conditions',
		    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
            },
            subtitle: {
                    text: null,
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
                                    from: plotBand_today_startDate,
                                    to:   plotBand_today_endDate,
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
            yAxis: {
                    title: {
                            text: 'Condition',
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
                               text: 'X',
                               style: {
				    color: powdercloudHighChartsUtil.getTextColor()
				}
                            }
                    }, {
                            from: 1.5,
                            to: 3.0,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'OVC',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 3.0,
                            to: 4.5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'BKN',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 4.5,
                            to: 7.5,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'SCT',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 7.5,
                            to: 10.5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'FEW',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 10.5,
                            to: 12.0,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'CLR',
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
                            return Highcharts.dateFormat('%A, %b %e, %Y', this.x) +'<br/>Condition: <b>'+ this.y +'</b>';
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
		    id: 'skyConditionSeries',
                    name: 'Sky Condition',
		    color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                    data: []
            }]
    });

    /**
     * HS and HN24 Combo Chart
     */
    // TODO: put height point label on today's point
    // TODO: use powdercloud colors for the series
    hsHn24ComboHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'hsHn24ComboHighChart',
                    borderWidth: 0,
                    marginLeft: 75,
                    //marginBottom: 50,
		    spacingTop: 5,
		    spacingBottom: 0,
		    spacingLeft: 0,
		    spacingRight: 0
            },
	    exporting: {
		enabled: false
	    },
            title: {
                    //text: 'HS & HN24',
		    text: null,
		    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
            },
            subtitle: {
                    text: null,
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
                                    from: plotBand_today_startDate,
                                    to:   plotBand_today_endDate,
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
		enabled: false,
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

    /**
     * Temperature Range Chart
     */
    // TODO: use powdercloud colors for the series
    temperatureRangeHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'temperatureRangeHighChart',
                    defaultSeriesType: 'line',
                    borderWidth: 0,
                    marginLeft: 75,
                    //marginBottom: 50,
		    spacingTop: 5,
		    spacingBottom: 0,
		    spacingLeft: 0,
		    spacingRight: 0
            },
	    exporting: {
		enabled: false
	    },
            title: {
                    //text: 'Temperature Range',
		    text: null,
		    style: {
			color: powdercloudHighChartsUtil.getTextColor()
		    }
            },
            subtitle: {
                    text: null,
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
                                    from: plotBand_today_startDate,
                                    to:   plotBand_today_endDate,
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
		enabled: false,
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
                    //marginBottom: 50,
		    spacingTop: 5,
		    spacingBottom: 0,
		    spacingLeft: 0,
		    spacingRight: 0
            },
            exporting: {
		enabled: false
	    },
            title: {
                    //text: 'Wind Speed',
		    text: null,
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
                                    from: plotBand_today_startDate,
                                    to:   plotBand_today_endDate,
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
		    enabled: false
		    /*
                    align: 'center',
                    verticalAlign: 'bottom',
                    y: 10,
                    floating: true,
                    borderWidth: 1
		    */
            },
            series: [{
		    id: 'windSpeedSeries',
                    name: 'Wind Speed',
                    color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                    data: []
            }]
    });

    precipRateHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'precipRateHighChart',
                    defaultSeriesType: 'line',
		    borderWidth: 0,
                    marginLeft: 75,
                    //marginBottom: 50,
		    spacingTop: 5,
		    spacingBottom: 0,
		    spacingLeft: 0,
		    spacingRight: 0
            },
            exporting: {
		enabled: false
	    },
            title: {
                    //text: 'Precipitation Rate',
		    text: null,
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
                                    from: plotBand_today_startDate,
                                    to:   plotBand_today_endDate,
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
            yAxis: {
                    title: {
                            text: 'Precipitation Rate',
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
                               text: 'No',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 1,
                            to: 2,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'RA',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 2,
                            to: 3,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'SN',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 3,
                            to: 4,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'RS',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 4,
                            to: 5,
                            color: 'rgba(148, 148, 148, 0.1)',
                            label: {
                               text: 'GR',
                               style: {
                                      color: powdercloudHighChartsUtil.getTextColor()
                               }
                            }
                    }, {
                            from: 5,
                            to: 6,
                            color: 'rgba(0, 0, 0, 0)',
                            label: {
                               text: 'ZR',
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
			    var category = null;
			    switch(this.y)
			    {
				case 0.5:
					category = "No";
					break;
				case 1.5:
					category = "RA";
					break;
				case 2.5:
					category = "SN";
					break;
				case 3.5:
					category = "RS";
					break;
				case 4.5:
					category = "GR";
					break;
				case 5.5:
					category = "ZR";
					break;
				default:
					category = null;
			    }
			    if (category != null) {
				return Highcharts.dateFormat('%A, %b %e, %Y', this.x) +'<br/>Precipitation Rate: <b>'+ category +'</b>';
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
		    enabled: false
		    /*
                    align: 'center',
                    verticalAlign: 'bottom',
                    y: 10,
                    floating: true,
                    borderWidth: 1
		    */
            },
            series: [{
		    id: 'precipRateSeries',
                    name: 'Precipitation Rate',
                    color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                    data: []
            }]
    });

    /**
     * Number of Avalanches Chart
     */
    numAvalanchesHighChart = new Highcharts.Chart({
            chart: {
                    renderTo: 'numAvalanchesHighChart',
                    defaultSeriesType: 'column',
                    borderWidth: 0,
                    marginLeft: 75,
                    //marginBottom: 50,
		    spacingTop: 5,
		    spacingBottom: 0,
		    spacingLeft: 0,
		    spacingRight: 0
            },
	    exporting: {
		enabled: false
	    },
            title: {
                    //text: 'Number of Avalanches',
		    text: null,
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
                                    from: plotBand_today_startDate,
                                    to:   plotBand_today_endDate,
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
            yAxis: {
		    title: {
                            text: 'Number of Avalanches',
                            style: {
                                color: powdercloudHighChartsUtil.getTextColor()
                            }
                    },
                    min: 0,
                    max: 20,
		    startOnTick: false
            },
            tooltip: {
                    shared: false,
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
                    name: 'Number of Avalanches',
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
    var sky_cond_data = new Array();
    var wind_speed_data = new Array();
    var precip_rate_data = new Array();
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

            if (item.data.sky_condition_code) {
                    var iconValue = null;
                    var yValue = null;
                    switch(item.data.sky_condition_code)
                    {
                            case "X":
                                    iconValue = "obscured.gif";
                                    yValue = 1;
                                    break;
                            case "OVC":
                                    iconValue = "overcast.gif";
                                    yValue = 2;
                                    break;
                            case "BKN":
                                    iconValue = "broken.gif";
                                    yValue = 4;
                                    break;
                            case "SCT":
                                    iconValue = "scattered.gif";
                                    yValue = 6;
                                    break;
                            case "FEW":
                                    iconValue = "few.gif";
                                    yValue = 8;
                                    break;
                            case "CLR":
                                    iconValue = "clear.gif";
                                    yValue = 12;
                                    break;
                    }
                    if (iconValue != null && yValue != null) {
                            sky_cond_data.push({
                                    marker: {symbol: 'url(/static/client/hc/graphics/' + iconValue + ')'},
                                    x: Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)),
                                    y: yValue
                            });
                    }
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

	    // Precip Rate - Start
	    if (item.data.wind_speed_cat) {
                    var yValue = null;
                    switch(item.data.precipitation_type_rate_code)
                    {
                            case "No":
				    yValue = 0.5;
				    break;
			    case "RA":
				    yValue = 1.5;
				    break;
			    case "SN":
				    yValue = 2.5;
				    break;
			    case "RS":
				    yValue = 3.5;
				    break;
			    case "GR":
				    yValue = 4.5;
				    break;
			    case "ZR":
				    yValue = 5.5;
				    break;
                    }
		    if (yValue != null) {
			    precip_rate_data.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), yValue]);
		    }
            }
	    // Precip Rate - End
    }, this);

    // 3. Charts

    // 3b. Hs & Hn24
    if (hsHn24ComboHighChart.get('hsSeries')) {
	hsHn24ComboHighChart.get('hsSeries').setData(hs_accumulated_data);
    }
    if (hsHn24ComboHighChart.get('hn24Series')) {
	hsHn24ComboHighChart.get('hn24Series').setData(hn24_accumulated_data);
    }
    if (hsHn24ComboHighChart.get('xAxis')) {
	hsHn24ComboHighChart.get('xAxis').setExtremes(viewableStartDateUTC, viewableEndDateUTC);
    }

    // 3e. Temperature Range
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

    // 3f. Sky Condition
    if (skyConditionStepLineHighChart.get('skyConditionSeries')) {
	skyConditionStepLineHighChart.get('skyConditionSeries').setData(sky_cond_data);
    }
    if (skyConditionStepLineHighChart.get('xAxis')) {
	skyConditionStepLineHighChart.get('xAxis').setExtremes(viewableStartDateUTC, viewableEndDateUTC);
    }
    
    if (windHighChart.get('windSpeedSeries')) {
	windHighChart.get('windSpeedSeries').setData(wind_speed_data);
    }
    if (windHighChart.get('xAxis')) {
	windHighChart.get('xAxis').setExtremes(viewableStartDateUTC, viewableEndDateUTC);
    }
    
    if (precipRateHighChart.get('precipRateSeries')) {
	precipRateHighChart.get('precipRateSeries').setData(precip_rate_data);
    }
    if (precipRateHighChart.get('xAxis')) {
	precipRateHighChart.get('xAxis').setExtremes(viewableStartDateUTC, viewableEndDateUTC);
    }
}

Controller.prototype.populateAvalancheEventStandardHighChartsData = function(records, _startDate, _endDate){

    // 1. Viewable Dates
    var viewableStartDateUTC = powdercloudHighChartsUtil.generateViewableStartDateUTC(_startDate);
    var viewableEndDateUTC = powdercloudHighChartsUtil.generateViewableEndDateUTC(_endDate);

    // 2. Data
    var numAvalanches_data = [];

    Ext.each(records, function(item, index) {

        var date = item.data.date_time_start;

	// Num Avalanches - Start
        var key = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999));
        var isKeyPresent = false;
        Ext.each(numAvalanches_data, function (inner_item, inner_index){
            if(inner_item[0] == key){
                inner_item[1] = inner_item[1] + 1;
                isKeyPresent = true;
            }
        });
        if(!isKeyPresent){
            numAvalanches_data.push([key, 1]);
        }
	// Num Avalanches - End
    }, this);

    // 3. Charts
    // 3a. Number of Avalanches
    if (numAvalanchesHighChart.get('numAvSeries')) {
	numAvalanchesHighChart.get('numAvSeries').setData(numAvalanches_data);
    }
    if (numAvalanchesHighChart.get('xAxis')) {
	numAvalanchesHighChart.get('xAxis').setExtremes(viewableStartDateUTC, viewableEndDateUTC);
    }

}
