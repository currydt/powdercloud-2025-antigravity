var controller, grid, masterStore, mapOverlay, container,
    chart1, chart2, chart3, chart4, chart5, windHighChart,
    filterCmp, powdercloudSvgRose, powdercloudHighChartsUtil;

function Controller() {
    this.store = masterStore;
    this.map = Ext.getCmp('mapViewer');
    this.chart1 = chart1;
    this.chart2 = chart2;
    this.chart3 = chart3;
    this.chart4 = chart4;
    this.chart5 = chart5;
    this.filterCmp = filterCmp;
    // data sets
    this.chart_data_num_of_weather = [];
    this.chart_data_sky_cond = [];
    this.chart_data_hs = [];
    this.chart_data_hn24 = [];
    this.chart_data_wind_speed = [];
    this.chart_data_air_temperature_max = [];
    this.chart_data_air_temperature_min = [];
    Ext.StoreMgr.lookup('locationWithBlankRecord').load();

    this.store.on('load', function (store, records, options) {
        this.series = [];
        var opNames = store.collect('operation_desc');
        Ext.each(opNames, function (item) {
            this.series.push({
                name: item,
                chart_data_num_of_weather: [],
                chart_data_sky_cond: [],
                chart_data_hs: [],
                chart_data_hn24: [],
                chart_data_wind_speed: [],
                chart_data_air_temperature_max: [],
                chart_data_air_temperature_min: []
            });
        }, this);

        this.map.clearOverlays();
        this.rose_data = [];
        store.each(function (record) {
            this.map.addMapData(record.data.map_overlay, record);
            if (record.data.type_desc == "weatherstudyplotstandard" || record.data.type_desc == "weatherfieldsummary") {
                Ext.each(this.series, function (item) {
                    if (item.name == record.data.operation_desc) {
                        var date = record.data.date_time_start;

                        // Chart 1 Data - Start
                        var key = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999));
                        var isKeyPresent = false;

                        Ext.each(item.chart_data_num_of_weather, function (item, index) {
                            if (item[0] == key) {
                                item[1] = item[1] + 1;
                                isKeyPresent = true;
                            }
                        });
                        if (!isKeyPresent) {
                            item.chart_data_num_of_weather.push([key, 1]);
                        }
                        // Chart 1 Data - End

                        // Chart 2 Data - Start
                        if (record.data.sky_condition) {
                            var iconValue = null;
                            var yValue = null;
                            switch (record.data.sky_condition_code) {
                                case "X":
                                    iconValue = "obscured.gif";
                                    yValue = 0.5;
                                    break;
                                case "OVC":
                                    iconValue = "overcast.gif";
                                    yValue = 1.5;
                                    break;
                                case "BKN":
                                    iconValue = "broken.gif";
                                    yValue = 2.5;
                                    break;
                                case "SCT":
                                    iconValue = "scattered.gif";
                                    yValue = 3.5;
                                    break;
                                case "FEW":
                                    iconValue = "few.gif";
                                    yValue = 4.5;
                                    break;
                                case "CLR":
                                    iconValue = "clear.gif";
                                    yValue = 5.5;
                                    break;
                            }
                            if (iconValue != null && yValue != null) {
                                item.chart_data_sky_cond.push({
                                    marker: { symbol: 'url(/static/client/hc/graphics/' + iconValue + ')' },
                                    x: Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)),
                                    y: yValue
                                });
                            }
                        }
                        // Chart 2 Data - End

                        // Chart 3 Data - Start
                        if (record.data.hs_accumulated !== null) {
                            item.chart_data_hs.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), record.data.hs_accumulated]);
                        }
                        if (record.data.hn24_accumulated !== null) {
                            item.chart_data_hn24.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), record.data.hn24_accumulated]);
                        }
                        // Chart 3 Data - End

                        // Chart 4 Data - Start
                        if (record.data.wind_speed_cat) {
                            var yValue = null;
                            switch (record.data.wind_speed_cat_code) {
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
                                item.chart_data_wind_speed.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), yValue]);
                            }
                        }
                        // Chart 4 Data - End

                        // Chart 5 Data - Start
                        if (record.data.air_temperature_max !== null) {
                            item.chart_data_air_temperature_max.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), record.data.air_temperature_max]);
                        }
                        if (record.data.air_temperature_min !== null) {
                            item.chart_data_air_temperature_min.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), genRnd(999)), record.data.air_temperature_min]);
                        }
                        // Chart 5 Data - End

                        return false;
                    }
                    return true;
                }, this);


                // ROSE Data - Start
                var roseDateItem = {
                    "type": TYPE_WEATHER,
                    "elevation": record.data.elevation_min,
                    "aspectCode": record.data.aspect_start_code,
                    "description": record.data.comments_internal
                };
                this.rose_data.push(roseDateItem);
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
Controller.prototype.drawRose = function () {
    /*
        ROSE
    */
    var svgWidth = 750;
    var svgHeight = 600;
    document.getElementById('svg_div').style.width = svgWidth + "px";
    document.getElementById('svg_div').style.height = svgHeight + "px";
    document.getElementById('svg_div').style.border = '1px solid #000000';
    powdercloudSvgRose = new PowdercloudSvgRose(svgWidth, svgHeight, false, true, 150);
    $('#svg_div').svg({ onLoad: powdercloudSvgRose.drawChart });
}
Controller.prototype.drawCharts = function () {
    /*
        CHARTS
    */
    powdercloudHighChartsUtil = new PowderCloudHighChartsUtil();
    /*
    chart1 = new Highcharts.Chart({
            chart: {
                    renderTo: 'chart1',
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
                    text: 'Number of Weather Study Events',
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
                    name: 'Number',
                    color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
                    data: []
            }]

    });
    */
    chart2 = new Highcharts.Chart({
        chart: {
            renderTo: 'chart2',
            defaultSeriesType: 'line',
            borderWidth: 0,
            marginLeft: 75,
            marginBottom: 50,
            width: 1000
        },
        exporting: {
            enabled: false
        },
        title: {
            text: 'Sky Conditions',
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
                text: 'Condition',
                style: {
                    color: powdercloudHighChartsUtil.getTextColor()
                }
            },
            labels: { enabled: false },
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
                    text: 'X',
                    style: {
                        color: powdercloudHighChartsUtil.getTextColor()
                    }
                }
            }, {
                from: 1,
                to: 2,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'OVC',
                    style: {
                        color: powdercloudHighChartsUtil.getTextColor()
                    }
                }
            }, {
                from: 2,
                to: 3,
                color: 'rgba(148, 148, 148, 0.1)',
                label: {
                    text: 'BKN',
                    style: {
                        color: powdercloudHighChartsUtil.getTextColor()
                    }
                }
            }, {
                from: 3,
                to: 4,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'SCT',
                    style: {
                        color: powdercloudHighChartsUtil.getTextColor()
                    }
                }
            }, {
                from: 4,
                to: 5,
                color: 'rgba(148, 148, 148, 0.1)',
                label: {
                    text: 'FEW',
                    style: {
                        color: powdercloudHighChartsUtil.getTextColor()
                    }
                }
            }, {
                from: 5,
                to: 6,
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
            formatter: function () {
                return Highcharts.dateFormat('%A, %b %e, %Y', this.x) + '<br/>Condition: <b>' + SkyCondition(this.y) + '</b>';
            }
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
            align: 'center',
            verticalAlign: 'bottom',
            y: 10,
            floating: true,
            borderWidth: 1,
            enabled: false
        },
        series: [{
            id: 'skyConditionSeries',
            name: 'Sky Condition',
            color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
            data: []
        }]

    });
    chart3 = new Highcharts.Chart({
        chart: {
            renderTo: 'chart3',
            borderWidth: 0,
            marginLeft: 75,
            marginBottom: 50,
            width: 1000
        },
        exporting: {
            enabled: false
        },
        title: {
            text: 'Height of Snow (HS) & Height of New Snow (HN24)',
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
            align: 'center',
            verticalAlign: 'bottom',
            y: 10,
            floating: true,
            borderWidth: 1,
            enabled: false
        },
        series: [{
            id: 'hsSeries',
            type: 'column',
            name: 'HS',
            color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
            data: []
        }, {
            id: 'hn24Series',
            type: 'column',
            name: 'HN24',
            color: powdercloudHighChartsUtil.getSeriesColorScheme(1),
            data: []
        }]

    });
    chart4 = new Highcharts.Chart({
        chart: {
            renderTo: 'chart4',
            defaultSeriesType: 'line',
            borderWidth: 0,
            marginLeft: 75,
            marginBottom: 50,
            width: 1000
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
            max: filterCmp.end_date,
            min: filterCmp.start_date
        },
        yAxis: {
            title: {
                text: 'Wind Speed',
                style: {
                    color: powdercloudHighChartsUtil.getTextColor()
                }
            },
            labels: { enabled: false },
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
            formatter: function () {
                return Highcharts.dateFormat('%A, %b %e, %Y', this.x) + '<br/>Wind Speed: <b>' + WindSpeed(this.y) + '</b>';
            }
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
            align: 'center',
            verticalAlign: 'bottom',
            y: 10,
            floating: true,
            borderWidth: 1,
            enabled: false
        },
        series: [{
            id: 'windSpeedSeries',
            name: 'Wind Speed',
            color: powdercloudHighChartsUtil.getSeriesColorScheme(0),
            data: []
        }]

    });

    chart5 = new Highcharts.Chart({
        chart: {
            renderTo: 'chart5',
            defaultSeriesType: 'line',
            borderWidth: 0,
            marginLeft: 75,
            marginBottom: 50,
            width: 1000
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
                text: 'Temperature',
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
            align: 'center',
            verticalAlign: 'bottom',
            y: 10,
            floating: true,
            borderWidth: 1,
            enabled: false
        },
        series: [
            {
                id: 'maxSeries',
                color: '#BBBBBB',
                name: 'Max',
                data: []
            }, {
                id: 'minSeries',
                color: '#BBBBBB',
                name: 'Min',
                data: []
            }
        ]

    });

}
Controller.prototype.redrawChartData = function () {

    var plotBand_today_date = new Date();
    var plotBand_today_dateUTC = Date.UTC(plotBand_today_date.getFullYear(), plotBand_today_date.getMonth(), plotBand_today_date.getDate(), 0, 0, 0, 0);
    var plotBand_today_startDateUTC = Date.UTC(plotBand_today_date.getFullYear(), plotBand_today_date.getMonth(), plotBand_today_date.getDate() - 1, 12, 30, 30, 500);
    var plotBand_today_endDateUTC = Date.UTC(plotBand_today_date.getFullYear(), plotBand_today_date.getMonth(), plotBand_today_date.getDate(), 12, 30, 30, 500);

    var plotBandToday = {
        id: 'plotBandToday',
        from: plotBand_today_startDateUTC,
        to: plotBand_today_endDateUTC,
        color: 'rgba(68, 170, 213, .1)',
        events: {
            click: function (e) {
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
    // remove all series from all charts
    while (chart2.series.length > 0) {
        chart2.series[0].remove();
    }
    while (chart3.series.length > 0) {
        chart3.series[0].remove();
    }
    while (chart4.series.length > 0) {
        chart4.series[0].remove();
    }
    while (chart5.series.length > 0) {
        chart5.series[0].remove();
    }

    Ext.each(this.series, function (seriesData) {
        //chart1.series[0].setData(this.chart_data_num_of_weather);
        //chart1.get('xAxis').addPlotBand(plotBandToday);
        //chart1.get('xAxis').setExtremes(chartStartDateUTC, chartEndDateUTC);

        chart2.addSeries({
            name: seriesData.name,
            data: seriesData.chart_data_sky_cond
        });

        chart3.addSeries({
            name: seriesData.name + ' HS',
            data: seriesData.chart_data_hs
        });
        chart3.addSeries({
            name: seriesData.name + ' HN24',
            data: seriesData.chart_data_hn24
        });
        chart4.addSeries({
            name: seriesData.name + ' Wind Speed',
            data: seriesData.chart_data_wind_speed
        });
        chart5.addSeries({
            name: seriesData.name + ' Min',
            data: seriesData.chart_data_air_temperature_min
        });
        chart5.addSeries({
            name: seriesData.name + ' Max',
            data: seriesData.chart_data_air_temperature_max
        });
    }, this);
    if (chart2.get('xAxis')) {
        chart2.get('xAxis').removePlotBand('plotBandToday');
        chart2.get('xAxis').addPlotBand(plotBandToday);
        chart2.get('xAxis').setExtremes(chartStartDateUTC, chartEndDateUTC);
    }
    if (chart3.get('xAxis')) {
        chart3.get('xAxis').removePlotBand('plotBandToday');
        chart3.get('xAxis').addPlotBand(plotBandToday);
        chart3.get('xAxis').setExtremes(chartStartDateUTC, chartEndDateUTC);
    }
    if (chart4.get('xAxis')) {
        chart4.get('xAxis').removePlotBand('plotBandToday');
        chart4.get('xAxis').addPlotBand(plotBandToday);
        chart4.get('xAxis').setExtremes(chartStartDateUTC, chartEndDateUTC);
    }
    if (chart5.get('xAxis')) {
        chart5.get('xAxis').removePlotBand('plotBandToday');
        chart5.get('xAxis').addPlotBand(plotBandToday);
        chart5.get('xAxis').setExtremes(chartStartDateUTC, chartEndDateUTC);
    }
}
/*
Controller.prototype.generateViewableStartDateUTC = function(_startDate){
    var viewableStartDate = new Date(_startDate);
    viewableStartDate.setDate(viewableStartDate.getDate() - 1); // NOTE: use day before desired start date, or else data points/bars/etc get cut-off if it on the first date
    var viewableStartDateUTC = Date.UTC(viewableStartDate.getFullYear(), viewableStartDate.getMonth(), viewableStartDate.getDate());
    return viewableStartDateUTC;
}

Controller.prototype.generateViewableEndDateUTC = function(_endDate){
    var viewableEndDate = new Date(_endDate);
    viewableEndDate.setDate(viewableEndDate.getDate() + 1); // NOTE: use day before desired start date, or else data points/bars/etc get cut-off if it on the first date
    var viewableEndDateUTC = Date.UTC(viewableEndDate.getFullYear(), viewableEndDate.getMonth(), viewableEndDate.getDate());
    return viewableEndDateUTC;
}
*/
Ext.onReady(function () {
    Ext.QuickTips.init();
    /*
        FILTER
    */
    filterCmp = new ModeDaterangeFilter();

    /*
        STORE
    */
    masterStore = new ModeDaterangeFilterStore({
        autoLoad: false,
        baseParams: {
            entity: 'Weather',
            type__ObservationType__lookup: 'weatherfieldsummary,weathernarrative,weatherstudyplotstandard,weatherstudyplotbrief',
            sort: 'date_time_start',
            dir: 'DESC',
            'date_time_start__range': filterCmp.start_date.format('Y-m-d 00:00') + '/' + filterCmp.end_date.format('Y-m-d 23:59'),
            start: 0,
            limit: PAGING_LIMIT
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'rows'
        }, WeatherVO)
    });
    filterCmp.regStore(masterStore);

    /*
        MAP
    */
    // mapOverlay = new Ext.Panel({
    //     defaults: {
    //         anchor: '0'
    //     },
    //     items:[{
    //         xtype: 'gmappanel',
    //         itemId: 'mapViewer',
    //         id: 'mapViewer',
    //         //width: 966,
    //         width: '100%',
    //         height: 600,
    //         gmapType: 'map',
    //     overlayDetailFields:[{
    // 	name: 'date_time_start',
    // 	fieldLabel: 'Date and time',
    // 	renderer: 'date',
    // 	format: getDateFormat()
    //     },{
    // 	name: 'failure_type_desc',
    // 	fieldLabel: 'Failure Type'
    //     },{
    // 	name: 'destructive_size_max_desc',
    // 	fieldLabel: 'Destructive Size Max'
    //     },{
    // 	name: 'destructive_size_min_desc',
    // 	fieldLabel: 'Destructive Size Min'
    //     },{
    // 	name: 'trigger_desc',
    // 	fieldLabel: 'Trigger'
    //     },{
    // 	name: 'trigger_minor_desc',
    // 	fieldLabel: 'Trigger minor'
    //     }]
    //     }]
    // });

    /*
        TABLE
    */
    var expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
            '<p><b>Comment:</b> {comments_internal}</p>'
        )
    });
    // create the Grid
    grid = new Ext.grid.GridPanel({
        store: masterStore,
        plugins: [expander],
        width: 970,
        autoScroll: true,
        loadMask: true,
        tbar: new Ext.Toolbar({
            items: [
                'Search by Location: ',
                {
                    xtype: 'combo',
                    store: 'locationWithBlankRecord',
                    searchBy: 'terrain',
                    searchStore: masterStore,
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
                        select: function (cmp, record) {
                            if (cmp.lastSearchValue === undefined || cmp.lastSearchValue != cmp.getValue()) {
                                if (Ext.isEmpty(cmp.getValue())) {
                                    delete cmp.searchStore.baseParams[cmp.searchBy];
                                } else {
                                    cmp.searchStore.setBaseParam(cmp.searchBy, cmp.getValue());
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
            //{
            //    id       :'',
            //    header   : 'Observation Quatlity',
            //    width    : 100,
            //    sortable : true,
            //    dataIndex: ''
            //},
            {
                id: 'datetime',
                header: 'Date and time',
                width: 100,
                sortable: true,
                dataIndex: 'date_time_start',
                renderer: formatDate
            },
            {
                id: 'operation',
                header: 'Operation',
                width: 80,
                sortable: false,
                dataIndex: 'operation_desc'
            },
            {
                id: 'location',
                header: 'Location',
                width: 120,
                sortable: false,
                dataIndex: 'terrain_desc'
            },
            {
                id: 'type',
                header: 'Type',
                width: 150,
                sortable: false,
                dataIndex: 'type_desc'
            },
            {
                id: 'ElevationMin',
                header: 'Min Elev.',
                width: 75,
                sortable: false,
                dataIndex: 'elevation_min'
            },
            {
                id: 'ElevationMax',
                header: 'Max El.',
                width: 75,
                sortable: false,
                dataIndex: 'elevation_max'
            },
            {
                id: 'StartAspect',
                header: 'Start Aspect',
                width: 75,
                sortable: false,
                dataIndex: 'aspect_start_code'
            },
            {
                id: 'EndAspect',
                header: 'End Aspect',
                width: 75,
                sortable: false,
                dataIndex: 'aspect_end_code'
            },
            {
                id: 'sky',
                header: 'Sky',
                width: 50,
                sortable: false,
                dataIndex: 'sky_condition_code'
            },
            {
                id: 'valleyFogElevationMin',
                header: 'VF Min Elev.',
                width: 75,
                sortable: true,
                dataIndex: 'valley_fog_elevation_min'
            },
            {
                id: 'valleyFogElevationMin',
                header: 'VF Min Elev.',
                width: 75,
                sortable: true,
                dataIndex: 'valley_fog_elevation_min'
            },
            {
                id: 'valleyFogElevationMax',
                header: 'VF Max Elev.',
                width: 75,
                sortable: true,
                dataIndex: 'valley_fog_elevation_max'
            },
            {
                id: 'precipitationRateCode',
                header: 'Precip. Rate',
                width: 75,
                sortable: false,
                dataIndex: 'precipitation_rate_code'
            },
            {
                id: 'precipitationTypeCode',
                header: 'Precip. Type',
                width: 75,
                sortable: false,
                dataIndex: 'precipitation_type_code'
            },
            {
                id: 'AirTemperatureMax',
                header: 'Temp. Max',
                width: 75,
                sortable: false,
                dataIndex: 'air_temperature_max'
            },
            {
                id: 'AirTemperatureMin',
                header: 'Temp. Min',
                width: 75,
                sortable: false,
                dataIndex: 'air_temperature_min'
            },
            {
                id: 'AirTemperaturePresent',
                header: 'Temp. Present',
                width: 100,
                sortable: false,
                dataIndex: 'air_temperature_present'
            },
            {
                id: 'thermograph',
                header: 'Thermograph',
                width: 75,
                sortable: true,
                dataIndex: 'thermograph'
            },
            {
                id: 'thermographTrend',
                header: 'Thermograph Trend',
                width: 100,
                sortable: true,
                dataIndex: 'thermograph_trend_code'
            },
            {
                id: 'relativeHumidityNum',
                header: 'RH',
                width: 50,
                sortable: true,
                dataIndex: 'relative_humidity_num'
            },
            {
                id: 'penFoot',
                header: 'Pen Foot',
                width: 50,
                sortable: true,
                dataIndex: 'pen_foot'
            },
            {
                id: 'penSki',
                header: 'Pen Ski',
                width: 50,
                sortable: true,
                dataIndex: 'pen_ski'
            },
            {
                id: 'penRam',
                header: 'Pen Ram',
                width: 50,
                sortable: true,
                dataIndex: 'pen_ram'
            },
            {
                id: 'snowTempT0',
                header: 'T0',
                width: 50,
                sortable: false,
                dataIndex: 'snow_temperature_T_0'
            },
            {
                id: 'snowTempT10',
                header: 'T10',
                width: 50,
                sortable: false,
                dataIndex: 'snow_temperature_T_10'
            },
            {
                id: 'hin',
                header: 'HIN',
                width: 50,
                sortable: true,
                dataIndex: 'hin_accumulated'
            },
            {
                id: 'H2DAccumulated',
                header: 'H2D',
                width: 50,
                sortable: false,
                dataIndex: 'h2d_accumulated'
            },
            {
                id: 'H2DaterEquivalent',
                header: 'H2D WE',
                width: 70,
                sortable: false,
                dataIndex: 'h2d_water_equivalent'
            },
            {
                id: 'HN24Accumulated',
                header: 'HN24',
                width: 50,
                sortable: false,
                dataIndex: 'hn24_accumulated'
            },
            {
                id: 'HN24WaterEquivalent',
                header: 'HN24 WE',
                width: 70,
                sortable: false,
                dataIndex: 'hn24_water_equivalent'
            },
            {
                id: 'hst',
                header: 'HST',
                width: 50,
                sortable: false,
                dataIndex: 'hst_accumulated'
            },
            {
                id: 'HstWaterEquivalent',
                header: 'HST',
                width: 70,
                sortable: false,
                dataIndex: 'hst_water_equivalent'
            },
            {
                id: 'hit',
                header: 'HIT',
                width: 50,
                sortable: true,
                dataIndex: 'hit_accumulated'
            },
            {
                id: 'hsb',
                header: 'HSB',
                width: 50,
                sortable: true,
                dataIndex: 'hsb_accumulated'
            },
            {
                id: 'HsAccumulated',
                header: 'HS',
                width: 50,
                sortable: false,
                dataIndex: 'hs_accumulated'
            },
            {
                id: 'precipGauge',
                header: 'Precip. Gauge',
                width: 75,
                sortable: false,
                dataIndex: 'precipitation_gauge'
            },

            {
                id: 'rainGauge',
                header: 'Rain Gauge',
                width: 75,
                sortable: false,
                dataIndex: 'rain_gauge'
            },
            {
                id: 'surfaceSnowForm',
                header: 'Snow Form',
                width: 75,
                sortable: false,
                dataIndex: 'surface_snow_form_code'
            },
            {
                id: 'surfaceSnowSize',
                header: 'Snow Size',
                width: 75,
                sortable: false,
                dataIndex: 'surface_snow_size'
            },
            {
                id: 'surfaceSnowForm2',
                header: 'Snow Form 2',
                width: 75,
                sortable: false,
                dataIndex: 'surface_snow_form_2_code'
            },
            {
                id: 'surfaceSnowSize2',
                header: 'Snow Size 2',
                width: 75,
                sortable: false,
                dataIndex: 'surface_snow_size_2'
            },
            {
                id: 'windDirectionCat',
                header: 'Wind Dir.',
                width: 75,
                sortable: false,
                dataIndex: 'wind_direction_cat_code'
            },
            {
                id: 'windSpeedCat',
                header: 'Wind Speed',
                width: 75,
                sortable: false,
                dataIndex: 'wind_speed_cat_code'
            },
            {
                id: 'windDGustCat',
                header: 'Gust Speed',
                width: 75,
                sortable: false,
                dataIndex: 'wind_gust_code'
            },
            {
                id: 'ridgeBlowingSnowDirection',
                header: 'Ridge Blow Dir.',
                width: 120,
                sortable: true,
                dataIndex: 'ridge_blowing_snow_direction_code'
            },
            {
                id: 'ridgeBlowingSnowTransport',
                header: 'Ridge Blow Trans.',
                width: 120,
                sortable: true,
                dataIndex: 'ridge_blowing_snow_transport_code'
            },
            {
                id: 'barometricPressure',
                header: 'Baro. Pressure',
                width: 120,
                sortable: false,
                dataIndex: 'barometric_pressure'
            }, {
                id: 'barometricPressureTendency',
                header: 'Baro. Pressure Tend.',
                width: 120,
                sortable: false,
                dataIndex: 'barometric_pressure_tendency_code'
            },
            {
                id: 'subject',
                header: 'Description',
                width: 100,
                sortable: true,
                dataIndex: 'subject'
            },

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
        renderTo: 'table-loc',
        plain: true,
        border: false,
        autoWidth: true,
        items: [

            new Ext.form.FieldSet({
                title: 'Table',
                width: '100%',
                collapsible: true,
                collapsed: false,
                border: true,
                items: [{
                    xtype: 'container',
                    html: '<p>The following table displays the weather fields in textual format. You can select an individual column to resize it; change its position,  or to hide and show the column. You can sort by date and time in ascending or descending order.</p>'
                },
                    grid
                ]
            }),


            new Ext.form.FieldSet(
                {
                    title: 'Charts',
                    width: '100%',
                    collapsible: true,
                    collapsed: false,
                    border: true,
                    items: [{
                        xtype: 'container',
                        html: '<p>The following section displays the weather observations summarized within an HS and HN24, a temperature rannge and wind charts.</p>'
                    },
                    new Ext.Container({
                        html: '<div id="dvCharts">' +
                            //TODO should probably give chart# vars better names so you can tell which is which and also display order can be changed later without the number-naming appearing mixed up.
                            //'<div id="chart1" class="dvDashboardChart"></div>'+
                            '<div id="chart3" class="dvDashboardChart"></div>' +
                            '<div id="chart2" class="dvDashboardChart"></div>' +
                            '<div id="chart5" class="dvDashboardChart"></div>' +
                            '<div id="chart4" class="dvDashboardChart"></div>' +
                            '</div>',
                        forceLayout: true,
                        listeners: {
                            afterrender: {
                                scope: this,
                                fn: controller.drawCharts
                            }
                        }
                    })
                    ]
                }),


            // new Ext.form.FieldSet({
            // title: 'Map Overlay',
            // width: '100%',
            // collapsible: false,
            // border: true,
            // items:[{
            // xtype:'container',
            // html:'<p>The following map displays the location of the various observations. You can mange the view by using the toolbar (for example, Map or Earth). You can alter the scale using the vertical scale, and while in Earth mode you can alter the prespecitve with the upper left control.</p>'
            // },
            // mapOverlay
            // ],
            // listeners:{
            // scope: this,
            // expand: function(cmp){
            // var temp = Ext.getCmp('mapViewer');
            // temp.getMap().checkResize();
            // }
            // }
            // }),


            new Ext.form.FieldSet({
                title: 'Rose Overlay',
                width: '100%',
                collapsible: true,
                collapsed: true,
                border: true,
                items: [{
                    xtype: 'container',
                    html: '<p>The following chart displays the Weather Events as a Rose Overlay.</p>'
                },
                new Ext.Container(
                    {
                        html: '<div id="svg_div"></div>',
                        listeners: {
                            afterrender: {
                                scope: this,
                                fn: controller.drawRose
                            }
                        }
                    })
                ]
            })
            //
            //    {
            //	xtype:'container',
            //	html:'<p> </p>'
            //    },
            //    {
            //	xtype:'container',
            //	html:'<p>Persons accessing Powdercloud.com information have agreed to a Release of Liability, Waiver of Claims and Assumption of Risk Agreement and assume all risk of injury resulting from using this information. They further agree to release the contributors from liability and waive all claims against the contributors for any personal injury, death, property damage, loss or expense that may be sustained as a result of using the information provided herein by the contributors, due to any cause whatsoever, including negligence, breach of contract or breach of any statutory or other duty of care on the part of the contributors.</p>'
            //    }


        ],
        listeners: {
            afterrender: {
                scope: this,
                fn: function () {
                    // console.log('[Weather] Container rendered, loading store...');
                    // masterStore.load({ params: { start: 0, limit: PAGING_LIMIT } });
                }
            }
        }
    });
    // console.log('[Weather] Ext.onReady completed');
});
